import base64
from typing import Any, Dict

from django.conf import settings
from django.core.files.base import ContentFile
from django.db import models
from requests.compat import urljoin
from rest_framework import serializers
from rest_framework_serializer_extensions.serializers import SerializerExtensionsMixin

from common.models import BaseModel


class ChoiceAsDictField(serializers.ChoiceField):
    """
    Serializes field with choices as a dictionary to provide both value and label of the choice.
    """

    def to_representation(self, value):
        if value in ("", None):
            return None
        return {"id": value, "label": self.choices[value]}


class CustomFileField(serializers.FileField):
    def to_representation(self, value):
        if settings.IMGPROXY_PREFIX is None:
            return super().to_representation(value)

        if not value:
            return None

        return urljoin(settings.IMGPROXY_PREFIX, value.name)


class CustomImageField(serializers.ImageField, CustomFileField):
    pass


class CustomImageThumbnailField(serializers.ImageField, CustomFileField):
    def to_representation(self, value):
        url = super().to_representation(value)
        return f"{url}/small"


class CreatorSerializer(serializers.Serializer):
    """Serializer for created_by"""

    id = serializers.IntegerField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    file = CustomFileField(read_only=True)
    is_admin = serializers.BooleanField(read_only=True)


class BaseModelSerializer(SerializerExtensionsMixin, serializers.ModelSerializer):
    """
    A base ModelSerializer used by default in the project. Extends default ModelSerializer by:
    * using custom serialization for choice fields
    * allowing the fields to be defined on a per-view/request basis,
      fields can be whitelisted, blacklisted, and child serializers
      can be optionally expanded through SerializerExtensionsMixin
    """

    created_dttm = serializers.DateTimeField(read_only=True)
    created_by = CreatorSerializer(read_only=True)

    serializer_choice_field = ChoiceAsDictField
    serializer_field_mapping = serializers.ModelSerializer.serializer_field_mapping
    serializer_field_mapping[models.FileField] = CustomFileField
    serializer_field_mapping[models.ImageField] = CustomImageField

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        if (
            getattr(self.Meta, "fields", None) is None
            and getattr(self.Meta, "exclude", None) is None
        ):
            setattr(self.Meta, "fields", "__all__")

    def create(self, validated_data):
        if "api/users/" not in self.context.get("request").path:
            validated_data["created_by"] = self.context["request"].user

        return super().create(validated_data)

    class Meta:
        model: BaseModel


class FileBase64Field(serializers.CharField):
    def to_internal_value(self, data):
        data = super().to_internal_value(data)
        if not data:
            return None
        format, img_str = data.split(";base64,")
        ext = format.split("/")[-1]
        return ContentFile(base64.b64decode(img_str), name=f"temp.{ext}")


class BaseFileSerializer(serializers.Serializer):
    file_base64 = FileBase64Field(allow_null=True, required=False, write_only=True)
    file_name = serializers.CharField(allow_null=True, required=False, write_only=True)  # deprecated
    file = CustomFileField(allow_null=True, required=False)

    def to_internal_value(self, data):
        if "file_base64" not in data and "file_base_64" in data:
            data["file_base64"] = data["file_base_64"]
        return super().to_internal_value(data)

    def validate(self, attrs: Dict[str, Any]):
        file: ContentFile | None = attrs.pop("file", None)
        file_base_64: ContentFile | None = attrs.pop("file_base64", None)

        file = file or file_base_64

        if file and file.name.endswith(".svgxml"):
            raise serializers.ValidationError("Not supported")

        if file:
            return file
        elif not self.instance and self.required:
            raise serializers.ValidationError("No file attached")
        return None



class BaseFileModelSerializer(BaseModelSerializer):
    file_base64 = FileBase64Field(allow_null=True, required=False, write_only=True)
    file_name = serializers.CharField(allow_null=True, required=False, write_only=True)  # deprecated
    file = CustomFileField(allow_null=True, required=False)

    file_required = False

    def to_internal_value(self, data):
        if "file_base64" not in data and "file_base_64" in data:
            data["file_base64"] = data["file_base_64"]
        return super().to_internal_value(data)

    def validate(self, attrs: Dict[str, Any]):
        file: ContentFile | None = attrs.pop("file", None)
        file_base_64: ContentFile | None = attrs.pop("file_base64", None)
        attrs.pop("file_name", None)

        file = file or file_base_64

        if file and file.name.endswith(".svgxml"):
            raise serializers.ValidationError("Not supported")

        if file:
            attrs["file"] = file
        elif not self.instance and self.file_required:
            raise serializers.ValidationError("No file attached")
        return super().validate(attrs)



class ErrorSerializer(serializers.Serializer):
    error = serializers.CharField(read_only=True)
    detail = serializers.CharField(read_only=True)
