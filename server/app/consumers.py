# chat/consumers.py
import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer


class AuthConsumer(WebsocketConsumer):
    def connect(self):
        self.channel_id = self.scope['url_route']['kwargs']['channel_id']
        self.channel_group_id = 'channel_%s' % self.channel_id

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.channel_group_id,
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        print("disconnect")
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.channel_group_id,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        print("receive")
        text_data_json = json.loads(text_data)
        type = text_data_json['type']
        message = text_data_json['message']

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.channel_group_id,
            {
                'type': type,
                'message': message,
            }
        )

    # Receive message from room group
    def chat_message(self, event):
        print("chat_message"  )
        message = event['message']
        type = event['type']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message,
            'type': type
        }))
