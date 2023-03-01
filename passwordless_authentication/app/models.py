from django.db import models
from django.utils import timezone

# Create your models here.
class Applications(models.Model):
    app_id = models.CharField(max_length=100, primary_key=True)
    app_name = models.CharField(max_length=50, default="New Application")
    app_secret = models.CharField(max_length=100)
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
    blockchain_auth = models.BooleanField(default=False)
    voice_auth = models.BooleanField(default=False)
    face_image = models.ImageField(upload_to=img_dir_path, default="")
    voice_image = models.FileField(upload_to=audio_dir_path, default="")
    recovery_email = models.CharField(max_length=100, default=None)
    recovery_phone_number = models.CharField(max_length=100, default=None)
    created_at = models.DateTimeField(default=timezone.now)
    

    def _str_(self):
        return self.username
    
