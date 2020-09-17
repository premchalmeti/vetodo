import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync


class ReminderConsumer(AsyncWebsocketConsumer):
    GROUP_PREFIX = 'reminder'
    CMD_TYPE = 'reminder_ntf'
    ROOM_NAME = 'todo'

    async def connect(self):
        # self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_name = self.ROOM_NAME
        self.room_group_name = f'{self.GROUP_PREFIX}_{self.room_name}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        message = text_data_json['reminder']
        print('in receive' + json.dumps(message, indent=2))

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': self.CMD_TYPE,
                'reminder': message
            }
        )

    @classmethod
    def ping(cls):
        cls.emit('Ping')

    @classmethod
    def emit(cls, data):
        import channels.layers
        channel_layer = channels.layers.get_channel_layer()
        room_group_name = f'{cls.GROUP_PREFIX}_{cls.ROOM_NAME}'
        print('in emit' + json.dumps(data, indent=2))
        async_to_sync(channel_layer.group_send)(
            room_group_name,
            {
                'type': cls.CMD_TYPE,
                'reminder': data
            }
        )

    # Receive message from room group
    async def reminder_ntf(self, event):
        message = event['reminder']
        print('in reminder_ntf'+json.dumps(message, indent=2))

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'reminder': message
        }))
