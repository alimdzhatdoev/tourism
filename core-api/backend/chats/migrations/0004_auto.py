from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("chats", "0003_auto"),
    ]

    operations = [
        migrations.AlterField(
            model_name="chat",
            name="created_by",
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="chat",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
