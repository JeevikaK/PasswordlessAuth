from django.shortcuts import render, redirect
from nopass.main import *
from django.conf import settings
import json


npass = NoPass(settings.APP_ID, settings.APP_SECRET)

def index(request):
    if request.session.get('user'):
        return render(request, 'sampleapp/index.html', {
            'user': json.dumps(request.session.get("user"), indent=4)
        })
    return render(request, 'sampleapp/index.html', {'user': None})

def signup(request):
    return npass.sign_up()

def login(request):
    return npass.log_in()

def callback(request):
    user = npass.get_user(request)
    request.session['user'] = user
    return redirect('index')

def logout(request):
    request.session['user'] = None
    return redirect('index')