from rest_framework import serializers, exceptions
from django.db.models import Max
from attractions.models import (
    Attraction,
    AttractionCategory,
    AttractionContact,
    AttractionPhoto,
    AttractionReview,
    AttractionReviewPhoto,
    AttractionSchedule,
    Category,
    UserFavouriteAttraction,
    AttractionTransferStop,
    GroupKind,
    Group,
    SubGroup,
)
from authentication.services.admin import is_admin
from common.serializers import BaseFileModelSerializer, BaseModelSerializer, CustomImageThumbnailField
from services import positions


class AttractionSerializer(BaseModelSerializer):
    review_count = serializers.IntegerField(read_only=True)
    is_promoting = serializers.BooleanField(read_only=True)
    user_review_rate = serializers.DecimalField(max_digits=2, decimal_places=1, read_only=True)
    rating = serializers.DecimalField(max_digits=2, decimal_places=1, read_only=True)
    distance = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    distance_to_point = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True, allow_null=True)
    likes = serializers.IntegerField(read_only=True)
    is_liked = serializers.BooleanField(read_only=True)  # deprecated
    views = serializers.IntegerField(read_only=True)
    calls = serializers.IntegerField(read_only=True)
    is_viewed = serializers.BooleanField(read_only=True)
    is_favorite = serializers.BooleanField(read_only=True)
    contained_routes = serializers.IntegerField(read_only=True)
    min_excursion_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    def validate(self, attrs):
        attrs = super().validate(attrs)
        groups: list[Group] = attrs.get("groups")
        if groups:
            request = self.context.get("request")
            user = getattr(request, "user", None)
            if not is_admin(user) and any(group.is_user_can_contribute is False for group in groups):
                raise serializers.ValidationError({"groups": ["Группа закрыта для добавления"]})
        subgroups = attrs.get("subgroups")
        if subgroups:
            groups = attrs.get("groups") or getattr(self.instance, "groups", None)
            for subgroup in subgroups:
                if subgroup.group not in groups:
                    raise serializers.ValidationError({"subgroup": ["Неверная подгруппа"]})
        return attrs

    class Meta:
        model = Attraction
        extra_kwargs = {
            "group": {"required": True},
        }
        expandable_fields = dict(
            groups=dict(
                serializer="attractions.api.serializers.GroupSerializer",
                many=True,
            ),
            subgroups=dict(
                serializer="attractions.api.serializers.SubGroupSerializer",
                many=True,
            ),
            location="attractions.api.serializers.LocationSerializer",
            transfer_stops=dict(
                serializer="attractions.api.serializers.AttractionTransferStopSerializer",
                many=True,
            ),
            photos=dict(
                serializer="attractions.api.serializers.AttractionPhotoSerializer",
                many=True,
            ),
            schedules=dict(
                serializer="attractions.api.serializers.AttractionScheduleSerializer",
                many=True,
            ),
            categories=dict(
                serializer="attractions.api.serializers.AttractionCategorySerializer",
                many=True,
            ),
            reviews=dict(
                serializer="attractions.api.serializers.AttractionReviewSerializer",
                many=True,
            ),
            routes=dict(
                serializer="routes.api.serializers.RouteStopSerializer", many=True
            ),
            contacts=dict(
                serializer="attractions.api.serializers.AttractionContactSerializer",
                many=True,
            ),
            discounts=dict(
                serializer="attractions.api.serializers.AttractionDiscountSerializer",
                many=True,
            ),
            promotions=dict(
                serializer="attractions.api.serializers.AttractionPromotionSerializer",
                many=True,
            ),
            users_favourite=dict(
                serializer="attractions.api.serializers.UserFavouriteAttractionSerializer",
                many=True,
            ),
            user_views=dict(
                serializer="attractions.api.serializers.AttractionBrowsSerializer",
                many=True,
            ),
            user_calls=dict(
                serializer="attractions.api.serializers.AttractionCallSerializer",
                many=True,
            ),
            territory=dict(
                serializer="attractions.api.serializers.RegionCitySerializer",
            ),
            banners=dict(
                serializer="attractions.api.serializers.BannerSerializer",
                many=True,
            ),
            excursions=dict(
                serializer="excursions.api.serializers.ExcursionSerializer",
                many=True,
            ),
        )


class AttractionContactSerializer(BaseModelSerializer):
    class Meta:
        model = AttractionContact
        expandable_fields = dict(
            contact=dict(
                serializer="attractions.api.serializers.ContactSerializer",
            ),
            attraction=dict(
                serializer="attractions.api.serializers.AttractionSerializer",
            ),
        )


class AttractionPhotoSerializer(BaseFileModelSerializer):
    thumbnail = CustomImageThumbnailField(read_only=True, source="file")

    def create(self, validated_data):
        if not validated_data.get("order"):
            max_photo_order = validated_data["attraction"].photos.all().aggregate(max_photo_order=Max("order"))["max_photo_order"]
            validated_data["order"] = 0 if max_photo_order is None else max_photo_order + 1
        return super().create(validated_data)

    class Meta:
        model = AttractionPhoto
        expandable_fields = dict(
            attraction="attractions.api.serializers.AttractionSerializer",
        )


class AttractionScheduleSerializer(BaseModelSerializer):
    class Meta:
        model = AttractionSchedule
        expandable_fields = dict(
            attraction="attractions.api.serializers.AttractionSerializer",
        )


class UserFavouriteAttractionSerializer(BaseModelSerializer):
    class Meta:
        model = UserFavouriteAttraction
        expandable_fields = dict(
            user="authentication.api.serializers.UserSerializer",
            attraction="attractions.api.serializers.AttractionSerializer",
        )


class CategorySerializer(BaseFileModelSerializer):
    class Meta:
        model = Category
        expandable_fields = dict(
            attractions=dict(
                serializer="attractions.api.serializers.AttractionCategorySerializer",
                many=True,
            ),
            routes=dict(
                serializer="routes.api.serializers.RouteCategorySerializer",
                many=True,
            ),
        )


class AttractionCategorySerializer(BaseModelSerializer):
    class Meta:
        model = AttractionCategory
        expandable_fields = dict(
            attraction="attractions.api.serializers.AttractionSerializer",
            category=dict(
                serializer="attractions.api.serializers.CategorySerializer", many=False
            ),
        )


class AttractionReviewSerializer(BaseModelSerializer):
    class Meta:
        model = AttractionReview
        expandable_fields = dict(
            attraction="attractions.api.serializers.AttractionSerializer",
            photos=dict(
                serializer="attractions.api.serializers.AttractionReviewPhotoSerializer",
                many=True,
            ),
        )


class AttractionReviewPhotoSerializer(BaseFileModelSerializer):
    class Meta:
        model = AttractionReviewPhoto
        expandable_fields = dict(
            review="attractions.api.serializers.AttractionReviewSerializer",
        )


class GeoCoderSerializer(serializers.Serializer):
    lon = serializers.FloatField(required=False)
    lat = serializers.FloatField(required=False)
    address = serializers.CharField(required=False)


class GroupKindSerializer(BaseModelSerializer):
    class Meta:
        model = GroupKind
        expandable_fields = dict(
            groups=dict(
                serializer="attractions.api.serializers.GroupSerializer",
                many=True,
            ),
        )

class PositionGroupMixin:
    def get_position_group(self):
        raise NotImplementedError
    
    def insert_in_position_group(self, position):
        assert self.instance.position is None
        positions.allocate_position(position=position, group_queryset=self.get_position_group())
        self.instance.position = position
        self.instance.save(update_fields=("position",))

    def pop_from_position_group(self):
        assert self.instance.position is not None
        position = self.instance.position
        self.instance.position = None
        self.instance.save(update_fields=("position",))
        positions.free_allocated_position(position=position, group_queryset=self.get_position_group())

    def move_in_position_group(self, new_position):
        assert self.instance.position is not None
        positions.move_allocated_position(
            old_position=self.instance.position,
            new_position=new_position,
            group_queryset=self.get_position_group()
        )
        self.instance.position = new_position
        self.instance.save(update_fields=("position",))


class GroupSerializer(PositionGroupMixin, BaseModelSerializer):
    class Meta:
        model = Group
        extra_kwargs = {
            "position": {"min_value": 1}
        }
        expandable_fields = dict(
            attractions=dict(
                serializer="attractions.api.serializers.AttractionSerializer",
                many=True
            ),
            subgroups=dict(
                serializer="attractions.api.serializers.SubGroupSerializer",
                many=True
            ),
            kind="attractions.api.serializers.GroupKindSerializer",
        )

    def get_position_group(self):
        return self.Meta.model.objects.filter(kind_id=self.instance.kind_id)

    def create(self, validated_data):
        position = validated_data.pop("position", 1)
        self.instance = super().create(validated_data)
        if position:
            self.insert_in_position_group(position=position)
        return self.instance
    
    def update(self, instance, validated_data):
        kind = validated_data.get("kind", None)
        position = validated_data.pop("position", None)

        is_position_group_updated = kind.pk != instance.kind_id
        if is_position_group_updated:
            self.pop_from_position_group()

        self.instance = super().update(instance, validated_data)

        if is_position_group_updated:
            self.insert_in_position_group(position=1)
        elif position:
            self.move_in_position_group(new_position=position)
        return self.instance


class SubGroupSerializer(PositionGroupMixin, BaseModelSerializer):
    class Meta:
        model = SubGroup
        extra_kwargs = {
            "position": {"min_value": 1}
        }
        expandable_fields = dict(
            attractions=dict(
                serializer="attractions.api.serializers.AttractionSerializer",
                many=True
            ),
            group="attractions.api.serializers.GroupSerializer",
        )

    def get_position_group(self):
        return self.Meta.model.objects.filter(group_id=self.instance.group_id)

    def create(self, validated_data):
        position = validated_data.pop("position", 1)
        self.instance = super().create(validated_data)
        if position:
            self.insert_in_position_group(position=position)
        return self.instance
    
    def update(self, instance, validated_data):
        group = validated_data.get("group", None)
        position = validated_data.pop("position", None)

        is_position_group_updated = group.pk != instance.group_id
        if is_position_group_updated:
            self.pop_from_position_group()

        self.instance = super().update(instance, validated_data)

        if is_position_group_updated:
            self.insert_in_position_group(position=1)
        elif position:
            self.move_in_position_group(new_position=position)
        return self.instance


class AttractionTransferStopSerializer(BaseModelSerializer):
    class Meta:
        model = AttractionTransferStop
        expandable_fields = dict(
            attraction="attractions.api.serializers.AttractionSerializer",
        )
