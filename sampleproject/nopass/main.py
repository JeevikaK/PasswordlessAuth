from django.http import HttpResponseRedirect 
import requests

BASE_URL_CLIENT = 'http://localhost:3000'
BASE_URL_SERVER = 'http://localhost:8000'

class NoPass:
    def __init__(self, id, secret, name, redirect_url):
        resp = requests.get(f'{BASE_URL_SERVER}/api/get_app/{id}').json()
        self._id, self._name  = resp['app_id'], resp['app_name']
        self._secret = secret
        self._redirect_url = redirect_url

    def sign_up(self):
        return HttpResponseRedirect(f'{BASE_URL_CLIENT}/{self._id}/signup')
    
    def log_in(self):
        return HttpResponseRedirect(f'{BASE_URL_CLIENT}/{self._id}/login')
