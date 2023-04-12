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

# class TestBytesSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = TestBytes
#         fields = '__all__'