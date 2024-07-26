import sys
import cv2
import dlib
import numpy as np
import json

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

    # Initialize dlib's face detector (HOG-based) and create the facial landmark predictor
    detector = dlib.get_frontal_face_detector()
    predictor = dlib.shape_predictor('shape_predictor_68_face_landmarks.dat')  # You need to download this file

    # Detect faces in the grayscale image
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    rects = detector(gray, 1)

    face_pixels = []
    embedded_face = []

    # Initialize the embedded face image with black pixels
    for i in range(int(height)):
        for j in range(int(width)):
            embedded_face.append([0, 0, 0])

    # Process each face detected
    for rect in rects:
        shape = predictor(gray, rect)
        mask = np.zeros_like(image, dtype=np.uint8)

        # Create a mask for the face
        for i in range(1, 16):
            cv2.line(mask, (shape.part(i).x, shape.part(i).y), (shape.part(i + 1).x, shape.part(i + 1).y), (255, 255, 255), 2)

        # Fill the mask to get the face region
        cv2.fillPoly(mask, [np.array([[shape.part(i).x, shape.part(i).y] for i in range(1, 16)])], (255, 255, 255))

        # Extract face pixels
        for y in range(int(height)):
            for x in range(int(width)):
                if np.array_equal(mask[y, x], [255, 255, 255]):
                    face_pixels.append(image[y, x].tolist())
                    embedded_face[y * int(width) + x] = [255, 255, 255]
                else:
                    embedded_face[y * int(width) + x] = [0, 0, 0]
    
    return face_pixels, embedded_face

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
