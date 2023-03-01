from django.shortcuts import render
from rest_framework.views import APIView
from . models import *
from rest_framework.response import Response
from . serializer import *
import uuid
from secrets import *

# Create your views here.

# class SignUpView(APIView):

#     # serializer_class = ReactSerializer

#     def post(self, request):
#         serializer = ReactSerializer(data=request.data)
#         print(serializer.data)
#         if serializer.is_valid(raise_exception=True):
#             # serializer.save()
#             return Response(serializer.data)

#     def get(self, request):
#         detail = [ {"username": detail.username, "biomertic_option": detail.biometric_option, "fido_option" : detail.fido_option, "blockchain_auth": detail.blockchain_auth} 
#         for detail in SignUp.objects.all()]
#         return Response(detail)

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
        

class Face_auth_signup(APIView):
    def post(self, request):
        username = request.data.get('username')
        face_image = request.data.get('face_image')
        recovery_email = request.data.get('recovery_email')
        recovery_phone_number = request.data.get('recovery_phone_number')
        user = User.objects.create(username=username, face_image=face_image, recovery_email=recovery_email, recovery_phone_number=recovery_phone_number, face_auth = True)
        user.save()
        return Response({"status": "success"})

        
