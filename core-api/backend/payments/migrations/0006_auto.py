from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("payments", "0005_auto"),
    ]

    operations = [
        migrations.AlterField(
            model_name="payment",
            name="created_by",
            field=models.ForeignKey(
                editable=False,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="created_%(class)ss",
                to=settings.AUTH_USER_MODEL,
                verbose_name="Created By",
            ),
        ),
    ]
