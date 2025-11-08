from django.contrib.gis.db.models import PointField
from django.db import models

from common.models import BaseFileModel, BaseModel


class City(BaseModel):
    city = models.CharField("City", max_length=64, db_index=True, unique=True)
    region = models.ForeignKey("Region", null=True, on_delete=models.PROTECT, db_index=True, related_name="cities")

    def __str__(self):
        return f"{self.city}"

    class Meta:
        db_table = "cities"


class Region(BaseModel):
    region = models.CharField("Region", max_length=64, db_index=True, unique=True)

    def __str__(self):
        return f"{self.region}"

    class Meta:
        db_table = "regions"


class Location(BaseModel):
    region = models.ForeignKey(
        Region, on_delete=models.PROTECT, related_name="locations", null=True, blank=True
    )
    city = models.ForeignKey(City, on_delete=models.PROTECT, related_name="locations", null=True, blank=True)

    address = models.CharField("Address", max_length=128, null=True, blank=True)
    formatted = models.CharField("Formatted", max_length=1024, null=True, blank=True)
    point = PointField("Map Point", null=True, blank=True, srid=4326, geography=True)

    def __str__(self):
        return f"{self.region} - {self.city} - {self.address}"


class ContactKind(BaseModel):
    name = models.CharField("Name", max_length=16, unique=True)

    class Meta:
        db_table = "attractions_contact_kinds"


class Contact(BaseFileModel):
    kind = models.ForeignKey(
        ContactKind, on_delete=models.PROTECT, related_name="contacts"
    )
    value = models.CharField("Value", max_length=64)
    file = models.FileField("Logo", null=True, blank=True)


class RegionCity(BaseModel):
    region = models.ForeignKey(Region, on_delete=models.PROTECT, related_name="region_cities")
    city = models.ForeignKey(
        City, on_delete=models.PROTECT, null=True, blank=True, related_name="regions"
    )

    class Meta:
        unique_together = ("city", "region")
