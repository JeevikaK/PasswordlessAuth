import base64
import random
import uuid
import rsa

def generate_code(token, public_key):
    public_key = rsa.PublicKey.load_pkcs1(public_key.encode('utf8'))
    nonce_len = random.randint(15, 32)
    nonce = uuid.uuid4().hex[:nonce_len]
    token_nonce = token + nonce
    token_nonce = str.encode(token_nonce)
    code = rsa.encrypt(token_nonce, public_key)
    url_code = base64.urlsafe_b64encode(code).rstrip(b"=").decode('ascii')
    return url_code, nonce_len
