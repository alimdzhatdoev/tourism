import os
import random
import smtplib
from logging import getLogger

import jwt
from django.conf import settings
from django.contrib.auth.models import Group
from django_filters import rest_framework as d_filters
from rest_framework import filters
from django.core.mail import send_mail
from django.db import transaction
from django.shortcuts import render
from django.template.loader import render_to_string
from django.utils.decorators import method_decorator
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from jwt.algorithms import get_default_algorithms
from rest_framework import generics, permissions, status, views
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from authentication.api.serializers import (
    ChangePasswordSerializer,
    EmailVerificationSerializer,
    RegisterSerializer,
    ResetPasswordSerializer,
    UserSerializer,
)
from authentication.models import User
from authentication.services.customers import get_customer_group
from authentication.services.get_user_permissions import get_dict_of_user_permissions
from authentication.services.password import get_random_password
from authentication.services.verify_email import (
    get_message_data,
    send_verify_email_message,
)
from common.swagger import get_method_decorators_expand_params
from common.viewsets import BaseModelViewSet


logger = getLogger(__name__)


@method_decorator(**get_method_decorators_expand_params(UserSerializer))
class UserViewSet(BaseModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    filter_backends = (
        filters.SearchFilter,
        d_filters.DjangoFilterBackend,
        filters.OrderingFilter,
    )

    filterset_fields = {

    }

    search_fields = [
        "first_name",
        "last_name",
        "email",
        "phone",
    ]

    def get_queryset(self):
        queryset = super().get_queryset()
        customer_group = Group.objects.get(name="Customer")

        if customer_group in self.request.user.groups.all():
            queryset = queryset.filter(id=self.request.user.id)

        return queryset

    def get_permissions(self):
        if self.action in ["create"]:
            self.permission_classes = (permissions.AllowAny(),)
        else:
            self.permission_classes = (permissions.IsAuthenticated(),)
        return self.permission_classes

    def list(self, request, *args, **kwargs):
        response = super(UserViewSet, self).list(request)
        if "/users/me/" in request.path:
            user = request.user
            data = self.get_serializer(user).data
            data["permissions"] = get_dict_of_user_permissions(user)
            return Response(data)
        return response


class AuthenticateView(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def get_permissions(self):
        return [permissions.AllowAny()]

    @transaction.atomic()
    def post(self, request):
        customer_group = get_customer_group()

        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            return Response(
                data={
                    "error": "incorrect email address",
                    "detail": " ".join(
                        [
                            v["message"]
                            for val in e.get_full_details().values()
                            for v in val
                        ]
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        email = serializer.validated_data["email"]
        phone = serializer.validated_data.get("phone")

        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            message = "Авторизация в приложении Trave App"
        else:
            user = User.objects.create(email=email, phone=phone, is_active=True)
            user.groups.add(customer_group)
            message = "Спасибо за регистрацию!"

        if user.email == "tester@tester.com":

            user.set_password("9999")
            user.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)


        password = str(random.randint(1000, 9999))
        user.set_password(password)
        user.save()

        absolute_url, email_body = get_message_data(
            user=user,
            username=user.username,
            scheme=request.scheme,
            domain=request.META["HTTP_HOST"],
        )

        try:
            send_verify_email_message(absolute_url, email_body, [user.email], password, message=message)
        except smtplib.SMTPDataError:
            data = {
                "error": "incorrect email address",
                "detail": f"Mailbox {user.email} is unavailable: user not found",
            }
            user.delete()
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class VerifyEmail(views.APIView):
    serializer_class = EmailVerificationSerializer
    permission_classes = [permissions.AllowAny]

    token_param_config = openapi.Parameter(
        "token",
        in_=openapi.IN_QUERY,
        description="Description",
        type=openapi.TYPE_STRING,
    )

    @swagger_auto_schema(manual_parameters=[token_param_config])
    def get(self, request):
        token = request.GET.get("token")
        try:
            payload = jwt.decode(
                token, key=settings.SECRET_KEY, algorithms=get_default_algorithms()
            )
            user = User.objects.get(id=payload["user_id"])
            if not user.is_active:
                user.is_active = True
                user.save()
            return render(
                request,
                os.path.join(settings.TEMPLATES_DIR, "email_verification_success.html"),
            )
        except jwt.ExpiredSignatureError:
            return Response(
                {"error": "Activation Expired"}, status=status.HTTP_400_BAD_REQUEST
            )
        except jwt.exceptions.DecodeError:
            return Response(
                {"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST
            )


class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    model = User

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response(
                    {"old_password": ["Wrong password."]},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            response = {
                "status": "success",
                "code": status.HTTP_200_OK,
                "message": "Password updated successfully",
                "data": [],
            }

            return Response(response)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(views.APIView):
    serializer_class = ResetPasswordSerializer

    def get_permissions(self):
        return [permissions.AllowAny()]

    @transaction.atomic()
    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            email = serializer.data.get("email")
            user = User.objects.filter(email=email)
            if user:
                user = user.first()
                new_password = get_random_password()

                user.set_password(new_password)
                user.save()

                email_body = " \n"
                html_message = render_to_string(
                    os.path.join(
                        settings.TEMPLATES_DIR, "email_verification_success.html"
                    ),
                    {"message": f"Ваш новый пароль: {new_password}"},
                )
                send_mail(
                    "Reset Password",
                    email_body,
                    settings.EMAIL_HOST_USER,
                    [email],
                    html_message=html_message,
                )

                response = {
                    "status": "success",
                    "code": status.HTTP_200_OK,
                    "message": "Email with new password has been set",
                    "data": [],
                }

                return Response(response)
            else:
                response = {
                    "status": "failed",
                    "code": status.HTTP_400_BAD_REQUEST,
                    "message": "User does not exist",
                    "data": [],
                }
                return Response(response)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
