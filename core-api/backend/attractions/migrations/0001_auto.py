import common.model_fields
import django.contrib.gis.db.models.fields
from django.db import migrations, models
import django.db.models.deletion
import django.db.models.manager
import simple_history.models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Attraction",
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
                (
                    "description",
                    models.TextField(blank=True, null=True, verbose_name="Description"),
                ),
                (
                    "how_to_get",
                    models.CharField(
                        blank=True, max_length=256, null=True, verbose_name="How To Get"
                    ),
                ),
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
                    "audio_guid",
                    models.FileField(
                        blank=True, null=True, upload_to="", verbose_name="Audio Guid"
                    ),
                ),
                (
                    "is_recommended",
                    models.BooleanField(
                        default=False, verbose_name="Is Attraction Recommends"
                    ),
                ),
                (
                    "is_user_added",
                    models.BooleanField(default=False, verbose_name="Is Added by User"),
                ),
                (
                    "ticket_price_from",
                    common.model_fields.AmountField(
                        blank=True,
                        decimal_places=2,
                        max_digits=10,
                        null=True,
                        verbose_name="Ticket Price From",
                    ),
                ),
                (
                    "average_check",
                    models.PositiveIntegerField(
                        blank=True, null=True, verbose_name="Average Check"
                    ),
                ),
                (
                    "cuisine_kind",
                    models.CharField(
                        blank=True,
                        max_length=128,
                        null=True,
                        verbose_name="Cuisine Kind",
                    ),
                ),
                (
                    "min_price",
                    models.PositiveIntegerField(
                        blank=True, null=True, verbose_name="Minimal Price"
                    ),
                ),
                (
                    "room_number",
                    models.PositiveIntegerField(
                        blank=True, null=True, verbose_name="Room Number"
                    ),
                ),
                (
                    "checkin_time",
                    models.TimeField(
                        blank=True, null=True, verbose_name="CheckIn Time"
                    ),
                ),
                (
                    "checkout_time",
                    models.TimeField(
                        blank=True, null=True, verbose_name="CheckOut Time"
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("CREATION", "Creation"),
                            ("ARCHIVE", "Archive"),
                            ("PUBLISHED", "Published"),
                        ],
                        default="CREATION",
                        max_length=9,
                        verbose_name="Status",
                    ),
                ),
                (
                    "published_dttm",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="Published Date Time"
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="AttractionBrows",
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
            ],
            options={
                "db_table": "attraction_views",
            },
        ),
        migrations.CreateModel(
            name="AttractionCall",
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
                    "count",
                    models.PositiveSmallIntegerField(
                        default=0, verbose_name="User Calls"
                    ),
                ),
            ],
            options={
                "db_table": "attraction_calls",
            },
        ),
        migrations.CreateModel(
            name="AttractionCategory",
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
            ],
            options={
                "db_table": "attraction_category_summary",
            },
        ),
        migrations.CreateModel(
            name="AttractionContact",
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
            ],
            options={
                "db_table": "attractions_attraction_contacts",
            },
        ),
        migrations.CreateModel(
            name="AttractionDiscount",
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
                    "is_origin",
                    models.BooleanField(default=False, verbose_name="Is Origin"),
                ),
                (
                    "promocode",
                    models.CharField(
                        blank=True, max_length=8, null=True, verbose_name="Promocode"
                    ),
                ),
                (
                    "comment",
                    models.CharField(
                        blank=True, max_length=128, null=True, verbose_name="Comment"
                    ),
                ),
            ],
            options={
                "db_table": "attractions_attraction_discounts",
            },
        ),
        migrations.CreateModel(
            name="AttractionHistory",
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
                (
                    "description",
                    models.TextField(blank=True, null=True, verbose_name="Description"),
                ),
                (
                    "how_to_get",
                    models.CharField(
                        blank=True, max_length=256, null=True, verbose_name="How To Get"
                    ),
                ),
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
                    "audio_guid",
                    models.TextField(
                        blank=True, max_length=100, null=True, verbose_name="Audio Guid"
                    ),
                ),
                (
                    "is_recommended",
                    models.BooleanField(
                        default=False, verbose_name="Is Attraction Recommends"
                    ),
                ),
                (
                    "is_user_added",
                    models.BooleanField(default=False, verbose_name="Is Added by User"),
                ),
                (
                    "ticket_price_from",
                    common.model_fields.AmountField(
                        blank=True,
                        decimal_places=2,
                        max_digits=10,
                        null=True,
                        verbose_name="Ticket Price From",
                    ),
                ),
                (
                    "average_check",
                    models.PositiveIntegerField(
                        blank=True, null=True, verbose_name="Average Check"
                    ),
                ),
                (
                    "cuisine_kind",
                    models.CharField(
                        blank=True,
                        max_length=128,
                        null=True,
                        verbose_name="Cuisine Kind",
                    ),
                ),
                (
                    "min_price",
                    models.PositiveIntegerField(
                        blank=True, null=True, verbose_name="Minimal Price"
                    ),
                ),
                (
                    "room_number",
                    models.PositiveIntegerField(
                        blank=True, null=True, verbose_name="Room Number"
                    ),
                ),
                (
                    "checkin_time",
                    models.TimeField(
                        blank=True, null=True, verbose_name="CheckIn Time"
                    ),
                ),
                (
                    "checkout_time",
                    models.TimeField(
                        blank=True, null=True, verbose_name="CheckOut Time"
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("CREATION", "Creation"),
                            ("ARCHIVE", "Archive"),
                            ("PUBLISHED", "Published"),
                        ],
                        default="CREATION",
                        max_length=9,
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
            ],
            options={
                "verbose_name": "historical attraction",
                "verbose_name_plural": "historical attractions",
                "ordering": ("-history_date", "-history_id"),
                "get_latest_by": ("history_date", "history_id"),
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.CreateModel(
            name="AttractionPhoto",
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
            ],
            options={
                "db_table": "attraction_photos",
                "ordering": ["order"],
            },
            managers=[
                ("annotated_objects", django.db.models.manager.Manager()),
            ],
        ),
        migrations.CreateModel(
            name="AttractionPromotion",
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
                ("from_dttm", models.DateTimeField(verbose_name="From Dttm")),
                ("till_dttm", models.DateTimeField(verbose_name="Till Dttm")),
            ],
            options={
                "db_table": "attractions_attraction_promotions",
                "ordering": ("-created_dttm",),
            },
        ),
        migrations.CreateModel(
            name="AttractionReview",
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
                        verbose_name="Review Text",
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
            ],
            options={
                "db_table": "attraction_reviews",
            },
            managers=[
                ("annotated_objects", django.db.models.manager.Manager()),
            ],
        ),
        migrations.CreateModel(
            name="AttractionReviewPhoto",
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
            ],
            options={
                "db_table": "attraction_review_photos",
                "ordering": ["order"],
            },
        ),
        migrations.CreateModel(
            name="AttractionSchedule",
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
                    "from_time",
                    models.TimeField(blank=True, null=True, verbose_name="From Time"),
                ),
                (
                    "till_time",
                    models.TimeField(blank=True, null=True, verbose_name="Till Time"),
                ),
                (
                    "week_day",
                    models.PositiveSmallIntegerField(
                        choices=[
                            (1, "Monday"),
                            (2, "Tuesday"),
                            (3, "Wednesday"),
                            (4, "Thursday"),
                            (5, "Friday"),
                            (6, "Saturday"),
                            (7, "Sunday"),
                        ],
                        verbose_name="Week Day",
                    ),
                ),
                (
                    "is_filled",
                    models.BooleanField(default=True, verbose_name="Is Filled"),
                ),
                (
                    "is_24_hour",
                    models.BooleanField(default=False, verbose_name="Is 24 Hour Works"),
                ),
            ],
            options={
                "db_table": "attraction_schedules",
            },
        ),
        migrations.CreateModel(
            name="Category",
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
                    "name",
                    models.CharField(
                        db_index=True, max_length=32, unique=True, verbose_name="Name"
                    ),
                ),
                (
                    "file",
                    models.FileField(
                        blank=True, null=True, upload_to="", verbose_name="Logo"
                    ),
                ),
            ],
            options={
                "db_table": "attraction_categories",
            },
        ),
        migrations.CreateModel(
            name="City",
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
                    "city",
                    models.CharField(
                        db_index=True, max_length=64, unique=True, verbose_name="City"
                    ),
                ),
            ],
            options={
                "db_table": "cities",
            },
        ),
        migrations.CreateModel(
            name="Contact",
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
                ("value", models.CharField(max_length=64, verbose_name="Value")),
                (
                    "file",
                    models.FileField(
                        blank=True, null=True, upload_to="", verbose_name="Logo"
                    ),
                ),
            ],
            options={
                "ordering": ["order"],
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="ContactKind",
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
            ],
            options={
                "db_table": "attractions_contact_kinds",
            },
        ),
        migrations.CreateModel(
            name="Discount",
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
                    "is_percent",
                    models.BooleanField(
                        default=True, verbose_name="Is Percent Discount"
                    ),
                ),
                (
                    "percent_value",
                    models.PositiveSmallIntegerField(
                        blank=True, null=True, verbose_name="Percent Discount"
                    ),
                ),
                (
                    "currency_value",
                    models.PositiveIntegerField(
                        blank=True, null=True, verbose_name="Currency Discount"
                    ),
                ),
                (
                    "start_dttm",
                    models.DateTimeField(
                        default="2021-01-01", verbose_name="Expiration Date Time"
                    ),
                ),
                (
                    "expiration_dttm",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="Expiration Date Time"
                    ),
                ),
                (
                    "is_active",
                    models.BooleanField(default=True, verbose_name="Is Active"),
                ),
            ],
            options={
                "abstract": False,
            },
            managers=[
                ("not_expired_objects", django.db.models.manager.Manager()),
            ],
        ),
        migrations.CreateModel(
            name="Location",
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
                    "address",
                    models.CharField(
                        max_length=128, null=True, unique=True, verbose_name="Address"
                    ),
                ),
                (
                    "point",
                    django.contrib.gis.db.models.fields.PointField(
                        blank=True,
                        geography=True,
                        null=True,
                        srid=4326,
                        verbose_name="Map Point",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="Promotion",
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
                ("name", models.CharField(max_length=32, verbose_name="Name")),
                (
                    "description",
                    models.CharField(
                        blank=True,
                        max_length=512,
                        null=True,
                        verbose_name="Description",
                    ),
                ),
                (
                    "day_limit",
                    models.PositiveSmallIntegerField(verbose_name="Day Limit"),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="Region",
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
                    "region",
                    models.CharField(
                        db_index=True, max_length=64, unique=True, verbose_name="Region"
                    ),
                ),
            ],
            options={
                "db_table": "regions",
            },
        ),
        migrations.CreateModel(
            name="RegionCity",
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
            ],
        ),
        migrations.CreateModel(
            name="UserFavouriteAttraction",
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
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="users_favourite",
                        to="attractions.attraction",
                    ),
                ),
            ],
            options={
                "db_table": "user_favourite_attractions",
            },
        ),
    ]
