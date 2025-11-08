import os
from decimal import Decimal

from django.utils.decorators import method_decorator
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from yandex_geocoder import Client, NothingFound
from django_filters import rest_framework as d_filters
from rest_framework import filters

from attractions.api.serializers import GeoCoderSerializer
from attractions.api.serializers.addresses import (
    CitySerializer,
    ContactKindSerializer,
    ContactSerializer,
    LocationSerializer,
    RegionCitySerializer,
    RegionSerializer,
)
from attractions.models import City, Contact, ContactKind, Location, Region, RegionCity
from common.swagger import get_method_decorators_expand_params
from common.viewsets import BaseModelViewSet
from logging import getLogger


logger = getLogger(__name__)


@method_decorator(**get_method_decorators_expand_params(CitySerializer))
class CityViewSet(BaseModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer

    filter_backends = (
        filters.SearchFilter,
        d_filters.DjangoFilterBackend,
    )

    filterset_fields = {
        "city": ["exact"],
        "region_id": ["exact"],
    }

    search_fields = [
        "city",
    ]


@method_decorator(**get_method_decorators_expand_params(RegionSerializer))
class RegionViewSet(BaseModelViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer


@method_decorator(**get_method_decorators_expand_params(LocationSerializer))
class LocationViewSet(BaseModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

    filter_backends = (
        filters.SearchFilter,
        d_filters.DjangoFilterBackend,
    )

    filterset_fields = {
        "created_by": ["exact"],
        "region_id": ["exact"],
        "city_id": ["exact"],
    }

    search_fields = (
        "address",
        "formatted",
        "region__region",
        "city__city",
    )


@method_decorator(**get_method_decorators_expand_params(ContactKindSerializer))
class ContactKindViewSet(BaseModelViewSet):
    queryset = ContactKind.objects.all()
    serializer_class = ContactKindSerializer


@method_decorator(**get_method_decorators_expand_params(ContactSerializer))
class ContactViewSet(BaseModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer


@method_decorator(**get_method_decorators_expand_params(RegionCitySerializer))
class RegionCityViewSet(BaseModelViewSet):
    queryset = RegionCity.objects.all()
    serializer_class = RegionCitySerializer


class MyClient(Client):
    def address(self, longitude: Decimal, latitude: Decimal) -> str:
        """Fetch address for passed coordinates."""
        got = self._request(f"{longitude},{latitude}")
        data = got["GeoObjectCollection"]["featureMember"]

        if not data:
            raise NothingFound(f'Nothing found for "{longitude} {latitude}"')

        return data[0]["GeoObject"]["metaDataProperty"]["GeocoderMetaData"]


class GeoCoderView(APIView):
    serializer_class = GeoCoderSerializer
    client = MyClient(os.getenv("YANDEX_API_KEY"))
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            if serializer.data.get("address"):
                response = self.client.coordinates(
                    serializer.data.get("address"),
                )
                data = {"coordinates": response}

            elif all([serializer.data.get("lat"), serializer.data.get("lon")]):
                response = self.client.address(
                    Decimal(serializer.data.get("lon")),
                    Decimal(serializer.data.get("lat")),
                )
                data = response

            else:
                return Response(status=status.HTTP_400_BAD_REQUEST, data={})
            return Response(status=status.HTTP_200_OK, data=data)

        except Exception:
            logger.exception("Error in geocoder")
            return Response(status=status.HTTP_429_TOO_MANY_REQUESTS, data={})
