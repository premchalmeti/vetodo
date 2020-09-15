# built-in imports
import json

# third-party imports
from django.contrib.auth import (authenticate, login, logout)
from django.views.decorators.http import (require_POST, require_safe)
from django.http import JsonResponse

# custom imports
from accounts_app.serializers import UserSerializer


@require_POST
def auth_login(request):
    credentials_body = json.loads(request.body)

    username = credentials_body.get('username')
    password = credentials_body.get('password')

    user = authenticate(request, username=username, password=password)

    if not user:
        return JsonResponse({'ok': False, 'err_msg': 'Invalid Email / Password'})

    login(request, user)

    serializer = UserSerializer(request.user)
    user_dct = serializer.data

    return JsonResponse({'ok': True, 'user': user_dct})


@require_safe
def auth_logout(request):
    logout(request)
    return JsonResponse({'ok': True}, status=200)
