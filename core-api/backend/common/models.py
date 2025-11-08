from django.conf import settings
from django.db import models
from django.db.models.query import QuerySet
from django.db.models.fields.related_descriptors import ForwardManyToOneDescriptor
from simple_history.models import HistoricalRecords


def get_upload_path(instance, filename):
    return f"{type(instance)()}/{instance.id}/{filename}"


class BaseManager(models.Manager):
    def get_queryset(self) -> QuerySet:
        queryset = super().get_queryset()

        created_by_field = None
        try:
            created_by_field = self.model._meta.get_field("created_by")
        except models.FieldDoesNotExist:
            pass

        if isinstance(created_by_field, models.ForeignKey):
            queryset = queryset.select_related("created_by")

        return queryset


class BaseModel(models.Model):
    created_dttm = models.DateTimeField("Created At", auto_now_add=True)
    created_by = models.ForeignKey(
        to=settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        editable=False,
        verbose_name="Created By",
        related_name="created_%(class)ss",
    )

    objects = BaseManager()

    class Meta:
        abstract = True


class BaseHistoricalModel(BaseModel):
    history = HistoricalRecords(inherit=True, custom_model_name=lambda x: f"{x}History")

    class Meta:
        abstract = True


class BaseNoteModel(BaseModel):
    comment = models.TextField("Note")

    def __str__(self):
        return self.comment

    class Meta:
        abstract = True


class BaseFileModel(BaseModel):
    file = models.FileField("File")
    date = models.DateField("File Date", null=True, blank=True)
    comment = models.TextField("Comment", null=True, blank=True)
    order = models.PositiveIntegerField("Order", null=True, blank=True)

    def __str__(self):
        return self.file.name

    class Meta:
        abstract = True
        ordering = ["order"]


class BaseStatusModel(BaseModel):
    comment = models.TextField("Comment", null=True, blank=True)
    from_dttm = models.DateTimeField("From date-time")
    till_dttm = models.DateTimeField("Till date-time", null=True, blank=True)

    def __str__(self):
        return f"{self.status} ({self.from_dttm} - {self.till_dttm})"

    class Meta:
        abstract = True
        get_latest_by = "-from_dttm"
