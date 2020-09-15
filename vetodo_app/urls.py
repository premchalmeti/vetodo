# built-in imports

# third-party imports
from rest_framework import routers

# custom imports
from vetodo_app import views


# use of routers is recommended practice to keep consistency
todoRouter = routers.DefaultRouter()

todoRouter.register('reminders', views.TodoReminderViewSet, basename='reminders')
todoRouter.register('tasks', views.TodoViewSet, basename='tasks')

urlpatterns = todoRouter.urls

