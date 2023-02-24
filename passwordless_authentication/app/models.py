from django.db import models

# Create your models here.
class SignUp(models.Model):
    username = models.CharField(max_length=30)
    biometric_option = models.CharField(max_length=30)
    fido_option = models.CharField(max_length=30)
    blockchain_auth = models.CharField(max_length=30)

    def _str_(self):
        return self.username


class Audio(models.Model):
    audio_file = models.BinaryField(null=True, blank=True)
    name = models.CharField(max_length=255)
    
    def _str_(self):
        return self.name