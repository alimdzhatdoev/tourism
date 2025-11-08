from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("payments", "0004_auto"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="payment",
            name="is_active",
        ),
        migrations.RemoveField(
            model_name="paymenthistory",
            name="is_active",
        ),
    ]
