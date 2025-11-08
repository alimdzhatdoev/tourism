from logging import getLogger

from django.db import transaction
from rest_framework import serializers
from django.db.models import Max

from common.serializers import BaseFileModelSerializer, BaseModelSerializer, CustomImageThumbnailField
from routes.models import (
    Route,
    RouteBrows,
    RouteKind,
    RouteLike,
    RouteMapBrows,
    RoutePhoto,
    RouteProperties,
    RouteReview,
    RouteReviewPhoto,
    RouteStop,
    RouteTag,
    Tag, RouteCategory,
)

logger = getLogger(__name__)


class RoutePropertiesSerializer(BaseModelSerializer):
    season = serializers.CharField(required=False, allow_null=True)

    class Meta:
        model = RouteProperties
        fields = (
            "season",
            "rise_degree",
            "is_overnight",
            "is_family",
            "is_on_horseback",
            "is_on_foot",
            "is_on_quad_bike",
            "is_on_car",
            "is_swimming",
        )


class RouteSerializer(BaseModelSerializer):
    view_count = serializers.IntegerField(read_only=True)
    map_view_count = serializers.IntegerField(read_only=True)
    like_count = serializers.IntegerField(read_only=True)
    is_liked = serializers.BooleanField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    user_review_rate = serializers.DecimalField(max_digits=2, decimal_places=1, read_only=True)
    rating = serializers.DecimalField(max_digits=2, decimal_places=1, read_only=True)
    length = serializers.DecimalField(max_digits=10, decimal_places=3, read_only=True)
    time = serializers.IntegerField(read_only=True, default=0)
    min_excursion_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    properties = RoutePropertiesSerializer(allow_null=True)
    custom_properties = serializers.JSONField(allow_null=True)

    @transaction.atomic
    def create(self, validated_data):
        properties = validated_data.pop("properties", None)
        instance = super().create(validated_data)
        if properties:
            RouteProperties.objects.create(route=instance, **properties)
        return instance
    
    @transaction.atomic
    def update(self, instance, validated_data):
        properties = validated_data.pop("properties", None)
        instance = super().update(instance, validated_data)
        if properties:
            RouteProperties.objects.update_or_create(route=instance, defaults=properties)
        return instance

    class Meta:
        model = Route
        expandable_fields = dict(
            stops=dict(
                serializer="routes.api.serializers.RouteStopSerializer", many=True
            ),
            tags=dict(
                serializer="routes.api.serializers.RouteTagSerializer", many=True
            ),
            kind=dict(serializer="routes.api.serializers.RouteKindSerializer"),
            reviews=dict(
                serializer="routes.api.serializers.RouteReviewSerializer", many=True
            ),
            photos=dict(
                serializer="routes.api.serializers.RoutePhotoSerializer", many=True
            ),
            user_views=dict(
                serializer="routes.api.serializers.RouteBrowsSerializer", many=True
            ),
            user_map_views=dict(
                serializer="routes.api.serializers.RouteMapBrowsSerializer", many=True
            ),
            territory=dict(
                serializer="attractions.api.serializers.RegionCitySerializer",
            ),
            user_likes=dict(
                serializer="routes.api.serializers.RouteLikeSerializer", many=True,
            ),
            categories=dict(
                serializer="routes.api.serializers.RouteCategorySerializer", many=True
            ),
            banners=dict(
                serializer="attractions.api.serializers.BannerSerializer", many=True
            ),
            excursions=dict(
                serializer="excursions.api.serializers.ExcursionSerializer", many=True
            ),
        )


class RouteStopSerializer(BaseModelSerializer):
    distance_to_next = serializers.DecimalField(
        max_digits=10, decimal_places=3, read_only=True
    )

    class Meta:
        model = RouteStop
        expandable_fields = dict(
            attraction="attractions.api.serializers.AttractionSerializer",
            route="routes.api.serializers.RouteSerializer",
        )


class RoutePhotoSerializer(BaseFileModelSerializer):
    thumbnail = CustomImageThumbnailField(read_only=True, source="file")
    
    def create(self, validated_data):
        if not validated_data.get("order"):
            max_photo_order = validated_data["route"].photos.all().aggregate(max_photo_order=Max("order"))["max_photo_order"]
            validated_data["order"] = 0 if max_photo_order is None else max_photo_order + 1
        return super().create(validated_data)

    class Meta:
        model = RoutePhoto
        expandable_fields = dict(
            route="routes.api.serializers.RouteSerializer",
        )


class RouteReviewSerializer(BaseModelSerializer):
    class Meta:
        model = RouteReview
        expandable_fields = dict(
            route="routes.api.serializers.RouteSerializer",
            photos=dict(
                serializer="routes.api.serializers.RouteReviewPhotoSerializer",
                many=True,
            ),
        )


class RouteReviewPhotoSerializer(BaseFileModelSerializer):
    class Meta:
        model = RouteReviewPhoto
        expandable_fields = dict(
            review="routes.api.serializers.RouteReviewSerializer",
        )


class TagSerializer(BaseModelSerializer):
    class Meta:
        model = Tag
        expandable_fields = dict(
            routes=dict(serializer="routes.api.serializers.RouteSerializer", many=True),
        )


class RouteTagSerializer(BaseModelSerializer):
    class Meta:
        model = RouteTag
        expandable_fields = dict(
            route="attractions.api.serializers.AttractionSerializer",
            tag="routes.api.serializers.TagSerializer",
        )


class RouteKindSerializer(BaseModelSerializer):
    class Meta:
        model = RouteKind
        expandable_fields = dict(
            routes=dict(
                serializer="attractions.api.serializers.AttractionSerializer", many=True
            ),
        )


class RouteBrowsSerializer(BaseModelSerializer):
    class Meta:
        model = RouteBrows
        expandable_fields = dict(
            route=dict(
                serializer="attractions.api.serializers.AttractionSerializer",
                many=False,
            ),
            user="authentication.api.serializers.UserSerializer",
        )


class RouteMapBrowsSerializer(BaseModelSerializer):
    class Meta:
        model = RouteMapBrows
        expandable_fields = dict(
            route=dict(
                serializer="attractions.api.serializers.AttractionSerializer",
                many=False,
            ),
            user="authentication.api.serializers.UserSerializer",
        )


class RouteLikeSerializer(BaseModelSerializer):
    class Meta:
        model = RouteLike
        expandable_fields = dict(
            route=dict(
                serializer="attractions.api.serializers.AttractionSerializer",
                many=False,
            ),
            user="authentication.api.serializers.UserSerializer",
        )


class RouteCategorySerializer(BaseModelSerializer):
    class Meta:
        model = RouteCategory
        expandable_fields = dict(
            category=dict(
                serializer="attractions.api.serializers.CategorySerializer",
                many=False,
            ),
            route="routes.api.serializers.RouteSerializer",
        )
