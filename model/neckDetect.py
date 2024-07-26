import sys
import json
import cv2
import numpy as np

def detect_face_and_neck(image_path, width, height):
    # Load the image
    image = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)
    if image is None:
        return {"error": "Image not found"}

    # Resize the image
    image = cv2.resize(image, (int(width), int(height)))

    # Convert the image to RGB if it has an alpha channel
    if image.shape[2] == 4:
        image = cv2.cvtColor(image, cv2.COLOR_BGRA2BGR)

    # Load the Haar Cascade for face detection
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    # Convert the image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Detect faces in the image
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    if len(faces) == 0:
        return {"error": "No face found"}

    # Select the largest face
    largest_face = max(faces, key=lambda rect: rect[2] * rect[3])
    x, y, face_w, face_h = largest_face

    # Define the neck region
    neck_y = y + face_h
    neck_height = face_h // 2
    neck_x = x
    neck_width = face_w

    # Ensure the neck region does not exceed image boundaries
    if neck_y + neck_height > int(height):
        neck_height = int(height) - neck_y

    # Extract the neck region
    neck_region = image[neck_y:neck_y+neck_height, neck_x:neck_x+neck_width]

    # Analyze the neck region for cuts/discrepancies using intensity differences
    neck_gray = cv2.cvtColor(neck_region, cv2.COLOR_BGR2GRAY)
    neck_blur = cv2.GaussianBlur(neck_gray, (5, 5), 0)
    neck_edges = cv2.Canny(neck_blur, 50, 150)

    # Create a binary mask for significant intensity changes
    _, neck_thresh = cv2.threshold(neck_edges, 50, 255, cv2.THRESH_BINARY)

    # Find contours in the neck region
    contours, _ = cv2.findContours(neck_thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Create an embedded neck image with black background and white cut regions
    embedded_neck = np.zeros((int(height), int(width), 3), dtype=np.uint8)
    neck_pixels = []

    for contour in contours:
        for point in contour:
            px, py = point[0]
            neck_pixels.append(neck_region[py, px].tolist())
            embedded_neck[neck_y + py, neck_x + px] = [255, 255, 255]

    # Ensure the final embedded neck image is properly sized
    embedded_neck_resized = cv2.resize(embedded_neck, (int(width), int(height)))

    return neck_pixels, embedded_neck_resized.tolist()

def main():
    if len(sys.argv) != 4:
        print("error: Usage: neckDetect.py <image_path> <width> <height>")
        return

    image_path = sys.argv[1]
    height = int(sys.argv[2])
    width = int(sys.argv[3])

    neck, embadded = detect_face_and_neck(image_path, width, height)

    result = {
        "neck": neck,
        "embedded": embadded
    }

    print((result))

if __name__ == "__main__":
    main()
