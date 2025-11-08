from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("routes", "0002_auto"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("attractions", "0003_auto"),
    ]

    operations = [
        migrations.CreateModel(
            name="Banner",
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
                ("title", models.CharField(max_length=32, verbose_name="Title")),
                ("subtitle", models.CharField(max_length=128, verbose_name="Subtitle")),
                (
                    "photo",
                    models.FileField(
                        blank=True, null=True, upload_to="", verbose_name="Photo"
                    ),
                ),
                (
                    "order",
                    models.PositiveSmallIntegerField(default=0, verbose_name="Order"),
                ),
                (
                    "is_active",
                    models.BooleanField(default=True, verbose_name="Is Active"),
                ),
                (
                    "attraction",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="banners",
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
                (
                    "route",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="banners",
                        to="routes.route",
                    ),
                ),
            ],
            options={
                "ordering": ("order",),
            },
        ),
        migrations.AddConstraint(
            model_name="banner",
            constraint=models.CheckConstraint(
                check=models.Q(
                    models.Q(("attraction__isnull", True), ("route__isnull", False)),
                    models.Q(("attraction__isnull", False), ("route__isnull", True)),
                    _connector="OR",
                ),
                name="attractions_banner_attraction_or_route",
            ),
        ),
    ]
