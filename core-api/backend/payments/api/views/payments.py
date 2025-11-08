from logging import getLogger

from cloudpayments import errors as cp_errors

from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404
from djangorestframework_camel_case.parser import (
    CamelCaseFormParser,
    CamelCaseMultiPartParser,
)
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from common.swagger import get_method_decorators_expand_params
from common.viewsets import BaseModelViewSet
from common.serializers import ErrorSerializer
from payments.api.serializers.payments import (
    PaymentSerializer,
    PaymentCreationSerializer,
    PaymentResultSerializer,
    CheckPaymentSerializer,
    CheckPaymentResultSerializer
)
from payments.models import Payment
from payments.services import create_payment, finish_payment, get_client_ip

logger = getLogger()


@method_decorator(**get_method_decorators_expand_params(PaymentSerializer))
class PaymentViewSet(BaseModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    def get_serializer_class(self):
        if self.action == "create":
            return PaymentCreationSerializer
        else:
            return super().get_serializer_class()

    @swagger_auto_schema(
        responses={
            status.HTTP_201_CREATED: PaymentResultSerializer,
            status.HTTP_422_UNPROCESSABLE_ENTITY: ErrorSerializer,
            status.HTTP_500_INTERNAL_SERVER_ERROR: ErrorSerializer,
        }
    )
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cryptogram = serializer.validated_data.pop("cryptogram")
        payment: Payment = serializer.save()
        client_ip = get_client_ip(request.META)
        try:
            result = create_payment(payment, cryptogram, client_ip)
            result.update(serializer.data)
            return Response(
                data=result,
                status=status.HTTP_201_CREATED
            )
        except cp_errors.PaymentError as e:
            logger.error(e)
            payment.delete()
            return Response(
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
                data={"error": "Payment Error", "detail": e.cardholder_message},
            )
        except cp_errors.CloudPaymentsError as e:
            logger.error(e)
            payment.delete()
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                data={"error": "Internal Server Error", "detail": str(e)},
            )


class CheckPaymentViewSet(GenericViewSet):
    queryset = Payment.objects.all()
    serializer_class = CheckPaymentSerializer
    yasg_parser_classes = [CamelCaseFormParser, CamelCaseMultiPartParser]

    @swagger_auto_schema(
        responses={
            status.HTTP_200_OK: CheckPaymentResultSerializer,
            status.HTTP_422_UNPROCESSABLE_ENTITY: ErrorSerializer,
            status.HTTP_500_INTERNAL_SERVER_ERROR: ErrorSerializer,
        }
    )
    @action(methods=("POST",), detail=True, url_path="check-payment")
    def check_payment(self, request, pk, *args, **kwargs):
        payment = get_object_or_404(self.queryset, pk=pk)
        serializer = CheckPaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.data
        try:
            result = finish_payment(payment, **data)
            return Response(
                data={"is_success": True, "message": result.status},
                status=status.HTTP_200_OK
            )
        except cp_errors.PaymentError as e:
            logger.error(e)
            return Response(
                data={"error": "Payment Error", "detail": e.cardholder_message},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )
        except cp_errors.CloudPaymentsError as e:
            logger.error(e)
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                data={"error": "Internal Server Error", "detail": str(e)},
            )
