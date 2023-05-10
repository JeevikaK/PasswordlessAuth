
# Passwordless Future 

This project offers a revolutionary approach to passwordless authentication by providing an IDP. Our main contributions in the mentioned work include - providing novel approaches to biometric such as facial & voice verification, collecting only a single facial image or voice recording to register a user and verify them later. The data is stored on the server as embeddings rather than conventional methods such as actual images or voice recordings for privacy concerns, token based authentication using personal devices as well as fido authentication methods.
## Installation

The above project has been made with python v3.9 and would best work with it.

Create a virtual environment
```bash
    python -m venv <environment name>
    <environment name>\Scripts\activate
```

Clone the repo
```bash
  https://github.com/JeevikaK/PasswordlessAuth.git
  cd PasswordlessAuth
```

Install Requirements
```bash
    pip install -r requirements.txt
```

Install ffpeg software from the link below, unzip it and install and then add it to path variables.
(A restart maybe required)
```bash
    https://www.gyan.dev/ffmpeg/builds/ffmpeg-git-full.7z
```

Run the server
```bash
    cd server
    uvicorn passwordless_authentication.asgi:application --reload --port 8000 --host localhost
```

Run the web client
```bash
    cd reactapp
    npm install 
    npm start
```

Build the app
```bash
    cd flutter_app/example
    run flutter pub get . 
    // Start your virtual device or connect your mobile phone.
    adb reverse tcp:8000 tcp:8000
    // Start debugging your app 
```



## Usage

Our IDP is directed towards Developers. The current usage shown below is using the django framework, but the code can be replicated for flask framework as well (Python based frameworks as of now).

#### Step 1: 
Create a django project and app
```bash
    django-admin startproject sampleproject
    cd sampleproject
    py manage.py startapp sampleapp
```

#### Step 2: 
Copy the folder ``PasswordlessAuth/noPass`` in ``sampleproject`` (we will provide it as a Pypi package in future). 
```bash
    cd noPass
    pip install -r requirements.text
    cd ..
```

#### Step 3: Register your app with app name and redirection url that will be defined in your views.
```bash
    py registerApp --create 'Sample App' --redirect_link localhost:5000/callback
```

#### Step 4: 
Paste the ``app_id`` and ``app_secret`` from the output of command in step 3 in ``sampleproject/settings.py`` by creating a configuration or in ``sampleapp/views.py``. We will demonstrate through the latter case.

#### Step 5: 
Initialise your app in ``sampleapp/views.py``

```bash
    from nopass.main import *

    APP_ID = '<YOUR APP ID>'
    APP_SECRET = '<YOUR APP SECRET>'
    npass = NoPass(APP_ID, APP_SECRET)
```

#### Step 6: 
Define and Initialise App routes for authentication in ``sampleapp/views.py``
```bash
    def signup(request):
        return npass.sign_up()

    def login(request):
        return npass.log_in()

    #important: This is where you recieve user data.
    def callback(request): 
        user = npass.get_user(request)
        request.session['user'] = user
        return redirect('index')

    def logout(request):
        request.session['user'] = None
        return redirect('index')
```

#### Step 7: 
Define endpoints in anchor tags in ``sampleapp\templates\sampleapp\index.html`` or any of your corresponding webpages.
```bash
    <a href="{% url 'logout' %}" class="btn btn-warning mx-5" role="button">Log out</a>
    <a href="{% url 'signup' %}" class="btn btn-secondary mx-5"  role="button">Sign up</a>
    <a href="{% url 'login' %}" class="btn btn-info mx-5" role="button" >Log in</a>
```

#### Step 8: 
Run the ``sampleapp``
```bash
    py manage.py runserver 5000
```

#### You can also use the sample app from the repository which is precoded.


## Tech Stack and Key Libraries


#### Backend
- Django Rest Framework (Python)
- Sqlite
- Tensorflow
- Pytorch
- Core packages - ``keras-facenet, resemblyzer, cryptography``
- External apis - ``webauthn ``

#### Key Repositories
- Liveliness Detection - https://github.com/computervisioneng/Silent-Face-Anti-Spoofing (Tweaked source code to our needs)
- QR Code Scanner - https://github.com/contactlutforrahman/flutter_qr_bar_scanner

#### Frontend 
- Web - ReatJS (HTML, CSS, JS)
- App - Flutter (Dart)

## Features

- A Single IDP plaform that provides multiple authentication     services - all passwordless, especially biometrics. (novel)
- Ease of authentication in foreign devices.
- Support for legacy devices – PCs which don’t support BT & WiFi/webcam & recorder - Inapp authentication (novel)
- Increased privacy because embeddings are stored instead of actual data, thus complying with gdpr rules.
- Recovery and single Sign-on mechanism. Normally passwordless authentication methods do not provide the above, we overcome this issue too.
- The IDP can be integrated in the development application in a small and simple number of steps unlike other solutions


## Contributing

* [Owais Iqbal](https://github.com/Shades-en)
* [Jeevika Kiran](https://github.com/JeevikaK)
* [Prajwal B Mehendarkar](https://github.com/Prajwal-2002)
* [Ridhiman Singh]()


## Screenshots

#### Sign up page
![App Screenshot](https://drive.google.com/uc?export=view&id=1CZpwOUMIN7oGbGRPc7EHcN70tNhTCgQq)

#### Login page
![App Screenshot](https://drive.google.com/uc?export=view&id=1Zo_1sustw90gDTO1w1dj4U5LV9ENCqpN)

#### Face authentication registration page
![App Screenshot](https://drive.google.com/uc?export=view&id=1Tp1D9wU-GZsj8Ld46Lm968XKk-yr2yls)

#### Voice authentication registration page
![App Screenshot](https://drive.google.com/uc?export=view&id=1CN6zZurARq34xnkW1QdsAfyk7gkegTZg)

#### Inapp authentication registration page
![App Screenshot](https://drive.google.com/uc?export=view&id=13ti_nYRYzooBpNUqd8iSGzh8R-2dDe2p)

#### Fido authentication registration page
![App Screenshot](https://drive.google.com/uc?export=view&id=1EnnpbvmlbJag2A8C84BIbSoMKhx3TQbh)
