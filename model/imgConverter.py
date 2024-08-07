import sys
import cv2
import numpy as np
import svgwrite
import json
import ast

def convert_png(image_path):
    image = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)
    if image.shape[2] == 4:
        filename, extension = image_path.rsplit('.', 1)
        new_image_path = f"{filename}.png"
        cv2.imwrite(new_image_path, image, [int(cv2.IMWRITE_PNG_COMPRESSION), 0])
    else:
        image = cv2.cvtColor(image, cv2.COLOR_BGR2BGRA)
        alpha_channel = np.ones((image.shape[0], image.shape[1]), dtype=image.dtype) * 255
        image = np.dstack((image, alpha_channel))
        filename, extension = image_path.rsplit('.', 1)
        new_image_path = f"{filename}.png"
        cv2.imwrite(new_image_path, image, [int(cv2.IMWRITE_PNG_COMPRESSION), 0])
    return new_image_path

def convert_jpg(image_path):
    image = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)
    if image.shape[2] == 4:
        image = cv2.cvtColor(image, cv2.COLOR_BGRA2BGR)
    elif image.shape[2] == 1:
        image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
    filename, extension = image_path.rsplit('.', 1)
    new_image_path = f"{filename}.jpg"
    cv2.imwrite(new_image_path, image, [int(cv2.IMWRITE_JPEG_QUALITY), 95])
    return new_image_path

def convert_jpeg(image_path):
    image = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)
    if image.shape[2] == 4:
        image = cv2.cvtColor(image, cv2.COLOR_BGRA2BGR)
    elif image.shape[2] == 1:
        image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
    filename, extension = image_path.rsplit('.', 1)
    new_image_path = f"{filename}.jpeg"
    cv2.imwrite(new_image_path, image, [int(cv2.IMWRITE_JPEG_QUALITY), 100])
    return new_image_path

def convert_gif(image_path):
    return image_path

def convert_bmp(image_path):
    image = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)
    if image.shape[2] == 4:
        b, g, r, a = cv2.split(image)
        b = cv2.bitwise_and(b, b, mask=a)
        g = cv2.bitwise_and(g, g, mask=a)
        r = cv2.bitwise_and(r, r, mask=a)
        image = cv2.merge((b, g, r))
    elif image.shape[2] == 1:
        image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
    else:
        image = cv2.cvtColor(image, cv2.COLOR_BGR2BGRA)
        alpha_channel = np.ones((image.shape[0], image.shape[1]), dtype=image.dtype) * 255
        image = np.dstack((image, alpha_channel))
    filename, extension = image_path.rsplit('.', 1)
    new_image_path = f"{filename}.bmp"
    cv2.imwrite(new_image_path, image)
    return new_image_path

def convert_svg(image_path):
    image = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)
    if image.shape[2] == 4:
        b, g, r, a = cv2.split(image)
        image = cv2.merge((r, g, b, a))
    else:
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        alpha_channel = np.ones((image.shape[0], image.shape[1]), dtype=image.dtype) * 255
        image = np.dstack((image, alpha_channel))
    height, width, _ = image.shape
    filename, extension = image_path.rsplit('.', 1)
    new_image_path = f"{filename}.svg"
    dwg = svgwrite.Drawing(new_image_path, size=(width, height))
    for y in range(height):
        for x in range(width):
            r, g, b, a = image[y, x]
            if a > 0:
                fill = svgwrite.rgb(r, g, b, '%')
                dwg.add(dwg.rect(insert=(x, y), size=(1, 1), fill=fill, fill_opacity=a / 255.0))
    dwg.save()
    return new_image_path

def convert_tga(image_path):
    return image_path

def convert_tiff(image_path):
    return image_path

def is_image(image_path):
    valid_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.gif', '.svg']
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

def convert_image(input_list):
    if './model/main.py' in sys.argv[0]:
        input_list = [str(X) for X in input_list[0].split(',')]

    image_path = str(input_list[0])
    extension = str(input_list[1])
    new_image_path = image_path

    if is_image(image_path) == True:
        if extension == 'png':
            new_image_path = convert_png(image_path)
        elif extension == 'jpg':
            new_image_path = convert_jpg(image_path)
        elif extension == 'jpeg':
            new_image_path = convert_jpeg(image_path)
        elif extension == 'gif':
            new_image_path = convert_gif(image_path)
        elif extension == 'bmp':
            new_image_path = convert_bmp(image_path)
        elif extension == 'svg':
            new_image_path = convert_svg(image_path)
        else:
            print("Unwanted media convertion try.")
        return new_image_path
    else:
        print("Unsupported image format. Only PNG and JPG are supported.")
        return None

def main():
    if len(sys.argv) != 2:
        print("Usage: imgConverter.py <list-value>")
        return
    
    input_list = ast.literal_eval(sys.argv[1])
    image_path = str(input_list[0])
    if is_image(image_path) == True:
        new_image_path = convert_image(input_list)
        print(new_image_path)

if __name__ == "__main__":
    main()
