from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("payments", "0001_auto"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="payment",
            name="ip_address",
        ),
        migrations.RemoveField(
            model_name="paymenthistory",
            name="ip_address",
        ),
        migrations.AlterField(
            model_name="payment",
            name="name",
            field=models.CharField(max_length=32, verbose_name="Card Holder Name"),
        ),
        migrations.AlterField(
            model_name="paymenthistory",
            name="name",
            field=models.CharField(max_length=32, verbose_name="Card Holder Name"),
        ),
    ]
