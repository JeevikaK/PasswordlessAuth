import base64
import random
import uuid
import rsa
import smtplib, ssl
from email.message import EmailMessage
from .models import *

from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.serialization import load_pem_public_key
from cryptography.hazmat.primitives.serialization import load_pem_private_key
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.exceptions import *

port = 587  # For starttls
smtp_server = "smtp.gmail.com"
sender_email = "ayaan.ali.63621@gmail.com" # Enter the sender email address
password = "qhjnlfegzjtruwuq" #app password

def generate_code(token, public_key):
    public_key = rsa.PublicKey.load_pkcs1(public_key.encode('utf8'))
    nonce_len = random.randint(15, 32)
    nonce = uuid.uuid4().hex[:nonce_len]
    token_nonce = token + nonce
    token_nonce = str.encode(token_nonce)
    code = rsa.encrypt(token_nonce, public_key)
    url_code = base64.urlsafe_b64encode(code).rstrip(b"=").decode('ascii')
    return url_code, nonce_len

def send_email(receiver_email, token, method, base_url):
    context = ssl.create_default_context()
    print("Certificate created")
    try:
        with smtplib.SMTP(smtp_server, port) as server:
            server.starttls(context=context)
            server.login(sender_email, password)
            msg = EmailMessage()
            message="""\
                    Recover your account by clicking on the link below:\n"""\
                    + str(base_url)+ "/recover/" + str(method) + "/" + str(token)
            msg.set_content(message)
            msg['Subject'] = 'Recover Account'
            msg['From'] = sender_email
            msg['To'] = receiver_email
            server.send_message(msg)
        print("email sent")
        return True
    except Exception as e:
        print(e)
        print("Email not sent")
        return False
    
def generate_token():
    token = str(uuid.uuid4().hex)
    while True:
        try:
            user = User.objects.get(token=token)
            token = str(uuid.uuid4().hex)
            print("token already exists")
        except User.DoesNotExist:
            return token
        

def verify_signature(private_key, public_key):
    public_key = load_pem_public_key(public_key.encode(), backend=default_backend())
    private_key = load_pem_private_key(private_key.encode(), password=None, backend=default_backend())
    message = b"Hello World"
    signature = private_key.sign(message, padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH),hashes.SHA256())
    try:
        public_key.verify(signature, message, padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH),hashes.SHA256())
        print("Signature is valid")
        return True
    except InvalidSignature:
        print("Signature is invalid")
        return False