import sys
import subprocess
import json

# import require python files
import test
import diffForegBackg
import faceDetect
import resizer

# def call_foreground(image_path, width, height):
#     result = subprocess.run(['python', './test.py', image_path, height, width], capture_output=True, text=True)
#     return result.stdout

def main():
    if len(sys.argv) != 5:
        print("Usage: main.py <image_path> <width> <height> <function>")
        return

    image_path = sys.argv[1]
    height = int(sys.argv[2])
    width = int(sys.argv[3])
    function_name = sys.argv[4]

    if function_name == 'diffForegBackg':
        foreground, background, embadded = diffForegBackg.process_image(image_path, height, width)
        result = {
            "foreground": foreground,
            "background": background,
            "embadded": embadded
        }
        print(json.dumps(result))
    elif function_name == 'faceDetect':
        # face, embadded_face = faceDetect.detect_face(image_path, height, width)
        face, embadded_face = test.identify(image_path, height, width)
        result = {
            "face": face,
            "embadded": embadded_face
        }
        print(json.dumps(result))
    elif function_name == 'resizer':
        path, width, height = resizer.resizeImage(image_path, height, width)
        result = {
            "path": path,
            "width": width,
            "height": height
        }
        print(json.dumps(result))
    else:
        print(f"Function {function_name} is not recognized")

if __name__ == "__main__":
    main()
    
