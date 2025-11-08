from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("attractions", "0009_auto"),
    ]

    operations = [
        migrations.AlterField(
            model_name="location",
            name="city",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="locations",
                to="attractions.city",
            ),
        ),
        migrations.AlterField(
            model_name="location",
            name="region",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="locations",
                to="attractions.region",
            ),
        ),
    ]
