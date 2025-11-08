from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("attractions", "0012_auto"),
    ]

    operations = [
        migrations.AlterField(
            model_name="location",
            name="address",
            field=models.CharField(
                blank=True, max_length=128, null=True, verbose_name="Address"
            ),
        ),
    ]
