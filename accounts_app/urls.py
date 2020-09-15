# built-in imports

# third-party imports
from django.urls import path

# custom imports
from . import views

app_name = 'accounts_app'

urlpatterns = [
    path('login/', views.auth_login, name='login'),
    path('logout/', views.auth_logout, name='logout')
]
