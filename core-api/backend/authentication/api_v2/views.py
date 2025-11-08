from logging import getLogger

from django.contrib.auth.models import update_last_login
from django.db import transaction
from rest_framework import parsers, permissions, status
from rest_framework.authentication import BasicAuthentication
from rest_framework.exceptions import ValidationError
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework_simplejwt import views as jwtviews
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken

from ..models import User
from .public import VerificationCodeApp
from .serializers import (
    TokenPairSerializer,
    TokenRefreshSerializer,
    VerificationCodeLoginSerializer,
    VerificationCodeSerializer,
)

logger = getLogger(__name__)


class VerificationCodeRequestView(GenericAPIView):
    serializer_class = VerificationCodeSerializer
    permission_classes = (permissions.AllowAny,)

    @transaction.atomic()
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        verification_code = VerificationCodeApp.request(**serializer.validated_data)
        serializer = self.get_serializer(instance=verification_code)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TokenObtainPairView(jwtviews.TokenViewBase):
    serializer_class = VerificationCodeLoginSerializer
    parser_classes = (parsers.JSONParser,)

    def post(self, request, *args, **kwargs):
        return self.code_login(request, *args, **kwargs)

    def code_login(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class TokenRefreshView(jwtviews.TokenRefreshView):
    serializer_class = TokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
