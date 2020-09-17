# built-in imports here

# third-party imports here
from django.contrib import admin
from django.urls import path, include

# custom imports here
from vetodo_app import views
from . import consumer


urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts_app.urls')),
    path('todos/', include('vetodo_app.urls')),
    path('django-rq/', include('django_rq.urls')),

    path('', views.index, name='index'),
    path('<str:room_name>/', views.room, name='room')
]

websocket_urlpatterns = [
    path('ws/<str:room_name>/', consumer.ReminderConsumer)
]
