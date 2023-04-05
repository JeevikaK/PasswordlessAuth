import numpy as np
import cv2
import time

import FaceToolKit as ftk
import DetectionToolKit as dtk

verification_threshhold = 1.188
image_size = 160


start = time.time()
v = ftk.Verification()
v.load_model("./models/20180204-160909/")
v.initial_input_output_tensors()
d = dtk.Detection()
print(f"\nFacenet Model loaded in {time.time() - start} seconds.\n")


def create_face_embedding(face_image):
    img_bytes = face_image.read()
    np_array = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
    return create_embedding(img)
    pass    


def create_embedding(img):
    aligned = d.align(img, False)[0]
    return v.img_to_encoding(aligned, image_size)
    pass


def save_face_embedding(embedding):
    with open(f"media/registeredFaces/embedding.npy", "wb") as f:
        np.save(f, embedding)
    pass

def load_face_embedding(name):
    with open(f"media/registeredFaces/{name}.npy", "rb") as f:
        return np.load(f)
    pass


def distance(emb1, emb2):
    diff = np.subtract(emb1, emb2)
    return np.sum(np.square(diff))
    pass


def verify(emb1, emb2):
    dist = distance(emb1, emb2)
    print("distance", dist)
    if dist < verification_threshhold:
        return True
    else:
        return False
    pass

def verify_face(frame, username):
    claimed_emb = load_face_embedding(username)
    test_emb = create_embedding(frame)
    if not verify(test_emb, claimed_emb):
        return False
    return True


