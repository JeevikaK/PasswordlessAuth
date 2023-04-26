from rest_framework import serializers
from . models import *

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Applications
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class RecoveryTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecoveryToken
        fields = '__all__'

class CredentialsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Credentials
        fields = '__all__'