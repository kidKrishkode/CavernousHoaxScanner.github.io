import cv2
import json
import numpy as np
import base64
import logging

img_extensions = ['.jpg', '.jpeg', '.png', '.peng', '.bmp', '.gif', '.webp', '.svg', '.jpe', '.jfif', '.tar', '.tiff', '.tga']
vdo_extensions = ['.mp4','.mov', '.wmv', '.avi', '.avchd', '.flv', '.f4v', '.swf', '.mkv', '.webm', '.html5']

def data_url_to_cv_image(data_url):
    data_url = data_url.split(',')[1]
    img_bytes = base64.b64decode(data_url)
    img_array = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    return img

def json_log(message):
    logging.basicConfig(filename='json_data.log',level=logging.DEBUG)
    logging.debug(json.dumps({"result": message}))

def is_image(image_path):
    valid_extensions = img_extensions
    if not any(image_path.endswith(ext) for ext in valid_extensions):
        return False
    try:
        img = cv2.imread(image_path)
        if img is not None:
            return True
    except Exception as e:
        print(f"Error to reading image: {e}")

    return False
