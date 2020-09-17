import datetime as dt

import django_rq
from django.db import models
from model_utils import DateTimeMixin


from vetodoprj.consumer import ReminderConsumer
from vetodoprj.utils.dateutils import parse_reminder_datetime


class Todo(models.Model, DateTimeMixin):
    title = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    done = models.BooleanField(default=False)

    reminder_datetime = models.DateTimeField(null=True)
    author = models.ForeignKey('auth.user', on_delete=models.CASCADE)

    def add(self, todo_dct, author):
        """
        Creates New `Todo` Task from `todo_dct` request body and associate with `author`
        :param todo_dct: `Todo` request body
        :param author: Currently logged-in auth user instance
        :return: Newly Created Todo Instance
        """
        for k, v in todo_dct.items():
            if hasattr(self, k):
                setattr(self, k, v)
        self.author = author
        self.save()
        return self

    def set_status(self, status):
        """
            A wrapper to change the `Todo` task status
        :param status:  A boolean represents new task status
        :return: None
        """
        self.done = status
        self.save()

    def update(self, todo_dct):
        """
        Update the `Todo` Task with `todo_dct` request body
        Note: The `author` field should not be present in `todo_dct`
        :param todo_dct: `Todo` request body
        :return: Updated Todo Instance
        """
        for k, v in todo_dct.items():
            if hasattr(self, k):
                setattr(self, k, v)
        self.save()
        return self

    @classmethod
    def create_reminder_notification(cls, todo_id):
        todo_obj = cls.objects.filter(id=todo_id).first()

        print(f'{dt.datetime.now()}: {todo_obj.title}')
        
        todo_obj = TodoReminder().add(todo_obj)

        # push reminder notification
        reminder_data = todo_obj.to_dict()
        print(reminder_data)
        ReminderConsumer.emit(reminder_data)

        return todo_obj

    def schedule_reminder(self, reminder_utc_datetime_str):
        # Todo: enqueue `Todo.create_reminder_notification()` function
        #  on `reminder_utc_datetime_str` and save reminder_datetime in `Todo`

        self.reminder_datetime = parse_reminder_datetime(reminder_utc_datetime_str)
        self.save()

        print(f'{self.title} Scheduled at {self.reminder_datetime}')

        scheduler = django_rq.get_scheduler('reminders_q')
        job = scheduler.enqueue_at(self.reminder_datetime, Todo.create_reminder_notification, todo_id=self.id)

    def __str__(self):
        return f'<Todo: {self.title}({self.done}) by {self.author}>'

    __repr__ = __str__


class TodoReminder(models.Model, DateTimeMixin):
    todo = models.ForeignKey(Todo, on_delete=models.CASCADE)

    def add(self, todo_obj):
        self.todo = todo_obj
        self.save()
        return self

    def to_dict(self):
        from vetodo_app.serializers import TodoReminderSerializer
        return TodoReminderSerializer(self).data
