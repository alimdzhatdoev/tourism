from attractions.api.serializers import BannerSerializer
from attractions.models import Banner
from common.viewsets import BaseModelViewSet
from django_filters import rest_framework as d_filters
from rest_framework import filters


class BannerViewSet(BaseModelViewSet):
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer

    filter_backends = (
        filters.SearchFilter,
        d_filters.DjangoFilterBackend,
        filters.OrderingFilter,
    )

    filterset_fields = {
        "is_active": ["exact"],
    }
