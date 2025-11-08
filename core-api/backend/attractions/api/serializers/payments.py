import datetime

from attractions.models import AttractionPromotion, Promotion
from common.serializers import BaseModelSerializer


class PromotionSerializer(BaseModelSerializer):
    class Meta:
        model = Promotion
        expandable_fields = dict(
            attractions=dict(
                serializer="attractions.api.serializers.AttractionPromotionSerializer",
                many=True,
            ),
        )


class AttractionPromotionSerializer(BaseModelSerializer):
    def create(self, validated_data):
        validated_data["till_dttm"] = validated_data["from_dttm"] + datetime.timedelta(
            days=validated_data.get("promotion").day_limit
        )
        return super().create(validated_data)

    class Meta:
        model = AttractionPromotion
        read_only_fields = ("till_dttm",)
        expandable_fields = dict(
            attraction=dict(
                serializer="attractions.api.serializers.AttractionSerializer",
                many=False,
            ),
            promotion=dict(
                serializer="attractions.api.serializers.PromotionSerializer", many=False
            ),
            payment=dict(
                serializer="payments.api.serializers.PaymentSerializer", many=False
            ),
        )
