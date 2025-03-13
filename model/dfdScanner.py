import os
import numpy as np
import tensorflow as tf
from tensorflow import keras
from PIL import Image

# Suppress TensorFlow warnings and informational messages
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # 0 = all messages, 1 = warnings and errors, 2 = errors only, 3 = fatal errors only

# Ensure the working directory is the script's location
os.chdir(os.path.dirname(__file__))

# Load the saved Keras model
model_path = './cnn2.keras'
if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model file not found at {model_path}")
model = keras.models.load_model(model_path)

# Preprocessing function
def preprocess_image(image_path):
    try:
        img = Image.open(image_path).convert('RGB')
        img = img.resize((128, 128))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        return img_array
    except Exception as e:
        print(f"Error preprocessing image: {e}")
        return None
    
# Classification function
def classify_image(image_path):
    try:
        img_array = preprocess_image(image_path)
        if img_array is None:
            return {"error": "Failed to preprocess image"}

        prediction = model.predict(img_array)[0][0]
        label = 'Fake' if prediction > 0.5 else 'Real'
        accuracy = round(prediction * 100, 2) if label == 'Fake' else round((1 - prediction) * 100, 2)

        return {"class": label, "accuracy": accuracy}
    except Exception as e:
        return {"error": str(e)}

# Example usage
if __name__ == "__main__":
    image_path = "C:/Users/JYOTINMOY MITRA/Pictures/b823585468z-1-20231107190249-001glq46ck5r-1-0-jpg.jpg"
    result = classify_image(image_path)
    if "error" in result:
        print(f"Error: {result['error']}")
    else:
        print(f"Class: {result['class']}, Accuracy: {result['accuracy']}%")