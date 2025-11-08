from django.contrib.auth import get_user_model
from rest_framework import serializers

from authentication.models import NotificationToken
from common.serializers import BaseFileModelSerializer, BaseModelSerializer

User = get_user_model()


class UserSerializer(BaseFileModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "first_name",
            "middle_name",
            "last_name",
            "birth_date",
            "gender",
            "email",
            "phone",
            "last_location",
            "is_phone_verified",
            "is_staff",
            "is_admin",
            "file",
            "file_base64",
        )
        expandable_fields = dict(
            favourite_attractions=dict(
                serializer="attractions.api.serializers.UserFavouriteAttractionSerializer",
                many=True,
            ),
            favourite_routes=dict(
                serializer="routes.api.serializers.RouteLikeSerializer",
                many=True,
            ),
            viewed_attractions=dict(
                serializer="attractions.api.serializers.AttractionBrowsSerializer",
                many=True,
            ),
            called_attractions=dict(
                serializer="attractions.api.serializers.AttractionCallSerializer",
                many=True,
            ),
            viewed_routes=dict(
                serializer="routes.api.serializers.RouteBrowsSerializer",
                many=True,
            ),
            map_viewed_routes=dict(
                serializer="routes.api.serializers.RouteMapBrowsSerializer",
                many=True,
            ),
        )


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True, required=True)
    phone = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ["email", "phone"]


class PassCodeSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ["email"]


class EmailVerificationSerializer(serializers.ModelSerializer):
    token = serializers.CharField(max_length=555)

    class Meta:
        model = User
        fields = ["token"]


class ChangePasswordSerializer(BaseModelSerializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = (
            "old_password",
            "new_password",
        )


class ResetPasswordSerializer(BaseModelSerializer):
    email = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ("email",)


class NotificationTokenSerializer(BaseModelSerializer):
    class Meta:
        model = NotificationToken
        expandable_fields = dict(user="authentication.api.serializers.UserSerializer")
