from django.db import models
from django.core.exceptions import ValidationError

from common.choices import PaymentMethodChoices
from common.model_fields import get_field_from_choices
from common.models import BaseModel
from excursions.models import ExcursionTime


class ExcursionBooking(BaseModel):
    excursion_time = models.ForeignKey(ExcursionTime, on_delete=models.SET_NULL, related_name="bookings", null=True)

    date = models.DateField("Date")
    time = models.TimeField("Time")
    price = models.DecimalField("Price", max_digits=10, decimal_places=2)
    visitors = models.PositiveSmallIntegerField("Visitors", default=1)
    total_price = models.DecimalField("Price", max_digits=10, decimal_places=2)
    comment = models.CharField("Comment", max_length=256, null=True, blank=True)

    payment_kind = get_field_from_choices("Payment Kind", PaymentMethodChoices, default=PaymentMethodChoices.CASH)
    is_paid = models.BooleanField("Is Paid", default=False)
    invoice_id = models.CharField("InvoiceId", max_length=128, null=True, blank=True)

    def clean(self):
        if self.visitors > self.excursion_time.max_visitors:
            raise ValidationError("Visitors number is greater than possible")

        if self.visitors > self.excursion_time.get_available_places():
            raise ValidationError("Visitors number is greater than possible")
