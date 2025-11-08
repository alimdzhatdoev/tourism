from django.db import models
from django.db.models import Q
from django.db.models.functions import Now

from attractions.models import Attraction
from common.models import BaseModel


class NotExpiredDiscountManager(models.Manager):
    def get_queryset(self):
        return (
            super(NotExpiredDiscountManager, self)
            .get_queryset()
            .filter(
                (Q(expiration_dttm__gt=Now()) | Q(expiration_dttm__isnull=True))
                & Q(is_active=True)
            )
        )


class Discount(BaseModel):
    is_percent = models.BooleanField("Is Percent Discount", default=True)

    percent_value = models.PositiveSmallIntegerField(
        "Percent Discount", null=True, blank=True
    )
    currency_value = models.PositiveIntegerField(
        "Currency Discount", null=True, blank=True
    )

    start_dttm = models.DateTimeField("Expiration Date Time", default="2021-01-01")
    expiration_dttm = models.DateTimeField(
        "Expiration Date Time", null=True, blank=True
    )
    is_active = models.BooleanField("Is Active", default=True)

    not_expired_objects = NotExpiredDiscountManager()
    objects = models.Manager()


class AttractionDiscount(BaseModel):
    attraction = models.ForeignKey(
        Attraction, on_delete=models.CASCADE, related_name="discounts"
    )
    discount = models.ForeignKey(
        Discount, on_delete=models.PROTECT, related_name="attractions"
    )

    is_origin = models.BooleanField("Is Origin", default=False)
    promocode = models.CharField("Promocode", max_length=8, null=True, blank=True)
    comment = models.CharField("Comment", max_length=128, null=True, blank=True)

    class Meta:
        db_table = "attractions_attraction_discounts"
