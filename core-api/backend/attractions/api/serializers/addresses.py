from django.contrib.gis.geos import Point
from rest_framework import serializers

from attractions.models import City, Contact, ContactKind, Location, Region, RegionCity
from common.serializers import BaseFileModelSerializer, BaseModelSerializer


class CitySerializer(BaseModelSerializer):
    region = serializers.PrimaryKeyRelatedField(queryset=Region.objects.all(), required=True)
    class Meta:
        model = City
        expandable_fields = dict(
            locations=dict(
                serializer="attractions.api.serializers.LocationSerializer", many=True
            ),
            region=dict(
                serializer="attractions.api.serializers.RegionSerializer"
            ),
        )


class RegionSerializer(BaseModelSerializer):
    class Meta:
        model = Region
        expandable_fields = dict(
            locations=dict(
                serializer="attractions.api.serializers.LocationSerializer", many=True
            ),
            cities=dict(
                serializer="attractions.api.serializers.CitySerializer", many=True
            ),
        )


class LocationSerializer(BaseModelSerializer):
    lat = serializers.FloatField(write_only=True, required=True)
    lon = serializers.FloatField(write_only=True, required=True)

    def validate(self, attrs):
        attrs = super().validate(attrs)
        if "city" in attrs:
            attrs["region_id"] = attrs["city"].region_id
        if any(("lat" in attrs, "lon" in attrs)):
            lat = attrs.pop("lat", None) or self.instance.point.y
            lon = attrs.pop("lon", None) or self.instance.point.x
            attrs["point"] = Point(x=lon, y=lat, srid=4326)
        return attrs

    class Meta:
        model = Location
        expandable_fields = dict(
            attractions=dict(
                serializer="attractions.api.serializers.AttractionSerializer", many=True
            ),
            city="attractions.api.serializers.CitySerializer",
            region="attractions.api.serializers.RegionSerializer",
        )
        extra_kwargs = {
            "address": {"required": True},
            "city": {"required": True},
            "region": {"read_only": True},
            "point": {"read_only": True},
        }


class ContactKindSerializer(BaseModelSerializer):
    class Meta:
        model = ContactKind
        expandable_fields = dict(
            contacts=dict(
                serializer="attractions.api.serializers.ContactSerializer", many=True
            ),
        )


class ContactSerializer(BaseFileModelSerializer):
    file_required = False

    class Meta:
        model = Contact
        expandable_fields = dict(
            attractions=dict(
                serializer="attractions.api.serializers.AttractionContactSerializer",
                many=True,
            ),
            kind="attractions.api.serializers.ContactKindSerializer",
        )


class RegionCitySerializer(BaseModelSerializer):
    class Meta:
        model = RegionCity
        expandable_fields = dict(
            region=dict(
                serializer="attractions.api.serializers.RegionSerializer",
            ),
            city="attractions.api.serializers.CitySerializer",
            attractions=dict(
                serializer="attractions.api.serializers.AttractionSerializer",
                many=True,
            ),
            routes=dict(
                serializer="routes.api.serializers.RouteSerializer",
                many=True,
            ),
        )
