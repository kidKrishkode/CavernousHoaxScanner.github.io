import sys
import cv2
import json
import ast

def convert_png(image_path):
    image = cv2.imread(image_path)
    filename, extension = image_path.rsplit('.', 1)

    if extension.lower() == 'png':
        new_image_path = f"{filename}.jpg"
        cv2.imwrite(new_image_path, image, [int(cv2.IMWRITE_JPEG_QUALITY), 100])
    elif extension.lower() == 'jpg':
        new_image_path = f"{filename}.png"
        cv2.imwrite(new_image_path, image, [int(cv2.IMWRITE_PNG_COMPRESSION), 0])
    else:
        print("Unsupported image format. Only PNG and JPG are supported.")
        return None

    return new_image_path

def is_image(image_path):
    # Check if the file has a valid image extension
    valid_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.gif']
    if not any(image_path.endswith(ext) for ext in valid_extensions):
        return False

    # Try to read the image using OpenCV
    try:
        img = cv2.imread(image_path)
        # If the image is read successfully, check if it's not empty
        if img is not None:
            return True
    except Exception as e:
        print(f"Error reading image: {e}")

    return False

def convert_image(image_path):
    new_image_path = convert_png(image_path)
    return new_image_path

def main():
    if len(sys.argv) != 2:
        print("Usage: imgConverter.py <list>")
        return
    input_list = ast.literal_eval(sys.argv[1])
    if is_image(input_list) == True:
        new_image_path = convert_image(input_list)
        print(new_image_path)

if __name__ == "__main__":
    main()
