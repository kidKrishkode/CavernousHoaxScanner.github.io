import cv2
import json
import numpy as np
import base64
import logging
import random

assumption = random.choice([0,1])
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

def accuracy(*args):
    try:
        if len(args) == 3:
            dataset, exp, FN = args
            TP = len(dataset) or exp
            TN, FP = 0, 0
        elif len(args) == 4:
            TP, TN, FP, FN = args
        else:
            raise ValueError("Invalid number of arguments")
        accuracy = (int(TP) + int(TN)) / (int(TP) + int(TN) + int(FP) + int(FN))
        return int(accuracy * 100)
    except:
        return None
        
def normalize(filname, basis):
    with open(filname,'r') as f:
        database = json.load(f)
        normalize_db = sorted(database, key=lambda x: x[str(basis)])
    with open(filname, 'w') as f:
        json.dump(normalize_db, f)

def ETL(inputs, outputs, json_file_path):
    try:
        with open(json_file_path, 'r') as f:
            data = json.load(f)
        if all(key in data[0].keys() for key in inputs + outputs):
            existing_entry = next((entry for entry in data if all(entry[key] == value for key, value in zip(inputs, inputs))), None)
            if existing_entry:
                data.remove(existing_entry)
            data.append(dict(zip(inputs + outputs, inputs + outputs)))
        else:
            sample_data = data[0]
            keys = list(sample_data.keys())
            joined_list = inputs + outputs
            new_data = {}
            for i, key in enumerate(keys):
                new_data[key] = joined_list[i]
            data.append(new_data)
        with open(json_file_path, 'w') as f:
            json.dump(data, f)
    except:
        print('Level data modifing not possible\n')