import base64
import random
import uuid
import rsa
import smtplib, ssl
from email.message import EmailMessage

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
    