from django.db import models
from django.utils import timezone
from secrets import *

# Create your models here.
class Applications(models.Model):
    app_id = models.CharField(max_length=100, primary_key=True)
    app_name = models.CharField(max_length=50, default="New Application")
    app_secret = models.CharField(max_length=100)
    public_key = models.CharField(max_length=1000, default="")
    redirection_url = models.CharField(max_length=100, default="")
    created_at = models.DateTimeField(default=timezone.now)

    def _str_(self):
        return self.app_id


def img_dir_path(instance, filename):
        ext = filename.split('.')[-1]
        upload_to='registeredFaces/'+ str(instance.username) + '.' + ext
        return upload_to 

def audio_dir_path(instance, filename):
        ext = filename.split('.')[-1]
        upload_to='registeredVoices/'+ str(instance.username) + '.' + ext
        return upload_to 

class User(models.Model):
    username = models.CharField(max_length=100, primary_key=True)
    face_auth = models.BooleanField(default=False)
    fido_auth = models.BooleanField(default=False)
    # blockchain_auth = models.BooleanField(default=False)
    voice_auth = models.BooleanField(default=False)
    face_image = models.FileField(upload_to=img_dir_path, default="")
    voice_image = models.FileField(upload_to=audio_dir_path, default="")
    token = models.CharField(max_length=100, unique=True)
    recovery_email = models.CharField(max_length=100, default=None, null=True)
    recovery_phone_number = models.CharField(max_length=100, default=None, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    def _str_(self):
        return self.username
    

class RecoveryToken(models.Model):
    token = models.CharField(max_length=100, primary_key=True)
    username = models.CharField(max_length=100)
    valid = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)

    def _str_(self):
        return self.token 
    
