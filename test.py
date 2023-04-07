import requests

endpoint1 = 'http://localhost:8000/api/signup-inapp-auth'

with open('public.pem', 'rb') as f:
    publicKey = f.read().decode()

json1 = {
    "username": "admin",
    "app_id": '38e9c4108b74437081708105c34db694',
    "public_key": publicKey,
    'recovery_email': 'owaisqbal2013@gmail.com'
}


endpoint2 = 'http://localhost:8000/api/login-inapp-auth'

with open('private.pem', 'rb') as f:
    privateKey = f.read().decode()

json2 = {
    "username": "admin",
    "app_id": '38e9c4108b74437081708105c34db694',
    "private_key": privateKey,
}

# resp = requests.post(endpoint1, json=json1)
resp = requests.post(endpoint2, json=json2)
print(resp.json())