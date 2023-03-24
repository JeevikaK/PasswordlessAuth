import argparse
import rsa
import requests
import json

endpoint = 'http://localhost:8000/api/register_app'

ap = argparse.ArgumentParser()
ap.add_argument("-c", "--create", required=True, help="name of the application to create")
ap.add_argument("-r", "--redirect_link", required=True, help="redirect link of the application after authentication")
args = vars(ap.parse_args())


publicKey, privateKey = rsa.newkeys(2042)
#256

publicKeyPkcs1PEM = publicKey.save_pkcs1().decode('utf8')

# Export private key in PKCS#1 format, PEM encoded
privateKeyPkcs1PEM = privateKey.save_pkcs1().decode('utf8')

with open('nopass/private.pem', 'w') as f:
    f.write(privateKeyPkcs1PEM)


resp = requests.post(endpoint, json={
    "app_name": args["create"],
    "redirection_url": args["redirect_link"],
    "public_key": publicKeyPkcs1PEM
})

conf = resp.json()
secret = conf.pop('app_secret')

with open('nopass/appConfig.json', 'w') as f:
    f.write(json.dumps(conf, indent=4, sort_keys=True))

app_data = json.dumps({**conf, 'secret': secret}, indent=4, sort_keys=True)
print('App created!!')
print(app_data)
