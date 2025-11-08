from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("attractions", "0010_auto"),
        ("routes", "0002_auto"),
        ("excursions", "0003_auto"),
    ]

    operations = [
        migrations.AddField(
            model_name="excursion",
            name="route",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="excursions",
                to="routes.route",
            ),
        ),
        migrations.AlterField(
            model_name="excursion",
            name="attraction",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="excursions",
                to="attractions.attraction",
            ),
        ),
    ]
