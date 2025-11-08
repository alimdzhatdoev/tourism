from rest_framework import serializers

from common.serializers import (
    BaseFileModelSerializer,
    BaseFileSerializer,
    BaseModelSerializer,
    CreatorSerializer,
    CustomFileField,
)

from ..models import Post, PostContent, PostSection, UserGalleryPhoto


class PostSectionSerializer(BaseModelSerializer):
    class Meta:
        model = PostSection
        fields = (
            "id",
            "name",
            "slug",
        )


class PostContentCreateSerializer(BaseModelSerializer):
    post_id = serializers.IntegerField()
    image_data = BaseFileSerializer(
        write_only=True, source="image", required=False, allow_null=True
    )

    class Meta:
        model = PostContent
        fields = (
            "post_id",
            "subtitle",
            "text",
            "image_data",
        )


class PostContentSerializer(BaseModelSerializer):
    image_data = BaseFileSerializer(
        write_only=True, source="image", required=False, allow_null=True
    )
    image = CustomFileField(read_only=True)

    class Meta:
        model = PostContent
        fields = (
            "id",
            "created_by",
            "created_dttm",
            "subtitle",
            "text",
            "image_data",
            "image",
        )
        read_only_fields = (
            "id",
            "created_by",
            "created_dttm",
        )


class PostCreateSerializer(BaseModelSerializer):
    section_id = serializers.IntegerField()
    cover_data = BaseFileSerializer(
        write_only=True, source="cover", required=False, allow_null=True
    )

    class Meta:
        model = Post
        fields = (
            "section_id",
            "title",
            "cover_data",
        )


class PostSerializer(BaseModelSerializer):
    section_id = serializers.IntegerField(write_only=True)
    section = PostSectionSerializer(read_only=True)
    cover_data = BaseFileSerializer(
        write_only=True, source="cover", required=False, allow_null=True
    )
    cover = CustomFileField(read_only=True)
    content = PostContentSerializer(many=True, read_only=True)
    created_by = CreatorSerializer(read_only=True)
    created_dttm = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Post
        fields = (
            "id",
            "created_by",
            "created_dttm",
            "section_id",
            "section",
            "cover_data",
            "cover",
            "published_at",
            "title",
            "content",
        )
        read_only_fields = (
            "id",
            "created_by",
            "created_dttm",
            "section",
            "cover",
            "published_at",
            "content",
        )


class UserGalleryPhotoSerializer(BaseFileModelSerializer):
    created_by = CreatorSerializer(read_only=True)
    region_id = serializers.IntegerField()

    class Meta:
        model = UserGalleryPhoto
        fields = (
            "id",
            "created_by",
            "created_dttm",
            "file",
            "file_base64",
            "description",
            "region_id",
            "published_at",
        )
        read_only_fields = (
            "id",
            "created_by",
            "created_dttm",
            "published_at",
        )
