# built-in imports

# third-party imports
from rest_framework import serializers

# custom imports
from vetodo_app.models import (Todo, TodoReminder)


class TodoSerializer(serializers.ModelSerializer):
    """
        Serializer Implementation for `Todo` Model
        Note: `author` field is skipped from serializer fields to avoid
                re-save while `update` action
    """

    class Meta:
        model = Todo
        fields = ('id', 'title', 'description', 'done', 'reminder_datetime')


class TodoReminderSerializer(serializers.ModelSerializer):
    todo = TodoSerializer()

    class Meta:
        model = TodoReminder
        fields = ('id', 'todo', )
