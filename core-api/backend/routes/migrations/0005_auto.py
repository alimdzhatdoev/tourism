from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("routes", "0004_auto"),
    ]

    operations = [
        migrations.AddField(
            model_name="route",
            name="total_distance",
            field=models.DecimalField(
                blank=True,
                decimal_places=3,
                max_digits=10,
                null=True,
                verbose_name="Total distance",
            ),
        ),
        migrations.AddField(
            model_name="routehistory",
            name="total_distance",
            field=models.DecimalField(
                blank=True,
                decimal_places=3,
                max_digits=10,
                null=True,
                verbose_name="Total distance",
            ),
        ),
    ]
