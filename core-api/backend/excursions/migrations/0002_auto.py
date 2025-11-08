from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("excursions", "0001_auto"),
    ]

    operations = [
        migrations.AddField(
            model_name="excursion",
            name="is_active",
            field=models.BooleanField(default=True, verbose_name="Is Active"),
        ),
    ]
