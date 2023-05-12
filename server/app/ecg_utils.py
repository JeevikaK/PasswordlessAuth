import numpy as np
from PIL import Image
from ECG_model.train import get_siamese_model
from tensorflow.keras.optimizers import Adam
import time

start = time.time()
model = get_siamese_model((144, 224, 1))
optimizer = Adam(learning_rate=0.00006)
model.compile(loss="binary_crossentropy", optimizer=optimizer)

model.load_weights("ECG_model/model_ecg.h5")
print(f"Siamese model for ECG loaded in {time.time() - start} seconds.\n")
w, h = 144, 224


def load_ecg_embedding(name):
    with open(f'media/registeredEcgs/{name}1.npy', 'rb') as f:
        return np.load(f)
    
def load_ecg_embedding_anchor(name):
    with open(f'media/testEcg/{name}.npy', 'rb') as f:
        return np.load(f)

def store_ecg_embedding(img):
    embedding =  np.array(Image.open(img).resize((h, w)))[:, :, 0:1] / 255
    with open(f'media/registeredVoices/embedding.npy', 'wb') as f:
        np.save(f, embedding)

def verify_wave(ecg_image, username):
    embedding = load_ecg_embedding(username)
    anchor_embedding = load_ecg_embedding_anchor(ecg_image.name.split('.')[0].split('-')[0])
    prob = model.predict([embedding, anchor_embedding])
    pred = (prob > 0.5)[0][0]
    if pred:
        print(f"Confidence: {100 * prob[0][0]}")
        print("Authenticated")
        return True
    else:
        print(f"Confidence: {100 * (1-prob[0][0])}")
        print("Not Authenticated")
        return False


