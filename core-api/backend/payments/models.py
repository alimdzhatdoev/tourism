from django.db import models

from common.choices import CultureNameChoices, CurrencyChoices
from common.model_fields import AmountField, get_field_from_choices
from common.models import BaseHistoricalModel


class Payment(BaseHistoricalModel):
    amount = AmountField("Amount")
    currency = get_field_from_choices(
        "Currency", CurrencyChoices, default=CurrencyChoices.RUB
    )

    name = models.CharField("Card Holder Name", max_length=32, null=True, blank=True)
    payment_url = models.CharField(
        "Site Sender URL", max_length=128, null=True, blank=True
    )
    transaction_id = models.CharField("Invoice ID", max_length=32, null=True, blank=True)
    description = models.CharField("Description", max_length=256, null=True, blank=True)
    culture_name = get_field_from_choices(
        "Culture Name", CultureNameChoices, default=CultureNameChoices.RU_RU
    )
    account_id = models.CharField(
        "User Account ID",
        help_text="Uses to make subscription and get token",
        max_length=32,
        null=True,
        blank=True,
    )
    email = models.EmailField(
        "Email", help_text="Email to send receipt", null=True, blank=True
    )

    is_success = models.BooleanField("Is Success", default=False)

    payer = models.JSONField("Payer", null=True, blank=True)
    # JsonData = models.JSONField("JSON Data", help_text="Addition data to create subscription",
    #                             max_length=32, null=True, blank=True)

    class Meta:
        ordering = ("-created_dttm",)
