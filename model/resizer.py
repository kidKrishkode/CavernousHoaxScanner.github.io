import sys
import cv2
import os
import json

def resizeImage(image_path, width, height):
    # Load the image using OpenCV
    img = cv2.imread(image_path)
    
    # Get the current height and width of the image
    (current_height, current_width) = (height, width)
    
    # Check if the image needs to be resized
    if current_width > 200 or current_height > 200:
        # Calculate the new width and height while maintaining the aspect ratio
        if current_width > current_height:
            new_width = 200
            new_height = int((200 / current_width) * current_height)
        else:
            new_height = 200
            new_width = int((200 / current_height) * current_width)
        
        # Resize the image
        img = cv2.resize(img, (new_width, new_height))
        
        # Save the resized image to a temporary file
        filename, file_extension = os.path.splitext(image_path)
        temp_image_path = f"D:/.vscode/Vs programmes/Df Detector/server-side/public/temp_image.jpg"
        cv2.imwrite(temp_image_path, img)
        
        # Return the new image path and resolution
        return temp_image_path, new_width, new_height
    else:
        return "Image size under conditions", current_width, current_height

def main():
    if len(sys.argv) != 4:
        print("Usage: resizer.py <image_path> <height> <width>")
        return

    image_path = sys.argv[1]
    height = int(sys.argv[2])
    width = int(sys.argv[3])
    
    result = resizeImage(image_path, width, height)
    
    if isinstance(result, tuple):
        print(({"resized_image_path": result[0], "width": result[1], "height": result[2]}))
    else:
        print(result)

if __name__ == "__main__":
    main()