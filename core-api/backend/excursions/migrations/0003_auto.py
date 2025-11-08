from django.db import migrations
import django.db.models.manager


class Migration(migrations.Migration):

    dependencies = [
        ("excursions", "0002_auto"),
    ]

    operations = [
        migrations.AlterModelManagers(
            name="excursiondate",
            managers=[
                ("annotated_objects", django.db.models.manager.Manager()),
            ],
        ),
    ]
