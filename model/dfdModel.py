import numpy as np
import tensorflow as tf
from tensorflow import keras
from keras import Sequential
from keras.layers import Dense, Conv2D, MaxPooling2D, Flatten, BatchNormalization, Dropout
from keras.callbacks import ModelCheckpoint, LearningRateScheduler, EarlyStopping
from keras.regularizers import l2
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import time
import matplotlib.pyplot as plt
from pathlib import Path
import io
import requests
from PIL import Image

# Define paths
train_dir = '/content/deepfake/train'
validation_dir = '/content/deepfake/test'
model_path = './cnn2.keras'

# Load or prepare model
def create_model():
    model = Sequential()

    model.add(Conv2D(128, (3, 3), padding='same', input_shape=(128, 128, 3), kernel_regularizer=l2(0.001)))
    model.add(BatchNormalization())
    model.add(Activation('relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.3))

    model.add(Conv2D(256, (3, 3), padding='same', kernel_regularizer=l2(0.001)))
    model.add(BatchNormalization())
    model.add(Activation('relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.3))

    model.add(Conv2D(64, (3, 3), padding='same', kernel_regularizer=l2(0.01)))
    model.add(BatchNormalization())
    model.add(Activation('tanh'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.4))

    model.add(Conv2D(64, (3, 3), padding='same', kernel_regularizer=l2(0.001)))
    model.add(BatchNormalization())
    model.add(Activation('relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.4))

    model.add(Conv2D(32, (3, 3), padding='same', kernel_regularizer=l2(0.001)))
    model.add(BatchNormalization())
    model.add(Activation('relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.4))

    model.add(Conv2D(16, (3, 3), padding='same', kernel_regularizer=l2(0.001)))
    model.add(BatchNormalization())
    model.add(Activation('relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.4))

    model.add(Conv2D(2, (3, 3), padding='same', kernel_regularizer=l2(0.001)))
    model.add(BatchNormalization())
    model.add(Activation('relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.5))

    model.add(Flatten())
    model.add(Reshape((8, -1)))  # Reshape to (time_steps, features) for RNN layers

    # RNN Layers
    model.add(LSTM(32, return_sequences=True))
    model.add(GRU(16))

    model.add(Dense(32, activation='relu', kernel_regularizer=l2(0.001)))
    model.add(Dropout(0.5))
    model.add(Dense(8, activation='relu', kernel_regularizer=l2(0.001)))
    model.add(Dropout(0.5))

    model.add(Dense(2, activation='softmax'))

    return model

# Load existing model if available
if Path(model_path).exists():
    model = keras.models.load_model(model_path)
else:
    model = create_model()

# Compile model
model.compile(optimizer=keras.optimizers.Adam(learning_rate=0.001), loss='binary_crossentropy', metrics=['accuracy'])

# Data augmentation
train_datagen = ImageDataGenerator(
    rescale=1.0/255.0,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.15,
    zoom_range=0.15,
    horizontal_flip=True
)
validation_datagen = ImageDataGenerator(rescale=1.0/255.0)

# Data generators
train_ds = train_datagen.flow_from_directory(
    directory=train_dir,
    target_size=(256, 256),
    batch_size=32,
    class_mode='binary'
)
validation_ds = validation_datagen.flow_from_directory(
    directory=validation_dir,
    target_size=(256, 256),
    batch_size=32,
    class_mode='binary'
)

# Check initial epoch time
start_time = time.time()
initial_history = model.fit(train_ds, epochs=1, validation_data=validation_ds)
first_epoch_time = time.time() - start_time

# Decide on epochs based on timing
total_epochs = 10 if first_epoch_time > 1200 else 100
save_interval = 1 if first_epoch_time > 1200 else 10

# Callbacks for saving model and adjusting learning rate
checkpoint = ModelCheckpoint(
    filepath='./models/model_epoch_{epoch}.h5', 
    save_freq=save_interval * len(train_ds), 
    save_weights_only=False, 
    verbose=1
)
early_stopping = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)

# Learning rate scheduler for gradual learning rate reduction
def lr_schedule(epoch):
    lr = 0.001
    if epoch > 80:
        lr *= 0.5e-3
    elif epoch > 60:
        lr *= 1e-3
    elif epoch > 40:
        lr *= 1e-2
    elif epoch > 20:
        lr *= 1e-1
    return lr

lr_scheduler = LearningRateScheduler(lr_schedule)

# Train model
history = model.fit(
    train_ds,
    epochs=total_epochs,
    validation_data=validation_ds,
    callbacks=[checkpoint, lr_scheduler, early_stopping]
)

# Save final model
model.save(model_path)

# Plot training history
plt.plot(history.history['accuracy'], label='Train Accuracy', color='red')
plt.plot(history.history['val_accuracy'], label='Validation Accuracy', color='blue')
plt.legend()
plt.show()

plt.plot(history.history['loss'], label='Train Loss', color='red')
plt.plot(history.history['val_loss'], label='Validation Loss', color='blue')
plt.legend()
plt.show()

# Classification function using trained model
def classify_image(image_url):
    # Load model if not already loaded
    if not Path(model_path).exists():
        print("Model not found!")
        return None
    try:
        model = keras.models.load_model(model_path)
    except Exception as e:
        print(f"Failed to load model: {e}")
        return None
        
    try:
        response = requests.get(image_url, timeout=10)
        response.raise_for_status()  # Ensure we raise for HTTP errors
        img = Image.open(io.BytesIO(response.content)).convert('RGB')
    except requests.exceptions.RequestException as e:
        print(f"Error fetching image: {e}")
        return None
    except Exception as e:
        print(f"Error processing image: {e}")
        return None

    # Preprocess the image
    try:
        img = img.resize((128, 128))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
    except Exception as e:
        print(f"Error preprocessing image: {e}")
        return None

    # Predict
    try:
        prediction = model.predict(img_array)[0][0]
        label = 'Fake' if prediction > 0.5 else 'Real'     # 0 for cat , 1 for Fake
        accuracy = round(prediction * 100, 2) if label == 'Fake' else round((1 - prediction) * 100, 2)
        return {"class": label, "accuracy": accuracy}
    except Exception as e:
        print(f"Error during prediction: {e}")
        return None

# Example usage
image_url = 'https://chsweb.verlce.app/assets/path/image.jpg'
result = classify_image(image_url)
if result:
    print(f"Class: {result['class']}, Accuracy: {result['accuracy']}%")
else:
    print("Classification failed.")
    