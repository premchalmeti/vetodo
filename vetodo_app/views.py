# built-in imports

# third-party imports
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action

# custom-imports
from vetodo_app.models import (Todo, TodoReminder)
from vetodo_app.serializers import (TodoSerializer, TodoReminderSerializer)


class TodoViewSet(ModelViewSet):
    """
       `TodoViewSet` class is `Task` Resource Implementation and responsible for,
       1. List Tasks
       2. Create Task
       3. Edit/Update Task
       4. Delete Task
       5. Change Task `Done` status
       6. Scheduler reminder for Task
   """
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

    def get_queryset(self):
        """
            overriden default get_queryset() for filtering queryset
            for on current user
        :return:
        """
        return self.queryset.filter(author=self.request.user).all()

    def create(self, request, *args, **kwargs):
        """
            Overridden create() method for associating `Todo` with `Author`

            :param request: DRF HttpRequest Instance
            :param args: positional parameters
            :param kwargs: keyword arguments
            :return: `JsonResponse({'ok'=True})` if todo created
                else `JsonResponse({'ok'=True, 'err_msg': 'reason'})`
        """
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            todo_obj = serializer.save(author=request.user)
            return JsonResponse({'ok': True, 'todo_id': todo_obj.id})

    def update(self, request, pk=None, *args, **kwargs):
        """
        :param request: DRF HttpRequest Instance
        :param pk:  `Todo` lookup field(id|PK) captured from url
        :param args: positional parameters
        :param kwargs: keyword arguments
        :return: `JsonResponse({'ok'=True})` if todo update
                else `JsonResponse({'ok'=True, 'err_msg': 'reason'})`
        """
        todo_obj = self.get_object()
        serializer = self.get_serializer(todo_obj, data=request.data)

        if serializer.is_valid():
            serializer.save(author=request.user)
            return JsonResponse({'ok': True})

    @action(detail=False, methods=['post'])
    def done(self, request):
        """
            Custom Action To Change `Todo(done)` status
        :param request: DRF HttpRequest Instance
        :return: `JsonResponse({'ok'=True})` if todo status updated
                else `JsonResponse({'ok'=True, 'err_msg': 'reason'})`
        """
        pk = request.data.get('id')
        status = request.data.get('done')
        todo_obj = get_object_or_404(Todo, pk=pk)
        todo_obj.set_status(status)
        return JsonResponse({'ok': True})

    @action(detail=False, methods=['post'])
    def set_reminder(self, request):
        """
            Custom Action To set `Todo(reminder_datetime)` status
        :param request: DRF HttpRequest Instance
        :return: `JsonResponse({'ok'=True})` if todo status updated
                else `JsonResponse({'ok'=True, 'err_msg': 'reason'})`
        """
        pk = request.data.get('id')
        utc_datetime_str = request.data.get('utc_datetime')

        todo_obj = get_object_or_404(Todo, pk=pk)
        todo_obj.schedule_reminder(utc_datetime_str)

        return JsonResponse({'ok': True})


class TodoReminderViewSet(ModelViewSet):
    """
       `TodoReminderViewSet` class is `TodoReminder` Resource Implementation and responsible for,
       1. List All TodoReminders
       2. Delete TodoReminder
   """
    queryset = TodoReminder.objects.all()
    serializer_class = TodoReminderSerializer

    def get_queryset(self):
        """
            overriden default get_queryset() for filtering queryset
            for on current user
        :return:
        """
        return self.queryset.filter(todo__author=self.request.user).all()

    def destroy(self, request, pk=None, *args, **kwargs):
        """
        :param request: DRF HttpRequest Instance
        :param pk:  `Todo` lookup field(id|PK) captured from url
        :param args: positional parameters
        :param kwargs: keyword arguments
        :return: `JsonResponse({'ok'=True})` if todo update
                else `JsonResponse({'ok'=True, 'err_msg': 'reason'})`
        """
        todo_reminder_obj = self.get_object()
        self.perform_destroy(todo_reminder_obj)

        todo_obj = todo_reminder_obj.todo
        todo_obj.reminder_datetime = None
        todo_obj.save()

        return JsonResponse({'ok': True})


def index(request):
    return render(request, 'vetodo_app/index.html')


def room(request, room_name):
    return render(request, 'vetodo_app/room.html', {
        'room_name': room_name
    })
