from resemblyzer import preprocess_wav, VoiceEncoder
import numpy as np
import uuid
import os

encoder = VoiceEncoder()

THRESH = 0.75

def create_embedding(audiofile):
    if isinstance(audiofile, str):
        path = audiofile
    else:
        unikey = uuid.uuid4().hex
        with open(f'media/temp-{unikey}.wav', 'wb') as f:
            f.write(audiofile.read())
        path = f'media/temp-{unikey}.wav'
    p = preprocess_wav(path)
    e = encoder.embed_utterance(p)
    if not isinstance(audiofile, str):
        os.remove(f'media/temp-{unikey}.wav')
    return e

def verify(e1, e2):
    # return np.dot(e1, e2) / (np.linalg.norm(e1) * np.linalg.norm(e2))
    sim = e1 @ e2
    print("similarity: ", sim)
    return True if sim > THRESH else False

def save_embedding(e):
    with open(f'media/registeredVoices/embedding.npy', 'wb') as f:
        np.save(f, e)

def load_embedding(name):
    with open(f'media/registeredVoices/{name}.npy', 'rb') as f:
        return np.load(f)
