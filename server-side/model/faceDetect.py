import sys
import json
import numpy as np
import cv2

def detect_face(image_path, height, width):
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

    # Convert the image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Load OpenCV's pre-trained Haarcascade face detector
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    # Detect faces
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    if len(faces) == 0:
        return {"error": "No face found"}

    # Select the largest face
    largest_face = max(faces, key=lambda rect: rect[2] * rect[3])

    x, y, w, h = largest_face
    face = image[y:y+h, x:x+w]

    # Initialize the face and embedded face arrays
    face_pixels = []
    embedded_face_pixels = np.zeros_like(image)

    for i in range(h):
        for j in range(w):
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

    face, embedded = detect_face(image_path, height, width)

    result = {
        "face": face,
        "embedded": embedded
    }
    
    print((result))

if __name__ == "__main__":
    main()
