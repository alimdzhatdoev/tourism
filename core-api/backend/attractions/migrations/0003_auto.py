from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("attractions", "0002_auto"),
    ]

    operations = [
        migrations.AddField(
            model_name="category",
            name="is_season",
            field=models.BooleanField(default=False, verbose_name="Is Season"),
        ),
    ]
