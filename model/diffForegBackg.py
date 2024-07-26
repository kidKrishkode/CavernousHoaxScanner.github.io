import sys
import json
import numpy as np
import cv2

def process_image(image_path, height, width):
    # Load the image
    image = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)
    if image is None:
        return {"error": "Image not found"}
    
    # Ensure the image is in the right dimensions
    if image.shape[:2] != (height, width):
        image = cv2.resize(image, (width, height), interpolation=cv2.INTER_AREA)

    # Convert RGBA to RGB if necessary
    if image.shape[2] == 4:
        image = cv2.cvtColor(image, cv2.COLOR_RGBA2RGB)
    else:
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Initialize the mask for GrabCut
    mask = np.zeros(image.shape[:2], np.uint8)

    # Temporary arrays used by the algorithm
    bgd_model = np.zeros((1, 65), np.float64)
    fgd_model = np.zeros((1, 65), np.float64)

    # Define the rectangle for the initial GrabCut
    rect = (10, 10, image.shape[1] - 10, image.shape[0] - 10)

    # Run GrabCut algorithm
    cv2.grabCut(image, mask, rect, bgd_model, fgd_model, 5, cv2.GC_INIT_WITH_RECT)

    # Modify the mask
    mask2 = np.where((mask == 2) | (mask == 0), 0, 1).astype('uint8')
    # foreground = image * mask2[:, :, np.newaxis]
    # background = image * (1 - mask2[:, :, np.newaxis])
    
    # Prepare the pixel arrays
    foreground_pixels = []
    background_pixels = []
    embedded_pixels = []

    for y in range(int(height)):
        for x in range(int(width)):
            pixel = image[y, x].tolist()
            if mask2[y, x] == 1:
                foreground_pixels.append(pixel)
                embedded_pixels.append([255,255,255])  # White pixel
            else:
                background_pixels.append(pixel)
                embedded_pixels.append([0, 0, 0])  # Black pixel

    return foreground_pixels, background_pixels, embedded_pixels

def main():
    if len(sys.argv) != 4:
        print("Usage: diffForegBackg.py <image_path> <height> <width>")
        return

    image_path = sys.argv[1]
    height = int(sys.argv[2])
    width = int(sys.argv[3])

    foreground, background, embedded = process_image(image_path, height, width)
    
    result = {
        "foreground": foreground,
        "background": background,
        "embedded": embedded
    }

    print((result))

if __name__ == "__main__":
    main()