from rest_framework import serializers

from common.serializers import BaseModelSerializer
from excursions.models import Excursion, ExcursionDate, ExcursionTime, ExcursionLike


class ExcursionSerializer(BaseModelSerializer):
    like_count = serializers.IntegerField(read_only=True)
    is_liked = serializers.BooleanField(read_only=True)

    class Meta:
        model = Excursion
        expandable_fields = dict(
            attraction=dict(serializer="attractions.api.serializers.AttractionSerializer", many=False),
            route=dict(serializer="routes.api.serializers.RouteSerializer", many=False),
            schedule_dates=dict(serializer="excursions.api.serializers.ExcursionDateSerializer", many=True),
            user_likes=dict(serializer="excursions.api.serializers.ExcursionLikeSerializer", many=True),
        )


class ExcursionLikeSerializer(BaseModelSerializer):
    class Meta:
        model = ExcursionLike
        expandable_fields = dict(
            excursion="excursions.api.serializers.ExcursionSerializer",
            user="authentication.api.serializers.UserSerializer",
        )


class ExcursionDateSerializer(BaseModelSerializer):
    min_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = ExcursionDate
        expandable_fields = dict(
            excursion=dict(serializer="excursions.api.serializers.ExcursionSerializer", many=False),
            times=dict(serializer="excursions.api.serializers.ExcursionTimeSerializer", many=True),
        )


class ExcursionTimeSerializer(BaseModelSerializer):
    available_places = serializers.SerializerMethodField(read_only=True)
    is_booking_available = serializers.BooleanField(read_only=True)

    def get_available_places(self, instance):
        return instance.get_available_places()

    class Meta:
        model = ExcursionTime
        expandable_fields = dict(
            excursion_date=dict(serializer="excursions.api.serializers.ExcursionDateSerializer", many=False),
            bookings=dict(serializer="bookings.api.serializers.ExcursionBookingSerializer", many=True)
        )
