from django.contrib.auth.models import Group
from django.utils.decorators import method_decorator
from rest_framework.decorators import action
from rest_framework.response import Response

from bookings.api.serializers import ExcursionBookingSerializer
from bookings.models import ExcursionBooking
from bookings.services import send_booking_details_message
from common.swagger import get_method_decorators_expand_params
from common.viewsets import BaseModelViewSet
from django_filters import rest_framework as d_filters
from rest_framework import filters, status

from config.settings import client


@method_decorator(**get_method_decorators_expand_params(ExcursionBookingSerializer))
class ExcursionBookingViewSet(BaseModelViewSet):
    queryset = ExcursionBooking.objects.all()
    serializer_class = ExcursionBookingSerializer

    filter_backends = (
        filters.SearchFilter,
        d_filters.DjangoFilterBackend,
        filters.OrderingFilter,
    )

    filterset_fields = {
        "date": ["range", "exact", "gte", "lt"],
        "created_by__first_name": ["exact"],
        "created_by__last_name": ["exact"],
        "created_by_id": ["exact"],
    }

    search_fields = (
        "excursion_time__excursion_date__excursion__attraction__name",
    )

    @action(methods=["POST"], detail=True)
    def check_payment_status(self, request, pk):
        instance = self.queryset.get(pk=pk)
        invoice_id = instance.invoice_id
        if invoice_id:
            response_model = client.find_payment(invoice_id)
            if response_model.status == "Completed" and not instance.is_paid:
                instance.is_paid = True
                instance.save()
            return Response(data={"status": response_model.status})
        return Response({"detail": "InvoiceId field should be filled", "code":"field_not_filled"}, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        booking = serializer.save()
        send_booking_details_message(booking, action="create")

    def get_queryset(self):
        queryset = super().get_queryset()
        customer_group = Group.objects.get(name="Customer")

        if customer_group in self.request.user.groups.all():
            queryset = queryset.filter(created_by_id=self.request.user.id)

        return queryset
