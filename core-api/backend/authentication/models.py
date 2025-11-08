from django.contrib.auth.models import AbstractUser
from django.contrib.gis.db.models import PointField
from django.db import models

from common.models import BaseModel


class User(AbstractUser):
    """Base User model"""

    # Names
    first_name = models.CharField("First Name", max_length=32, null=True, blank=True)
    middle_name = models.CharField("Middle Name", max_length=32, null=True, blank=True)
    last_name = models.CharField("Last Name", max_length=32, null=True, blank=True)

    # Personal
    birth_date = models.DateField("DOB", null=True, blank=True)
    gender = models.CharField(
        "Gender",
        choices=(("M", "MALE"), ("F", "FEMALE")),
        max_length=1,
        null=True,
        blank=True,
    )
    # Contacts
    email = models.EmailField("Email", unique=True)
    phone = models.CharField("Phone", blank=True, null=True, max_length=32)
    file = models.FileField("Avatar", null=True, blank=True)

    last_location = PointField(
        "Last Location", null=True, blank=True, srid=4326, geography=True
    )

    phone_verify_code = models.PositiveIntegerField(
        "Phone Verification Code", null=True, blank=True
    )
    is_phone_verified = models.BooleanField("Is Phone Verified", default=False)

    is_active = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)

    username = None

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    def get_short_name(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        res = self.get_short_name()
        return res

    class Meta:
        verbose_name = "user"
        verbose_name_plural = "users"
        abstract = False
        db_table = "users"
        ordering = ["first_name", "last_name"]


class NotificationToken(BaseModel):
    token = models.UUIDField("Token")
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="notification_tokens",
        null=True,
        blank=True,
    )

    class Meta:
        db_table = "notification_tokens"


class VerificationCode(models.Model):
    request_id = models.CharField(unique=True, primary_key=True, max_length=32)
    value = models.CharField(max_length=16)
    expires_at = models.DateTimeField()
    retry_at = models.DateTimeField()

    def __str__(self) -> str:
        return f"VerificationCode({self.request_id})"

    class Meta:
        verbose_name = "verification code"
        verbose_name_plural = "verification codes"
        db_table = "verification_codes"
