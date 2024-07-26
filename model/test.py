import sys
import json
import cv2
import numpy as np

def detect_face(image_path, height, width):
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

    # Extract the face region
    face_pixels = []
    # embedded_face = np.zeros((int(height), int(width), 3), dtype=np.uint8)
    embedded_face = []
    for i in range(int(height)):
        for j in range(int(width)):
            pixel = image[i, j].tolist()
            if x <= j < x + face_w and y <= i < y + face_h:
                face_pixels.append(pixel)
                # embedded_face[i, j] = [255, 255, 255]
                embedded_face.append([255,255,255])
            else:
                # embedded_face[i, j] = [0, 0, 0]
                embedded_face.append([0,0,0])

    # Convert the embedded face image to the required format
    # embedded_face_list = embedded_face.tolist()
    embedded_face_list = embedded_face

    return face_pixels, embedded_face_list

def main():
    if len(sys.argv) != 4:
        print(json.dumps({"error": "Usage: faceDetect.py <image_path> <width> <height>"}))
        return

    image_path = sys.argv[1]
    height = int(sys.argv[2])
    width = int(sys.argv[3])

    face, embadded = detect_face(image_path, height, width)

    result = {
        "face": face,
        "embedded_face": embadded
    }

    print((result))

if __name__ == "__main__":
    main()
