from attractions.models import AttractionDiscount, Discount
from common.serializers import BaseModelSerializer


class DiscountSerializer(BaseModelSerializer):
    class Meta:
        model = Discount
        expandable_fields = dict(
            attractions=dict(
                serializer="attractions.api.serializers.AttractionDiscountSerializer",
                many=True,
            ),
        )


class AttractionDiscountSerializer(BaseModelSerializer):
    class Meta:
        model = AttractionDiscount
        expandable_fields = dict(
            attraction=dict(
                serializer="attractions.api.serializers.AttractionSerializer",
            ),
            discount=dict(serializer="attractions.api.serializers.DiscountSerializer"),
        )
