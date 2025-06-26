import os
import face_recognition
import pickle

KNOWN_FACES_DIR = "models/known_faces.pkl"

def encode_known_faces(images_dir: str = "static/known"):
    known_encodings = []
    known_names = []

    for filename in os.listdir(images_dir):
        if filename.endswith(('.jpg', '.png', '.jpeg')):
            image_path = os.path.join(images_dir, filename)
            image = face_recognition.load_image_file(image_path)
            encodings = face_recognition.face_encodings(image)

            if encodings:
                known_encodings.append(encodings[0])
                known_names.append(os.path.splitext(filename)[0])  # Use filename as name

    with open(KNOWN_FACES_DIR, "wb") as f:
        pickle.dump((known_encodings, known_names), f)

    return known_names


def recognize_face(uploaded_image_path: str):
    with open(KNOWN_FACES_DIR, "rb") as f:
        known_encodings, known_names = pickle.load(f)

    image = face_recognition.load_image_file(uploaded_image_path)
    unknown_encodings = face_recognition.face_encodings(image)

    if not unknown_encodings:
        return None  # No face found

    for known_encoding, name in zip(known_encodings, known_names):
        match = face_recognition.compare_faces([known_encoding], unknown_encodings[0])
        if match[0]:
            return name

    return None  # No match