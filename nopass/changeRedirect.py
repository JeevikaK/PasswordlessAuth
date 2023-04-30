import argparse
import requests
import json


ap = argparse.ArgumentParser()
ap.add_argument("-a", "--AppID", required=True, help="ID of the application")
ap.add_argument("-r", "--redirect_link", required=True, help="redirect link of the application after authentication")
args = vars(ap.parse_args())

secret = input("Enter application secret: ")

endpoint = 'http://localhost:8000/api/reset_redirect_url'

resp = requests.post(endpoint, json={
    "app_id": args["AppID"],
    "app_secret": secret,
    "redirect_url": args["redirect_link"]
})

if resp.json().get('status') == 'success':
    print('App updated!!')
    print(json.dumps(resp.json(), indent=4, sort_keys=True))
else:
    print('App not found!!')






