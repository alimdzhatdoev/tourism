from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("attractions", "0009_auto"),
    ]

    operations = [
        migrations.CreateModel(
            name="Excursion",
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
                    "attraction",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="excursions",
                        to="attractions.attraction",
                    ),
                ),
                (
                    "created_by",
                    models.ForeignKey(
                        editable=False,
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="created_%(class)ss",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="Created By",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="ExcursionDate",
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
                ("date", models.DateField(verbose_name="Date")),
                (
                    "created_by",
                    models.ForeignKey(
                        editable=False,
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="created_%(class)ss",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="Created By",
                    ),
                ),
                (
                    "excursion",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="schedule_dates",
                        to="excursions.excursion",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="ExcursionTime",
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
                ("time", models.TimeField(verbose_name="Time")),
                (
                    "price",
                    models.DecimalField(
                        decimal_places=2, max_digits=10, verbose_name="Price"
                    ),
                ),
                (
                    "max_visitors",
                    models.PositiveSmallIntegerField(verbose_name="Max Visitors"),
                ),
                (
                    "created_by",
                    models.ForeignKey(
                        editable=False,
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="created_%(class)ss",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="Created By",
                    ),
                ),
                (
                    "excursion_date",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="times",
                        to="excursions.excursiondate",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
    ]
