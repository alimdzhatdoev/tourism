from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("routes", "0002_auto"),
        ("attractions", "0006_auto"),
    ]

    operations = [
        migrations.AlterField(
            model_name="banner",
            name="attraction",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="banners",
                to="attractions.attraction",
            ),
        ),
        migrations.AlterField(
            model_name="banner",
            name="route",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="banners",
                to="routes.route",
            ),
        ),
    ]
