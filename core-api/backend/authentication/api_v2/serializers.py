from django.contrib.auth import get_user_model
from django.contrib.auth.models import update_last_login
from rest_framework import exceptions, serializers
from rest_framework_simplejwt.serializers import PasswordField
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken

from .public import CustomerApp, VerificationCodeApp

User = get_user_model()


class VerificationCodeSerializer(serializers.Serializer):
    message = serializers.CharField(
        read_only=True, default="Код подтверждения отправлен по номеру телефона."
    )
    phone = serializers.CharField(source="request_id", required=True)
    expires_at = serializers.DateTimeField(read_only=True)
    retry_at = serializers.DateTimeField(read_only=True)


class VerificationCodeLoginSerializer(serializers.Serializer):
    # Substitution to default `TokenObtainPairSerializer` from `rest_framework_simplejwt`

    phone = serializers.CharField(
        label="Phone Number", source="request_id", write_only=True, required=True
    )
    code = PasswordField(
        label="Verification Code", source="value", write_only=True, required=True
    )

    def validate(self, attrs):
        if VerificationCodeApp.verify(**attrs):
            self.user = CustomerApp.get_or_create(phone=attrs["request_id"])

        if not api_settings.USER_AUTHENTICATION_RULE(self.user):
            raise exceptions.AuthenticationFailed(
                "No active account found with the given credentials",
                "no_active_account",
            )

        refresh = self.get_token(self.user)

        data = {
            "token_type": "Bearer",
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh),
        }

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)

        return data

    @classmethod
    def get_token(cls, user):
        return RefreshToken.for_user(user)


class TokenRefreshSerializer(serializers.Serializer):
    # Substitution to default `TokenRefreshSerializer` from `rest_framework_simplejwt`

    refresh_token = serializers.CharField()

    def validate(self, attrs):
        refresh = RefreshToken(attrs["refresh_token"])

        data = {
            "token_type": "Bearer",
            "access_token": str(refresh.access_token),
            "refresh_token": attrs["refresh_token"],
        }

        if api_settings.ROTATE_REFRESH_TOKENS:
            if api_settings.BLACKLIST_AFTER_ROTATION:
                try:
                    # Attempt to blacklist the given refresh token
                    refresh.blacklist()
                except AttributeError:
                    # If blacklist app not installed, `blacklist` method will
                    # not be present
                    pass

            refresh.set_jti()
            refresh.set_exp()
            refresh.set_iat()

            data["refresh_token"] = str(refresh)

        return data

    class Meta:
        ref_name = "TokenRefreshV2Serializer"


class TokenPairSerializer(serializers.Serializer):
    token_type = serializers.CharField(default="Bearer")
    access_token = serializers.CharField()
    refresh_token = serializers.CharField()

    class Meta:
        ref_name = "TokenPairV2Serializer"
