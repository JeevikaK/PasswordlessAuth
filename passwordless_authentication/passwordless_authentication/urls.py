"""passwordless_authentication URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from app.views import *


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register_app',Register_app.as_view(), name="register_app"),
    path('api/authenticate_app', Authenticate_app.as_view(), name="Authenticate_app"),
    path('api/get_app/<str:app_id>', Get_app.as_view(), name="Get_app"),
    path('api/reset_redirect_url', Reset_redirect_url.as_view(), name="Reset_redirect_url"),
    path('api/get_user/<str:username>', Get_user.as_view(), name="Get_user"),
    path('api/get_user_by_token/<str:token>', Get_user_by_token.as_view(), name="Get_user_by_token"),
    path('api/signup-face-auth', Face_auth_signup.as_view(), name="Face_auth_signup"),
    path('api/login-face-auth', Face_auth_login.as_view(), name="Face_auth_login"),
    path('api/signup-voice-auth', Voice_auth_signup.as_view(), name="Voice_auth_signup"),
    path('api/login-voice-auth', Voice_auth_login.as_view(), name="Voice_auth_login"),
    # path('api/generate-user-code', Generate_user_code.as_view(), name="Generate_user_code")
]

