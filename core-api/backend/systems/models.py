from django.db import models


class ServiceVersion(models.Model):
    service = models.CharField("Service", max_length=32, unique=True)
    version = models.CharField("Version", max_length=16)
