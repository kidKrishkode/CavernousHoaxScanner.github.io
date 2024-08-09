import sys
import subprocess
import json
import logging

# import require python files
import test
import diffForegBackg
# import faceDetect
import neckDetect
import resizer
import imgConverter
import imgToPdf

# def call_foreground(image_path, width, height):
#     result = subprocess.run(['python', './test.py', asset], capture_output=True, text=True)
#     return result.stdout
# logging.basicConfig(filename='json_data.log',level=logging.DEBUG)
# logging.debug(json.dumps({"result": sys.argv}))

def main():
    if len(sys.argv) <= 1:
        print("Error: Usage: main.py <list-data> <function-value>")
        return
    
    asset = []
    for i in range(0,len(sys.argv)-2):
        asset.append(sys.argv[i+1] * 1)
    function_name = sys.argv[len(sys.argv)-1]

    if function_name == 'diffForegBackg':
        foreground, background, embadded = diffForegBackg.process_image(asset)
        result = {
            "foreground": foreground,
            "background": background,
            "embadded": embadded
        }
        print(json.dumps(result))
    elif function_name == 'faceDetect':
        # face, embadded_face = faceDetect.detect_face(asset)
        # result = {
        #     "face": face,
        #     "embadded": embadded_face
        # }
        print(json.dumps(result))
    elif function_name == 'neckDetect':
        neck, embadded_neck = neckDetect.detect_face_and_neck(asset)
        result = {
            "face": neck,
            "embadded": embadded_neck
        }
        print(json.dumps(result))
    elif function_name == 'resizer':
        path, width, height = resizer.resizeImage(asset)
        result = {
            "path": path,
            "width": width,
            "height": height
        }
        print(json.dumps(result))
    elif function_name == 'converter':
        new_path = imgConverter.convert_image(asset)
        print(json.dumps(new_path))
    elif function_name == 'imgToPdf':
        new_path = imgToPdf.convert_pdf(asset)
        print(json.dumps(new_path))
    else:
        print(f"Function {function_name} is not recognized")

if __name__ == "__main__":
    main()
