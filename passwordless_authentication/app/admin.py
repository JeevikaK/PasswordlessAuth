from django.contrib import admin
from . models import SignUp

# Register your models here.
class SignUpAdmin(admin.ModelAdmin):
    lis = ('username', 'biometric_option', 'fido_option', 'blockchain_auth')

admin.site.register(SignUp, SignUpAdmin)