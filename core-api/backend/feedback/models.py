from django.db import models


class ContactNotSetError(Exception):
    pass


class Feedback(models.Model):
    name = models.CharField(max_length=64, unique=True)
    phone = models.CharField(max_length=64, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)

    subject = models.TextField(null=True, blank=True)
    message = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    seen_at = models.DateTimeField(null=True, blank=True, editable=False)

    class Meta:
        verbose_name = "Feedback"
        verbose_name_plural = "Feedback"
        db_table = "feedbacks"
        constraints = [
            models.CheckConstraint(
                check=(models.Q(phone__isnull=False) | models.Q(email__isnull=False)),
                name="feedback_phone_or_email",
            )
        ]

    def __str__(self) -> str:
        return self.name

    def save(self, *args, **kwargs):
        if not any((self.phone, self.email)):
            raise ContactNotSetError
        return super().save(*args, **kwargs)
