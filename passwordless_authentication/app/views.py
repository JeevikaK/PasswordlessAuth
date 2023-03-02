from django.shortcuts import render
from rest_framework.views import APIView
from . models import *
from rest_framework.response import Response
from . serializer import *
import uuid
from secrets import *
from rest_framework.parsers import FileUploadParser, MultiPartParser, FormParser


# Create your views here.

class Register_app(APIView):
    def post(self, request):
        data = {
            "app_id": uuid.uuid4().hex,
            "app_secret": token_hex(16),
        }
        serializer = ApplicationSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({ **serializer.data , "status":"success" })
        else:
            return Response({"status": "failed"})


class Authenticate_app(APIView):
    def post(self, request):
        app_id = request.data.get('app_id')
        app_secret = request.data.get('app_secret')
        redirect_url = request.data.get('redirect_url')
        app_name = request.data.get('app_name')
        app = Applications.objects.get(app_id=app_id)
        if app.app_secret == app_secret:
            app.app_name = app_name
            app.redirection_url = redirect_url
            app.save()
            return Response({"status": "success", 
                             "app_id": app.app_id,
                             "app_secret": app.app_secret,
                            })
        else:
            return Response({"status": "failed"})
        

class Get_app(APIView):
    def get(self, request, app_id):
        app = Applications.objects.get(app_id=app_id)
        if app:
            return Response({"app_id": app.app_id, "app_name": app.app_name, "status": "success"})
        else:
            return Response({"status": "failed"})
        
        
class Get_user(APIView):
    def get(self, request, username):
        user = User.objects.get(username=username)
        if user:
            return Response({"username": user.username, 
                             "face_auth": user.face_auth, 
                             "voice_auth": user.voice_auth, 
                             "fido_auth": user.fido_auth,
                             "blockchain_auth": user.blockchain_auth,
                             "userExists": True
                             })
        else:
            return Response({"userExists": False})
        

class Face_auth_signup(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        try:
            user = User.objects.get(username=request.data.get('username'))
            user.face_image = request.data.get('face_image')
            user.face_auth = True
            user.save()
            return Response({"status": "success"})
        except User.DoesNotExist: 
            request.data.update({"face_auth": True})
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response({ **serializer.data , "status":"success" })
            else:
                return Response({"status": "failed"})

        
class Face_auth_login(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        username = request.data.get('username')
        face_image = request.data.get('face_image')
        print(request.data)
        try:
            user = User.objects.get(username=username)
            if user.face_image == face_image:
                return Response({"status": "success", **user})
            else:
                return Response({"status": "failed"})
        except User.DoesNotExist:
            return Response({"status": "NotExists"})
        

class Voice_auth_signup(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        try:
            user = User.objects.get(username=request.data.get('username'))
            user.voice_image = request.data.get('voice_image')
            user.voice_auth = True
            user.save()
            return Response({"status": "success"})
        except User.DoesNotExist:    
            request.data.update({"voice_auth": True})
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response({ **serializer.data , "status":"success" })
            else:
                return Response({"status": "failed"})


class Voice_auth_login(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        username = request.data.get('username')
        voice_image = request.data.get('voice_image')
        print(request.data)
        try:
            user = User.objects.get(username=username)
            if user.voice_image == voice_image:
                return Response({"status": "success", **user})
            else:
                return Response({"status": "failed"})
        except User.DoesNotExist:
            return Response({"status": "NotExists"})