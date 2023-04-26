# chat/routing.py
from django.urls import path

from . import consumers

websocket_urlpatterns = [
    path("ws/confirmation/<str:channel_id>/", consumers.AuthConsumer.as_asgi()),
]
