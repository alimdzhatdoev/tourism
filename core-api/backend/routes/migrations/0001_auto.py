from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.db.models.manager
import simple_history.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("attractions", "0001_auto"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Route",
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
                    "name",
                    models.CharField(max_length=64, unique=True, verbose_name="Name"),
                ),
                ("description", models.TextField(verbose_name="Description")),
                (
                    "main_details",
                    models.CharField(
                        blank=True,
                        max_length=128,
                        null=True,
                        verbose_name="Main Details",
                    ),
                ),
                (
                    "difficulty",
                    models.PositiveSmallIntegerField(
                        choices=[
                            (1, "One"),
                            (2, "Two"),
                            (3, "Three"),
                            (4, "Four"),
                            (5, "Five"),
                            (6, "Six"),
                            (7, "Seven"),
                            (8, "Eight"),
                            (9, "Nine"),
                            (10, "Ten"),
                        ],
                        default=1,
                        verbose_name="Difficulty",
                    ),
                ),
                (
                    "is_original",
                    models.BooleanField(
                        default=False, verbose_name="Is Original Route"
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("CREATION", "Creation"),
                            ("VERIFICATION", "Verification"),
                            ("SUSPENSION", "Suspension"),
                            ("PUBLICATION", "Publication"),
                        ],
                        default="CREATION",
                        max_length=12,
                        verbose_name="Status",
                    ),
                ),
                (
                    "published_dttm",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="Published Date Time"
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
            name="RouteReview",
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
                    "text",
                    models.CharField(
                        blank=True,
                        max_length=512,
                        null=True,
                        verbose_name="review Text",
                    ),
                ),
                (
                    "star_rate",
                    models.PositiveSmallIntegerField(
                        choices=[
                            (1, "One"),
                            (2, "Two"),
                            (3, "Three"),
                            (4, "Four"),
                            (5, "Five"),
                        ],
                        verbose_name="Stars",
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
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="reviews",
                        to="routes.route",
                    ),
                ),
            ],
            options={
                "db_table": "route_reviews",
            },
            managers=[
                ("annotated_objects", django.db.models.manager.Manager()),
            ],
        ),
        migrations.CreateModel(
            name="Tag",
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
                    "name",
                    models.CharField(
                        db_index=True, max_length=32, unique=True, verbose_name="Name"
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
            name="RouteTag",
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
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="created_%(class)ss",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="Created By",
                    ),
                ),
                (
                    "route",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="tags",
                        to="routes.route",
                    ),
                ),
                (
                    "tag",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="routes",
                        to="routes.tag",
                    ),
                ),
            ],
            options={
                "db_table": "route_tags",
            },
        ),
        migrations.CreateModel(
            name="RouteStop",
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
                    "order",
                    models.PositiveSmallIntegerField(verbose_name="Order number"),
                ),
                (
                    "attraction",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="routes",
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
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="stops",
                        to="routes.route",
                    ),
                ),
            ],
            options={
                "db_table": "route_stops",
                "ordering": ("order",),
            },
            managers=[
                ("annotated_objects", django.db.models.manager.Manager()),
            ],
        ),
        migrations.CreateModel(
            name="RouteReviewPhoto",
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
                ("file", models.FileField(upload_to="", verbose_name="File")),
                (
                    "date",
                    models.DateField(blank=True, null=True, verbose_name="File Date"),
                ),
                (
                    "comment",
                    models.TextField(blank=True, null=True, verbose_name="Comment"),
                ),
                (
                    "order",
                    models.PositiveIntegerField(
                        blank=True, null=True, verbose_name="Order"
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
                    "review",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="photos",
                        to="routes.routereview",
                    ),
                ),
            ],
            options={
                "db_table": "route_review_photos",
            },
        ),
        migrations.CreateModel(
            name="RoutePhoto",
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
                ("file", models.FileField(upload_to="", verbose_name="File")),
                (
                    "date",
                    models.DateField(blank=True, null=True, verbose_name="File Date"),
                ),
                (
                    "comment",
                    models.TextField(blank=True, null=True, verbose_name="Comment"),
                ),
                (
                    "order",
                    models.PositiveIntegerField(
                        blank=True, null=True, verbose_name="Order"
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
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="photos",
                        to="routes.route",
                    ),
                ),
            ],
            options={
                "db_table": "route_photos",
                "ordering": ["order"],
            },
        ),
        migrations.CreateModel(
            name="RouteMapBrows",
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
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="created_%(class)ss",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="Created By",
                    ),
                ),
                (
                    "route",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="user_map_views",
                        to="routes.route",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="map_viewed_routes",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "db_table": "route_map_views",
            },
        ),
        migrations.CreateModel(
            name="RouteLike",
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
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="created_%(class)ss",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="Created By",
                    ),
                ),
                (
                    "route",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="user_likes",
                        to="routes.route",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="favourite_routes",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "db_table": "route_likes",
            },
        ),
        migrations.CreateModel(
            name="RouteKind",
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
                    "name",
                    models.CharField(max_length=16, unique=True, verbose_name="Name"),
                ),
                (
                    "average_speed",
                    models.PositiveSmallIntegerField(
                        verbose_name="Average Speed (km/h)"
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
                "db_table": "route_kinds",
            },
        ),
        migrations.CreateModel(
            name="RouteHistory",
            fields=[
                (
                    "id",
                    models.IntegerField(
                        auto_created=True, blank=True, db_index=True, verbose_name="ID"
                    ),
                ),
                (
                    "created_dttm",
                    models.DateTimeField(
                        blank=True, editable=False, verbose_name="Created At"
                    ),
                ),
                (
                    "name",
                    models.CharField(db_index=True, max_length=64, verbose_name="Name"),
                ),
                ("description", models.TextField(verbose_name="Description")),
                (
                    "main_details",
                    models.CharField(
                        blank=True,
                        max_length=128,
                        null=True,
                        verbose_name="Main Details",
                    ),
                ),
                (
                    "difficulty",
                    models.PositiveSmallIntegerField(
                        choices=[
                            (1, "One"),
                            (2, "Two"),
                            (3, "Three"),
                            (4, "Four"),
                            (5, "Five"),
                            (6, "Six"),
                            (7, "Seven"),
                            (8, "Eight"),
                            (9, "Nine"),
                            (10, "Ten"),
                        ],
                        default=1,
                        verbose_name="Difficulty",
                    ),
                ),
                (
                    "is_original",
                    models.BooleanField(
                        default=False, verbose_name="Is Original Route"
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("CREATION", "Creation"),
                            ("VERIFICATION", "Verification"),
                            ("SUSPENSION", "Suspension"),
                            ("PUBLICATION", "Publication"),
                        ],
                        default="CREATION",
                        max_length=12,
                        verbose_name="Status",
                    ),
                ),
                (
                    "published_dttm",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="Published Date Time"
                    ),
                ),
                ("history_id", models.AutoField(primary_key=True, serialize=False)),
                ("history_date", models.DateTimeField(db_index=True)),
                ("history_change_reason", models.CharField(max_length=100, null=True)),
                (
                    "history_type",
                    models.CharField(
                        choices=[("+", "Created"), ("~", "Changed"), ("-", "Deleted")],
                        max_length=1,
                    ),
                ),
                (
                    "created_by",
                    models.ForeignKey(
                        blank=True,
                        db_constraint=False,
                        editable=False,
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        related_name="+",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="Created By",
                    ),
                ),
                (
                    "history_user",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="+",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "kind",
                    models.ForeignKey(
                        blank=True,
                        db_constraint=False,
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        related_name="+",
                        to="routes.routekind",
                    ),
                ),
                (
                    "territory",
                    models.ForeignKey(
                        blank=True,
                        db_constraint=False,
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        related_name="+",
                        to="attractions.regioncity",
                    ),
                ),
            ],
            options={
                "verbose_name": "historical route",
                "verbose_name_plural": "historical routes",
                "ordering": ("-history_date", "-history_id"),
                "get_latest_by": ("history_date", "history_id"),
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.CreateModel(
            name="RouteBrows",
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
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="created_%(class)ss",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="Created By",
                    ),
                ),
                (
                    "route",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="user_views",
                        to="routes.route",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="viewed_routes",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "db_table": "route_views",
            },
        ),
        migrations.AddField(
            model_name="route",
            name="kind",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="routes",
                to="routes.routekind",
            ),
        ),
        migrations.AddField(
            model_name="route",
            name="territory",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="routes",
                to="attractions.regioncity",
            ),
        ),
    ]
