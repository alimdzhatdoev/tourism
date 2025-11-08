from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("bookings", "0002_auto"),
    ]

    operations = [
        migrations.AddField(
            model_name="excursionbooking",
            name="invoice_id",
            field=models.CharField(
                blank=True, max_length=128, null=True, verbose_name="InvoiceId"
            ),
        ),
        migrations.AddField(
            model_name="excursionbooking",
            name="is_paid",
            field=models.BooleanField(default=False, verbose_name="Is Paid"),
        ),
        migrations.AddField(
            model_name="excursionbooking",
            name="payment_kind",
            field=models.CharField(
                choices=[("CASH", "Cash"), ("CARD", "Card")],
                default="CASH",
                max_length=4,
                verbose_name="Payment Kind",
            ),
        ),
    ]
