# built-in imports here

# third-party imports here
from django.contrib import admin
from django.urls import path, include

# custom imports here

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts_app.urls')),
    path('todos/', include('vetodo_app.urls')),
    path('django-rq/', include('django_rq.urls'))
]
