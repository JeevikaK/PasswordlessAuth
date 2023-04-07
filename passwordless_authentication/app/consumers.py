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
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.channel_group_id,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        print("receive"  )
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        name = text_data_json['name']

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'name': name
            }
        )

    # Receive message from room group
    def chat_message(self, event):
        print("chat_message"  )
        message = event['message']
        name = event['name']
        type = event['type']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message,
            'name': name,
            'type': type
        }))
