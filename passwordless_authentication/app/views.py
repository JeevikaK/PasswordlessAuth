from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from rest_framework.response import Response
from .serializer import *
import uuid
from secrets import *
from rest_framework.parsers import MultiPartParser, FormParser
from .voice_utils import *
from .face_utils import *
from .liveliness_util import *
from django.core.files import File
from .crypt import *


# Create your views here.

class Register_app(APIView):
    def post(self, request):
        data = {
            "app_id": uuid.uuid4().hex,
            "app_secret": token_hex(16),
            "app_name": request.data.get("app_name"),
            "redirection_url": request.data.get("redirection_url"),
            "public_key": request.data.get("public_key"),
        }
        serializer = ApplicationSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({**serializer.data, "status": "success"})
        else:
            return Response({"status": "failed"})


class Authenticate_app(APIView):
    def post(self, request):
        app_id = request.data.get("app_id")
        app_secret = request.data.get("app_secret")
        app = Applications.objects.get(app_id=app_id)
        if app.app_secret == app_secret:
            return Response(
                {
                    "status": "success",
                    "app_id": app.app_id,
                    "app_name": app.app_name,
                }
            )
        else:
            return Response({"status": "failed"})
        
class Reset_redirect_url(APIView):
    def post(self, request):
        app_id = request.data.get("app_id")
        app_secret = request.data.get("app_secret")
        redirect_url = request.data.get("redirect_url")
        app = Applications.objects.get(app_id=app_id)
        if app.app_secret == app_secret:
            app.redirection_url = redirect_url
            app.save()
            return Response(
                {
                    "status": "success",
                    "app_id": app.app_id,
                    "app_secret": app.app_secret,
                }
            )
        else:
            return Response({"status": "failed"})


class Get_app(APIView):
    def get(self, request, app_id):
        app = Applications.objects.get(app_id=app_id)
        if app:
            return Response(
                {"app_id": app.app_id, "app_name": app.app_name, "status": "success"}
            )
        else:
            return Response({"status": "failed"})


class Get_user(APIView):
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            return Response(
                    {
                        "username": user.username,
                        "face_auth": user.face_auth,
                        "voice_auth": user.voice_auth,
                        "fido_auth": user.fido_auth,
                        "blockchain_auth": user.blockchain_auth,
                        "userExists": True,
                        "recovery_email": user.recovery_email,
                        "recovery_phone_number": user.recovery_phone_number,
                    })
        except User.DoesNotExist:
            return Response({"userExists": False})
        

class Get_user_by_token(APIView):
    def get(self, request, token):
        try:
            user = User.objects.get(token=token)
            return Response(
                    {
                        "username": user.username,
                        "userExists": True,
                    })
        except User.DoesNotExist:
            return Response({"userExists": False})
        

class Recovery_create(APIView):
    def post(self, request):
        try:
            #get username, method, base_url
            user = User.objects.get(username=request.data.get("username"))
            token = uuid.uuid4().hex
            data = {
                "username": request.data.get("username"),
                "token": token,
            }
            serializer = RecoveryTokenSerializer(data=data)
            if serializer.is_valid(raise_exception=True):
                sent = send_email(user.recovery_email, token, request.data.get("method"), request.data.get("base_url"))
                if not sent:
                    return Response({"status": "failed"})
                
                serializer.save()
                return Response(
                    {
                        "status": "success",
                        "recovery_token": token,
                    }
                )
        except User.DoesNotExist:
            return Response({"status": "failed"})
        

class Recovery_verify_face(APIView):
    def post(self, request):
        try:
            #get recovery_token, face_image
            token = request.data.get("recovery_token")
            try:
                recovery_token = RecoveryToken.objects.get(token=token)
            except RecoveryToken.DoesNotExist:
                return Response({"status": "failed", "message": "Invalid token"})
            if not recovery_token.valid:
                return Response({"status": "failed", "message": "Token Expired"})
            recovery_token.valid = False
            recovery_token.save()
            username = recovery_token.username
            user = User.objects.get(username = username)
            if user.face_auth:
                os.remove(f"media/registeredFaces/{username}.npy")
                embedding = create_face_embedding(request.data.get("face_image"))
                save_face_embedding(embedding)
                user.face_image = File(open("media/registeredFaces/embedding.npy", "rb"))
                user.save()
                return Response(
                    {
                        "status": "success",
                        "recovery_token": token,
                    }
                )
              
            else:
                return Response({"status": "failed", "message": "User does not have face auth enabled"})
        except User.DoesNotExist:
            return Response({"status": "failed", "message": "User does not exist"})
        

class Recovery_verify_voice(APIView):
    def post(self, request):
        try:
            #get recovery_token, voice_image
            token = request.data.get("recovery_token")
            try:
                recovery_token = RecoveryToken.objects.get(token=token)
            except RecoveryToken.DoesNotExist:
                return Response({"status": "failed", "message": "Invalid token"})
            if not recovery_token.valid:
                return Response({"status": "failed", "message": "Token Expired"})
            recovery_token.valid = False
            recovery_token.save()
            username = recovery_token.username
            user = User.objects.get(username = username)
            if user.voice_auth:
                os.remove(f"media/registeredVoices/{username}.npy")
                embedding = create_voice_embedding(request.data.get("voice_image"))
                save_voice_embedding(embedding)
                user.voice_image = File( open( 'media/registeredVoices/embedding.npy' ,'rb'))
                user.save()
                return Response(
                    {
                        "status": "success",
                        "recovery_token": token,
                    }
                )
            else:
                return Response({"status": "failed", "message": "User does not have voice auth enabled"})

        except User.DoesNotExist:
            return Response({"status": "failed", "message": "User does not exist"})



class Face_auth_signup(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        try:
            user = User.objects.get(username=request.data.get("username"))
            embedding = create_face_embedding(request.data.get("face_image"))
            save_face_embedding(embedding)
            user.face_image = File(open("media/registeredFaces/embedding.npy", "rb"))
            user.face_auth = True
            user.save()
            return Response({"status": "success"})
        except User.DoesNotExist:
            app_id = request.data.get("app_id")
            app = Applications.objects.get(app_id=app_id)
            embedding = create_face_embedding(request.data.get("face_image"))
            save_face_embedding(embedding)
            request.data.update({"face_auth": True})
            request.data.update(
                {
                    "face_image": File(
                        open("media/registeredFaces/embedding.npy", "rb")
                    )
                }
            )
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                user = User.objects.get(username=request.data.get("username"))
                code, nonce_len = generate_code(user.token, app.public_key)
                return Response(
                    {
                        **serializer.data,
                        "status": "success",
                        "code": code,
                        "nonce_len": nonce_len,
                        "redirect_url": app.redirection_url,
                    }
                )
            else:
                return Response({"status": "failed"})


class Face_auth_login(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        username = request.data.get("username")
        face_video = request.data.get("face_video")
        app_id = request.data.get("app_id")
        try:
            user = User.objects.get(username=username)
            app = Applications.objects.get(app_id=app_id)
            if user.face_auth:
                user_ob = UserSerializer(user)
                is_live, check_frames = verify_liveness(face_video)
                if not is_live:
                    return Response({"verified": False, "live": False})
                if verify_face(check_frames, username):
                    code, nonce_len = generate_code(user.token, app.public_key)
                    return Response({"verified": True, **user_ob.data, "code": code, "nonce_len": nonce_len, "redirect_url": app.redirection_url})
                else:
                    return Response({"verified": False})
            else:
                return Response({"verified": False})
        except User.DoesNotExist:
            return Response({"status": "NotExists"})


class Face_auth_Rereg(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        username = request.data.get("username")
        face_video = request.data.get("face_video")
        app_id = request.data.get("app_id")
        try:
            user = User.objects.get(username=username)
            app = Applications.objects.get(app_id=app_id)
            if user.face_auth:
                user_ob = UserSerializer(user)
                is_live, check_frames = verify_liveness(face_video)
                if not is_live:
                    return Response({"verified": False, "live": False})
                if verify_face(check_frames, username):
                    return Response(
                        {
                            "verified": True,
                            **user_ob.data,
                        }
                    )
                else:
                    return Response({"verified": False})
            else:
                return Response({"verified": False})
        except User.DoesNotExist:
            return Response({"status": "NotExists"})


class Voice_auth_signup(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        try:
            user = User.objects.get(username=request.data.get("username"))
            embedding = create_voice_embedding(request.data.get("voice_image"))
            save_voice_embedding(embedding)
            user.voice_image = File( open( 'media/registeredVoices/embedding.npy' ,'rb'))
            user.voice_auth = True
            user.save()
            return Response({"status": "success"})
        except User.DoesNotExist:
            app_id = request.data.get("app_id")
            app = Applications.objects.get(app_id=app_id)
            embedding = create_voice_embedding(request.data.get("voice_image"))
            save_voice_embedding(embedding)
            request.data.update({"voice_auth": True})
            request.data.update({"voice_image": File( open( 'media/registeredVoices/embedding.npy' ,'rb'))})
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                user = User.objects.get(username=request.data.get("username"))
                code, nonce_len = generate_code(user.token, app.public_key)
                return Response({**serializer.data, "status": "success", "code": code, "nonce_len": nonce_len, "redirect_url": app.redirection_url})
            else:
                return Response({"status": "failed"})


class Voice_auth_login(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        username = request.data.get("username")
        voice_image = request.data.get("voice_image")
        app_id = request.data.get("app_id")
        try:
            user = User.objects.get(username=username)
            app = Applications.objects.get(app_id=app_id)
            if user.voice_auth:
                user_ob = UserSerializer(user)
                embedding_test = create_voice_embedding(voice_image)
                embedding_reg = load_voice_embedding(user.username)
                if verify_voice(embedding_test, embedding_reg):
                    code, nonce_len = generate_code(user.token, app.public_key)
                    return Response({"verified": True, **user_ob.data, "code": code, "nonce_len": nonce_len, "redirect_url": app.redirection_url})
                else:
                    return Response({"verified": False})
            else:
                return Response({"verified": False})
        except User.DoesNotExist:
            return Response({"status": "NotExists"})


class Voice_auth_Rereg(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        username = request.data.get("username")
        voice_image = request.data.get("voice_image")
        try:
            user = User.objects.get(username=username)
            if user.voice_auth:
                user_ob = UserSerializer(user)
                embedding_test = create_voice_embedding(voice_image)
                embedding_reg = load_voice_embedding(user.username)
                if verify_voice(embedding_test, embedding_reg):
                    return Response(
                        {
                            "verified": True,
                            **user_ob.data,
                        }
                    )
                else:
                    return Response({"verified": False})
            else:
                return Response({"verified": False})
        except User.DoesNotExist:
            return Response({"status": "NotExists"})
        

# class Generate_user_code(APIView):
#     def get(self, request):
#         try:
#             user = User.objects.get(username=request.GET.get("username"))
#             app = Applications.objects.get(app_id=request.GET.get("app_id"))
#             code, nonce_len = generate_code(user.token, app.public_key)
#             return Response({"status": "success", "code": code, "nonce_len": nonce_len, "redirect_url": app.redirection_url})
#         except User.DoesNotExist or Applications.DoesNotExist:
#             return Response({"status": "failed"})
