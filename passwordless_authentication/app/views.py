from django.shortcuts import render
from rest_framework.views import APIView
from . models import *
from rest_framework.response import Response
from . serializer import *

# Create your views here.

class SignUpView(APIView):

    serializer_class = ReactSerializer

    def post(self, request):
        serializer = ReactSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)

    def get(self, request):
        detail = [ {"username": detail.username, "biomertic_option": detail.biometric_option, "fido_option" : detail.fido_option, "blockchain_auth": detail.blockchain_auth} 
        for detail in SignUp.objects.all()]
        return Response(detail)