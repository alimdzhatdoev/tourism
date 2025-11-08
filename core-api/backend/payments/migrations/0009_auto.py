from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("payments", "0008_auto"),
    ]

    operations = [
        migrations.RenameField(
            model_name="payment",
            old_name="invoice_id",
            new_name="transaction_id",
        ),
        migrations.RenameField(
            model_name="paymenthistory",
            old_name="invoice_id",
            new_name="transaction_id",
        ),
    ]
