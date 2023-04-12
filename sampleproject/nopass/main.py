from django.http import HttpResponseRedirect 
import requests
import rsa
import base64
from django.utils import timezone

BASE_URL_CLIENT = 'http://localhost:3000'
BASE_URL_SERVER = 'http://localhost:8000'

class NoPass:
    def __init__(self, id, secret):
        self._secret = secret
        resp = requests.post(f'{BASE_URL_SERVER}/api/authenticate_app', json={
            'app_id': id,
            'app_secret': secret,
        }).json()
        if resp.get('status') == 'failed':
            raise Exception('App not found')
        self._id, self._name  = resp['app_id'], resp['app_name']
        

    def sign_up(self):
        return HttpResponseRedirect(f'{BASE_URL_CLIENT}/{self._id}/signup')
    
    def log_in(self):
        return HttpResponseRedirect(f'{BASE_URL_CLIENT}/{self._id}/login')
    
    def extract_token(self, code, nonce_len):
        decoded_bytes = base64.urlsafe_b64decode(code + '=' * (-len(code) % 4))
        with open('nopass/private.pem', 'rb') as f:
            privateKeyReloaded = rsa.PrivateKey.load_pkcs1(f.read())
        decryptedMessage = rsa.decrypt(decoded_bytes, privateKeyReloaded)
        decryptedMessage = decryptedMessage.decode('utf-8')
        nonce_len = int(nonce_len)
        nonce = decryptedMessage[-nonce_len:]
        token = decryptedMessage[:-nonce_len]
        return token, nonce
        

    def get_user(self, request):
        code = request.GET.get('code')
        nonce_len = request.GET.get('len')
        mode = request.GET.get('mode')
        token, nonce = self.extract_token(code, nonce_len)
        resp = requests.get(f'{BASE_URL_SERVER}/api/get_user_by_token/{token}').json()
        if not resp.get('userExists'):
            raise Exception('User not found')
        if mode=='voice':
            resp.update({'mode': 'Voice Authentication'})
        elif mode=='video':
            resp.update({'mode': 'Face Authentication'})
        elif mode=='inapp':
            resp.update({'mode': 'In-App Authentication'})
        resp.update({'nonce': nonce})
        resp.update({'authenticated at': str(timezone.now())})
        resp.update({'token': token})
        return resp
    
