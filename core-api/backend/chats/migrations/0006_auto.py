from django.db import migrations
import django.db.models.manager


class Migration(migrations.Migration):

    dependencies = [
        ("chats", "0005_auto"),
    ]

    operations = [
        migrations.AlterModelManagers(
            name="chat",
            managers=[
                ("annotated_objects", django.db.models.manager.Manager()),
            ],
        ),
    ]
