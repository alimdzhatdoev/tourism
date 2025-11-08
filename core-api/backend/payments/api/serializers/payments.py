from rest_framework import serializers

from common.serializers import BaseModelSerializer
from payments.models import Payment


class PaymentSerializer(BaseModelSerializer):
    class Meta:
        model = Payment
        expandable_fields = dict(
            promotions=dict(
                serializer="attractions.api.serializers.AttractionPromotionSerializer",
                many=True,
            ),
        )
        read_only_fields = (
            "is_success",
            "payment_url",
            "invoice_id",
        )


class PaymentCreationSerializer(PaymentSerializer):
    cryptogram = serializers.CharField(write_only=True, required=True)

    def create(self, validated_data):
        cryptogram = validated_data.pop("cryptogram", None)
        instance = super().create(validated_data)
        validated_data.update(cryptogram=cryptogram)
        return instance


class PaymentResultSerializer(PaymentSerializer):
    is_success = serializers.BooleanField(label="Is Success", read_only=True)
    _acs_url = serializers.CharField(label="AcsUrl", read_only=True)
    _m_d = serializers.CharField(label="MD", read_only=True)
    _pa_req = serializers.CharField(label="PaReq", read_only=True)


class CheckPaymentSerializer(serializers.Serializer):
    transaction_id = serializers.IntegerField(label="Transaction ID", required=True)
    pa_res = serializers.CharField(label="PaRes", required=True)


class CheckPaymentResultSerializer(serializers.Serializer):
    is_success = serializers.BooleanField(label="Is Success", read_only=True)
    message = serializers.CharField(label="message", read_only=True)