from django.utils.decorators import method_decorator
from django_filters import rest_framework as d_filters
from rest_framework import filters

from attractions.api.serializers import AttractionDiscountSerializer, DiscountSerializer
from attractions.models import AttractionDiscount, Discount
from common.swagger import get_method_decorators_expand_params
from common.viewsets import BaseModelViewSet


@method_decorator(**get_method_decorators_expand_params(DiscountSerializer))
class DiscountViewSet(BaseModelViewSet):
    queryset = Discount.objects.all()
    serializer_class = DiscountSerializer


@method_decorator(**get_method_decorators_expand_params(AttractionDiscountSerializer))
class AttractionDiscountViewSet(BaseModelViewSet):
    queryset = AttractionDiscount.objects.all()
    serializer_class = AttractionDiscountSerializer

    filter_backends = (
        filters.SearchFilter,
        d_filters.DjangoFilterBackend,
        filters.OrderingFilter,
    )

    filterset_fields = {
        "discount__start_dttm": ["gte", "lte"],
        "discount__expiration_dttm": ["gte", "lte"],
    }

    search_fields = (
        "comment",
        "attraction__name",
        "attraction__description",
    )
