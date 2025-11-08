import django.db.models.deletion
import simple_history.models
from django.conf import settings
from django.db import migrations, models

import common.model_fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="PaymentHistory",
            fields=[
                (
                    "id",
                    models.IntegerField(
                        auto_created=True, blank=True, db_index=True, verbose_name="ID"
                    ),
                ),
                (
                    "created_dttm",
                    models.DateTimeField(
                        blank=True, editable=False, verbose_name="Created At"
                    ),
                ),
                (
                    "is_active",
                    models.BooleanField(default=True, verbose_name="Is Active"),
                ),
                (
                    "amount",
                    common.model_fields.AmountField(
                        decimal_places=2, max_digits=10, verbose_name="Amount"
                    ),
                ),
                (
                    "currency",
                    models.CharField(
                        choices=[
                            ("RUB", "rub"),
                            ("EUR", "eur"),
                            ("USD", "usd"),
                            ("GBP", "gbp"),
                            ("UAH", "uah"),
                            ("BYR", "byr"),
                            ("BYN", "byn"),
                            ("KZT", "kzt"),
                            ("AZN", "azn"),
                            ("CHF", "chf"),
                            ("CZK", "czk"),
                            ("CAD", "cad"),
                            ("PLN", "pln"),
                            ("SEK", "sek"),
                            ("TRY", "try"),
                            ("CNY", "cny"),
                            ("INR", "inr"),
                            ("BRL", "brl"),
                            ("ZAR", "zar"),
                            ("UZS", "uzs"),
                            ("BGN", "bgn"),
                            ("RON", "ron"),
                            ("AUD", "aud"),
                            ("HKD", "hkd"),
                            ("GEL", "gel"),
                            ("KGS", "kgs"),
                            ("AMD", "amd"),
                            ("AED", "aed"),
                        ],
                        default="RUB",
                        max_length=3,
                        verbose_name="Currency",
                    ),
                ),
                (
                    "ip_address",
                    models.CharField(max_length=16, verbose_name="User IP Address"),
                ),
                (
                    "name",
                    models.CharField(
                        blank=True,
                        max_length=32,
                        null=True,
                        verbose_name="Card Holder Name",
                    ),
                ),
                (
                    "payment_url",
                    models.CharField(
                        blank=True,
                        max_length=128,
                        null=True,
                        verbose_name="Site Sender URL",
                    ),
                ),
                (
                    "invoice_id",
                    models.CharField(
                        blank=True, max_length=32, null=True, verbose_name="Invoice ID"
                    ),
                ),
                (
                    "description",
                    models.CharField(
                        blank=True,
                        max_length=256,
                        null=True,
                        verbose_name="Description",
                    ),
                ),
                (
                    "culture_name",
                    models.CharField(
                        choices=[
                            ("ru-RU", "Ru Ru"),
                            ("en-US", "En Us"),
                            ("kk", "Kk"),
                            ("uk", "Uk"),
                            ("pl", "Pl"),
                            ("vi", "Vi"),
                            ("tr", "Tr"),
                        ],
                        default="ru-RU",
                        max_length=5,
                        verbose_name="Culture Name",
                    ),
                ),
                (
                    "account_id",
                    models.CharField(
                        blank=True,
                        help_text="Uses to make subscription and get token",
                        max_length=32,
                        null=True,
                        verbose_name="User Account ID",
                    ),
                ),
                (
                    "email",
                    models.EmailField(
                        blank=True,
                        help_text="Email to send receipt",
                        max_length=254,
                        null=True,
                        verbose_name="Email",
                    ),
                ),
                (
                    "is_success",
                    models.BooleanField(default=False, verbose_name="Is Success"),
                ),
                ("history_id", models.AutoField(primary_key=True, serialize=False)),
                ("history_date", models.DateTimeField(db_index=True)),
                ("history_change_reason", models.CharField(max_length=100, null=True)),
                (
                    "history_type",
                    models.CharField(
                        choices=[("+", "Created"), ("~", "Changed"), ("-", "Deleted")],
                        max_length=1,
                    ),
                ),
                (
                    "created_by",
                    models.ForeignKey(
                        blank=True,
                        db_constraint=False,
                        editable=False,
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        related_name="+",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="Created By",
                    ),
                ),
                (
                    "history_user",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="+",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "historical payment",
                "verbose_name_plural": "historical payments",
                "ordering": ("-history_date", "-history_id"),
                "get_latest_by": ("history_date", "history_id"),
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.CreateModel(
            name="Payment",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created_dttm",
                    models.DateTimeField(auto_now_add=True, verbose_name="Created At"),
                ),
                (
                    "is_active",
                    models.BooleanField(default=True, verbose_name="Is Active"),
                ),
                (
                    "amount",
                    common.model_fields.AmountField(
                        decimal_places=2, max_digits=10, verbose_name="Amount"
                    ),
                ),
                (
                    "currency",
                    models.CharField(
                        choices=[
                            ("RUB", "rub"),
                            ("EUR", "eur"),
                            ("USD", "usd"),
                            ("GBP", "gbp"),
                            ("UAH", "uah"),
                            ("BYR", "byr"),
                            ("BYN", "byn"),
                            ("KZT", "kzt"),
                            ("AZN", "azn"),
                            ("CHF", "chf"),
                            ("CZK", "czk"),
                            ("CAD", "cad"),
                            ("PLN", "pln"),
                            ("SEK", "sek"),
                            ("TRY", "try"),
                            ("CNY", "cny"),
                            ("INR", "inr"),
                            ("BRL", "brl"),
                            ("ZAR", "zar"),
                            ("UZS", "uzs"),
                            ("BGN", "bgn"),
                            ("RON", "ron"),
                            ("AUD", "aud"),
                            ("HKD", "hkd"),
                            ("GEL", "gel"),
                            ("KGS", "kgs"),
                            ("AMD", "amd"),
                            ("AED", "aed"),
                        ],
                        default="RUB",
                        max_length=3,
                        verbose_name="Currency",
                    ),
                ),
                (
                    "ip_address",
                    models.CharField(max_length=16, verbose_name="User IP Address"),
                ),
                (
                    "name",
                    models.CharField(
                        blank=True,
                        max_length=32,
                        null=True,
                        verbose_name="Card Holder Name",
                    ),
                ),
                (
                    "payment_url",
                    models.CharField(
                        blank=True,
                        max_length=128,
                        null=True,
                        verbose_name="Site Sender URL",
                    ),
                ),
                (
                    "invoice_id",
                    models.CharField(
                        blank=True, max_length=32, null=True, verbose_name="Invoice ID"
                    ),
                ),
                (
                    "description",
                    models.CharField(
                        blank=True,
                        max_length=256,
                        null=True,
                        verbose_name="Description",
                    ),
                ),
                (
                    "culture_name",
                    models.CharField(
                        choices=[
                            ("ru-RU", "Ru Ru"),
                            ("en-US", "En Us"),
                            ("kk", "Kk"),
                            ("uk", "Uk"),
                            ("pl", "Pl"),
                            ("vi", "Vi"),
                            ("tr", "Tr"),
                        ],
                        default="ru-RU",
                        max_length=5,
                        verbose_name="Culture Name",
                    ),
                ),
                (
                    "account_id",
                    models.CharField(
                        blank=True,
                        help_text="Uses to make subscription and get token",
                        max_length=32,
                        null=True,
                        verbose_name="User Account ID",
                    ),
                ),
                (
                    "email",
                    models.EmailField(
                        blank=True,
                        help_text="Email to send receipt",
                        max_length=254,
                        null=True,
                        verbose_name="Email",
                    ),
                ),
                (
                    "is_success",
                    models.BooleanField(default=False, verbose_name="Is Success"),
                ),
                (
                    "created_by",
                    models.ForeignKey(
                        editable=False,
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="created_%(class)ss",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="Created By",
                    ),
                ),
            ],
            options={
                "ordering": ("-created_dttm",),
            },
        ),
    ]
