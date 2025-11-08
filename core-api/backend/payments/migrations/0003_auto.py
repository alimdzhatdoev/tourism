from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("payments", "0002_auto"),
    ]

    operations = [
        migrations.AlterField(
            model_name="payment",
            name="is_active",
            field=models.BooleanField(
                default=True, editable=False, verbose_name="Is Active"
            ),
        ),
        migrations.AlterField(
            model_name="paymenthistory",
            name="is_active",
            field=models.BooleanField(
                default=True, editable=False, verbose_name="Is Active"
            ),
        ),
    ]
