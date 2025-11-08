from bookings.models import ExcursionBooking
from common.serializers import BaseModelSerializer
from rest_framework.exceptions import ValidationError

from excursions.api.validators import is_visitor_number_correct


class ExcursionBookingSerializer(BaseModelSerializer):
    def create(self, validated_data):
        excursion_time = validated_data["excursion_time"]
        validated_data.update(dict(
            date=excursion_time.excursion_date.date,
            time=excursion_time.time,
            price=excursion_time.price,
            total_price=validated_data["visitors"] * excursion_time.price,
        ))
        return super().create(validated_data)

    def update(self, instance, validated_data):
        excursion_time = validated_data["excursion_time"]
        validated_data.update(dict(
            date=excursion_time.excursion_date.date,
            time=excursion_time.time,
            price=excursion_time.price,
            total_price=validated_data["visitors"] * excursion_time.price,
        ))
        return super().update(instance, validated_data)

    def validate(self, attrs):
        if not is_visitor_number_correct(
                self.context.get("request").method,
                attrs["visitors"],
                attrs["excursion_time"],
                self.instance
        ):
            raise ValidationError({"visitors": "Visitor number greater than available places"}, code="value_too_large")
        return super().validate(attrs)

    class Meta:
        model = ExcursionBooking
        read_only_fields = (
            "date",
            "time",
            "price",
            "total_price",
        )
        expandable_fields = dict(
            excursion_time=dict(
                serializer="excursions.api.serializers.ExcursionTimeSerializer", many=False,
            )
        )
