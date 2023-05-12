from webauthn import (
    generate_registration_options,
    verify_registration_response,
    generate_authentication_options,
    verify_authentication_response,
    options_to_json,
)
from webauthn.helpers.structs import (
    AuthenticatorSelectionCriteria,
    AuthenticatorAttachment,
    UserVerificationRequirement,
    RegistrationCredential,
    AuthenticationCredential,
)
from webauthn.helpers.cose import COSEAlgorithmIdentifier
from .models import *
import json


rp_id = "nopass-64cee.web.app"
origin = "https://nopass-64cee.web.app"
rp_name = "Passwordless Authentication"

current_registration_challenge = {}
current_authentication_challenge = {}

def generate_reg_options(username):
    global current_challenge
    try:
        user = User.objects.get(username=username)
        credentials = Credentials.objects.filter(user=user)
        display_name = user.username
    except User.DoesNotExist:
        credentials = []
        display_name = username
    
    print(credentials, "credentials")

    authenticator_selection = AuthenticatorSelectionCriteria(
        authenticator_attachment=AuthenticatorAttachment.CROSS_PLATFORM,
        user_verification=UserVerificationRequirement.REQUIRED,
    )
    registration_options = generate_registration_options(
        rp_id=rp_id,
        rp_name=rp_name,
        user_id=username,
        user_name=display_name,
        authenticator_selection=authenticator_selection,
        supported_pub_key_algs=[
            COSEAlgorithmIdentifier.ECDSA_SHA_256,
            COSEAlgorithmIdentifier.RSASSA_PKCS1_v1_5_SHA_256,
        ],
        exclude_credentials=[
            {"id": cred.id, "transports": [], "type": "public-key"} for cred in credentials
        ],
    )

    current_registration_challenge[username] = registration_options.challenge
    return options_to_json(registration_options)


def verify_reg_response(body, username):
    body = json.dumps(body).encode("utf-8")
    credential = RegistrationCredential.parse_raw(body)
    verificaion = verify_registration_response(
        credential=credential,
        expected_challenge=current_registration_challenge[username],
        expected_origin=origin,
        expected_rp_id=rp_id,
    )
    return verificaion


def generate_auth_options(user):
    credentials = user.credentials_set.all()
    options = generate_authentication_options(
        rp_id=rp_id,
        allow_credentials=[
            {"id": cred.id, "transports": [], "type": "public-key"} for cred in credentials
        ],
        user_verification=UserVerificationRequirement.REQUIRED,
    )
    current_authentication_challenge[user.username] = options.challenge
    return options_to_json(options)


def verify_auth_response(body, user):
    body = json.dumps(body).encode("utf-8")
    try:
        credential = AuthenticationCredential.parse_raw(body)
        user_credential = None
        for cred in user.credentials_set.all():
            if cred.id == credential.raw_id:
                user_credential = cred

        # print(CredentialsSerializer(user_credential).data)
        if user_credential is None:
            raise Exception("Could not find corresponding public key in DB")
        
        verification = verify_authentication_response(
            credential=credential,
            expected_challenge=current_authentication_challenge[user.username],
            expected_origin=origin,
            expected_rp_id=rp_id,
            credential_public_key=user_credential.public_key,
            credential_current_sign_count=user_credential.sign_count,
            require_user_verification=True,
        )
    except Exception as e:
        print(e)
        return {"verified": False, "msg": str(e), "status": 400}
    
    user_credential.sign_count = verification.new_sign_count
    user_credential.save()
    return {"verified": True, "msg": "Success", "status": 200}