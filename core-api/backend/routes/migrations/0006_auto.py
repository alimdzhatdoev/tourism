from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("routes", "0005_auto"),
    ]

    operations = [
        migrations.AddField(
            model_name="route",
            name="total_duration",
            field=models.PositiveIntegerField(
                blank=True, null=True, verbose_name="Minute Duration"
            ),
        ),
        migrations.AddField(
            model_name="routehistory",
            name="total_duration",
            field=models.PositiveIntegerField(
                blank=True, null=True, verbose_name="Minute Duration"
            ),
        ),
    ]
