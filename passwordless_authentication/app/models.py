from django.db import models
from django.utils import timezone

# Create your models here.
class Applications(models.Model):
    app_id = models.CharField(max_length=100, primary_key=True)
    app_name = models.CharField(max_length=50, default="New Application")
    app_secret = models.CharField(max_length=100)
    redirection_url = models.CharField(max_length=100, default="")
    created_at = models.DateTimeField(default=timezone.now())

    def _str_(self):
        return self.app_id


class User(models.Model):
    username = models.CharField(max_length=100, primary_key=True)
    face_auth = models.BooleanField(default=False)
    fido_auth = models.BooleanField(default=False)
    blockchain_auth = models.BooleanField(default=False)
    voice_auth = models.BooleanField(default=False)
    face_image = models.ImageField(upload_to='images/', default="")
    recovery_email = models.CharField(max_length=100)
    recovery_phone_number = models.CharField(max_length=100)
    created_at = models.DateTimeField(default=timezone.now())

    def _str_(self):
        return self.username
    
