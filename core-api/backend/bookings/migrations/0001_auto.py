from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("excursions", "0001_auto"),
    ]

    operations = [
        migrations.CreateModel(
            name="ExcursionBooking",
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
                ("time", models.TimeField(verbose_name="Time")),
                (
                    "price",
                    models.DecimalField(
                        decimal_places=2, max_digits=10, verbose_name="Price"
                    ),
                ),
                (
                    "visitors",
                    models.PositiveSmallIntegerField(
                        default=1, verbose_name="Visitors"
                    ),
                ),
                (
                    "total_price",
                    models.DecimalField(
                        decimal_places=2, max_digits=10, verbose_name="Price"
                    ),
                ),
                (
                    "comment",
                    models.CharField(
                        blank=True, max_length=256, null=True, verbose_name="Comment"
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
                (
                    "excursion_time",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="bookings",
                        to="excursions.excursiontime",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
    ]
