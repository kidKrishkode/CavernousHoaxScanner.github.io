import sys
import json
import cv2
import numpy as np

def identify(image_path, height, width):
    # Load the image
    image = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)
    if image is None:
        return {"error": "Image not found"}

    # Ensure the image is in the right dimensions
    if image.shape[:2] != (height, width):
        image = cv2.resize(image, (width, height), interpolation=cv2.INTER_AREA)

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

    # Extract the face region
    face = image[y:y+face_h, x:x+face_w]

    # Prepare the pixel arrays
    face_pixels = []
    embedded_face_pixels = np.zeros((int(height), int(width), 3), dtype=np.uint8)

    for i in range(face_h):
        for j in range(face_w):
            face_pixel = face[i, j].tolist()
            face_pixels.append(face_pixel)
            embedded_face_pixels[y + i, x + j] = [255, 255, 255]  # White pixel for face

    return  face_pixels, embedded_face_pixels.tolist()

def main():
    if len(sys.argv) != 4:
        print("Usage: faceDetect.py <image_path> <height> <width>")
        return

    image_path = sys.argv[1]
    height = int(sys.argv[2])
    width = int(sys.argv[3])

    face, embedded = identify(image_path, height, width)

    result = {
        "face": face,
        "embedded": embedded
    }
    
    # print((result))

if __name__ == "__main__":
    main()
    