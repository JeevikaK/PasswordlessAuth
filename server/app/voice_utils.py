from resemblyzer import preprocess_wav, VoiceEncoder
import numpy as np
import uuid
import os

encoder = VoiceEncoder()

THRESH_web = 0.8
THRESH_mob = 0.75

def create_voice_embedding(audiofile):
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


def verify_voice(e1, e2, mode='web'):
    sim = e1 @ e2
    print("similarity: ", sim)
    threshold = THRESH_web if mode == 'web' else THRESH_mob
    return True if sim > threshold else False

def save_voice_embedding(e):
    with open(f'media/registeredVoices/embedding.npy', 'wb') as f:
        np.save(f, e)


def load_voice_embedding(name):
    with open(f'media/registeredVoices/{name}.npy', 'rb') as f:
        return np.load(f)
 
