from rest_framework import serializers
from . models import *

class ReactSerializer(serializers.ModelSerializer):
    class Meta:
        model = SignUp
        fields = ['username', 'biometric_option', 'fido_option', 'blockchain_auth']

class VoiceRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Audio
        fields = ['audio_file', 'name']