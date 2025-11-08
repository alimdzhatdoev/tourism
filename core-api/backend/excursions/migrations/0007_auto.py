from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.db.models.manager


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("excursions", "0006_auto"),
    ]

    operations = [
        migrations.AlterModelManagers(
            name="excursion",
            managers=[
                ("annotated_objects", django.db.models.manager.Manager()),
            ],
        ),
        migrations.CreateModel(
            name="ExcursionLike",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created_dttm",
                    models.DateTimeField(auto_now_add=True, verbose_name="Created At"),
                ),
                (
                    "created_by",
                    models.ForeignKey(
                        editable=False,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="created_%(class)ss",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="Created By",
                    ),
                ),
                (
                    "excursion",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="user_likes",
                        to="excursions.excursion",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="favourite_excursions",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "db_table": "excursion_likes",
            },
        ),
    ]
