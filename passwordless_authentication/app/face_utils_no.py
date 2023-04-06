import time
from keras_facenet import FaceNet
import numpy as np
from scipy.spatial import distance
import cv2
import random


verification_threshhold = 0.85
start = time.time()
embedder = FaceNet()
print(f"\nFacenet Model loaded in {time.time() - start} seconds.\n")


def create_face_embedding(face_image):
    img_bytes = face_image.read()
    np_array = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
    return create_embedding(img)
    pass

def create_embedding(img):
    detections = embedder.extract(img, threshold=0.95)
    if len(detections) == 0:
        return None 
    return detections[0].get('embedding')
    pass
 
def save_face_embedding(embedding):
    with open(f"media/registeredFaces/embedding.npy", "wb") as f:
        np.save(f, embedding)
    pass

def load_face_embedding(name):
    with open(f"media/registeredFaces/{name}.npy", "rb") as f:
        return np.load(f)
    pass

def verify(emb1, emb2):
    dist = distance.euclidean(emb1, emb2)
    print('distance : ', dist)
    if dist < verification_threshhold:
        return True
    else:
        return False
    pass

def verify_face(frames, username):
    claimed_emb = load_face_embedding(username)
    if claimed_emb is None:
        return False
    test_emb = create_embedding(frames[random.randint(0, len(frames) - 1)])
    if not verify(test_emb, claimed_emb):
        return False
    return True
    pass