from django.shortcuts import render, redirect
from nopass.main import *
from django.views.decorators.csrf import csrf_exempt
import json

APP_NAME = 'Sample Application'
APP_ID = '46b8a9a4b87444388fdb2651a9843a55'
APP_SECRET = '62684f71ec54e1a39eeac0b21bc7fcf5'
APP_REDIRECT_URI = 'http://localhost:3000/callback'

npass = NoPass(APP_ID, APP_SECRET, APP_NAME, APP_REDIRECT_URI)

def index(request):
    if request.session.get('user'):
        return render(request, 'sampleapp/index.html', {'user': request.session.get('user')})
    return render(request, 'sampleapp/index.html', {'user': None})

def signup(request):
    return npass.sign_up()

def login(request):
    return npass.log_in()

@csrf_exempt
def callback(request):
    print(request.method)
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        print(type(data), data)
    request.session['user'] = data
    return redirect('index')