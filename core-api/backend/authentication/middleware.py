import json
import os
from logging import getLogger

from django.contrib.auth import get_user_model
from rest_framework.generics import get_object_or_404
from rest_framework.renderers import JSONRenderer
from rest_framework import status
from rest_framework.response import Response

logger = getLogger(__name__)
User = get_user_model()


class CheckAdminPermissionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if (request.META.get("HTTP_ORIGIN") in os.getenv("ADMIN_DOMAINS", "https://admin.kchrtravel.ru,https://admin.kchrtravel.edisoncorp.ru").split(",")
                and request.get_full_path() in ("/api/token/obtain/", "/api/token/refresh/")):

            user_email = json.loads(request.body).get("email")
            user = User.objects.filter(email=user_email)
            user = user.first() if user.exists() else None

            if user and not any((user.is_admin, user.is_staff, user.is_superuser)):
                response = Response(
                    {"detail": "You do not have permission to perform this action.", "code": "permission_denied"},
                    status=status.HTTP_403_FORBIDDEN)
                response.accepted_renderer = JSONRenderer()
                response.accepted_media_type = "application/json"
                response.renderer_context = {}
                response.render()
                return response

        response = self.get_response(request)
        return response

