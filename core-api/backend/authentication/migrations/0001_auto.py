from django.conf import settings
import django.contrib.auth.models
import django.contrib.auth.validators
import django.contrib.gis.db.models.fields
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.CreateModel(
            name="User",
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
                ("password", models.CharField(max_length=128, verbose_name="password")),
                (
                    "last_login",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="last login"
                    ),
                ),
                (
                    "is_superuser",
                    models.BooleanField(
                        default=False,
                        help_text="Designates that this user has all permissions without explicitly assigning them.",
                        verbose_name="superuser status",
                    ),
                ),
                (
                    "username",
                    models.CharField(
                        error_messages={
                            "unique": "A user with that username already exists."
                        },
                        help_text="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.",
                        max_length=150,
                        unique=True,
                        validators=[
                            django.contrib.auth.validators.UnicodeUsernameValidator()
                        ],
                        verbose_name="username",
                    ),
                ),
                (
                    "is_staff",
                    models.BooleanField(
                        default=False,
                        help_text="Designates whether the user can log into this admin site.",
                        verbose_name="staff status",
                    ),
                ),
                (
                    "date_joined",
                    models.DateTimeField(
                        default=django.utils.timezone.now, verbose_name="date joined"
                    ),
                ),
                (
                    "first_name",
                    models.CharField(max_length=32, verbose_name="First Name"),
                ),
                (
                    "middle_name",
                    models.CharField(
                        blank=True, max_length=32, null=True, verbose_name="Middle Name"
                    ),
                ),
                (
                    "last_name",
                    models.CharField(max_length=32, verbose_name="Last Name"),
                ),
                (
                    "birth_date",
                    models.DateField(blank=True, null=True, verbose_name="DOB"),
                ),
                (
                    "gender",
                    models.CharField(
                        blank=True,
                        choices=[("M", "MALE"), ("F", "FEMALE")],
                        max_length=1,
                        null=True,
                        verbose_name="Gender",
                    ),
                ),
                (
                    "email",
                    models.EmailField(
                        max_length=254, unique=True, verbose_name="Email"
                    ),
                ),
                (
                    "phone",
                    models.CharField(
                        blank=True, max_length=32, null=True, verbose_name="Phone"
                    ),
                ),
                (
                    "file",
                    models.FileField(
                        blank=True, null=True, upload_to="", verbose_name="Avatar"
                    ),
                ),
                (
                    "last_location",
                    django.contrib.gis.db.models.fields.PointField(
                        blank=True,
                        geography=True,
                        null=True,
                        srid=4326,
                        verbose_name="Last Location",
                    ),
                ),
                (
                    "phone_verify_code",
                    models.PositiveIntegerField(
                        blank=True, null=True, verbose_name="Phone Verification Code"
                    ),
                ),
                (
                    "is_phone_verified",
                    models.BooleanField(
                        default=False, verbose_name="Is Phone Verified"
                    ),
                ),
                ("is_active", models.BooleanField(default=False)),
                (
                    "groups",
                    models.ManyToManyField(
                        blank=True,
                        help_text="The groups this user belongs to. A user will get all permissions granted to each of their groups.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.group",
                        verbose_name="groups",
                    ),
                ),
                (
                    "user_permissions",
                    models.ManyToManyField(
                        blank=True,
                        help_text="Specific permissions for this user.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.permission",
                        verbose_name="user permissions",
                    ),
                ),
            ],
            options={
                "verbose_name": "user",
                "verbose_name_plural": "users",
                "db_table": "users",
                "ordering": ["first_name", "last_name"],
                "abstract": False,
            },
            managers=[
                ("objects", django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name="NotificationToken",
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
                ("token", models.UUIDField(verbose_name="Token")),
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
                    "user",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="notification_tokens",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "db_table": "notification_tokens",
            },
        ),
    ]
