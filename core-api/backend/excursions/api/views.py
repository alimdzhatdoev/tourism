from django.db.models import OuterRef, Exists

from common.swagger import get_method_decorators_expand_params
from common.viewsets import BaseModelViewSet
from django_filters import rest_framework as d_filters
from rest_framework import filters

from django.utils.decorators import method_decorator
from excursions.api.serializers import (
    ExcursionSerializer,
    ExcursionTimeSerializer,
    ExcursionDateSerializer,
    ExcursionLikeSerializer
)
from excursions.models import Excursion, ExcursionTime, ExcursionDate, ExcursionLike


@method_decorator(**get_method_decorators_expand_params(ExcursionSerializer))
class ExcursionViewSet(BaseModelViewSet):
    queryset = Excursion.annotated_objects.all()
    serializer_class = ExcursionSerializer

    filter_backends = (
        filters.SearchFilter,
        d_filters.DjangoFilterBackend,
        filters.OrderingFilter,
    )

    filterset_fields = {
    }

    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset()

        if user.is_anonymous:
            return qs
        
        user_likes = ExcursionLike.objects.filter(
            excursion=OuterRef("pk"), user__pk=self.request.user.pk
        )
        return qs.annotate(is_liked=Exists(user_likes))


@method_decorator(**get_method_decorators_expand_params(ExcursionLikeSerializer))
class ExcursionLikeViewSet(BaseModelViewSet):
    queryset = ExcursionLike.objects.all()
    serializer_class = ExcursionLikeSerializer


@method_decorator(**get_method_decorators_expand_params(ExcursionDateSerializer))
class ExcursionDateViewSet(BaseModelViewSet):
    queryset = ExcursionDate.annotated_objects.all()
    serializer_class = ExcursionDateSerializer

    filter_backends = (
        d_filters.DjangoFilterBackend,
        filters.OrderingFilter,
    )

    filterset_fields = {
        "date": ["gte", "lt", "range", "exact"],
        "excursion": ["exact", "in"],
    }


class ExcursionTimeFilter(d_filters.FilterSet):
    is_booking_available = d_filters.BooleanFilter(field_name="is_booking_available", lookup_expr="exact")

    class Meta:
        model = ExcursionTime
        fields = {
            "excursion_date": ["exact", "in"],
            "time": ["gt", "lt"]
        }


@method_decorator(**get_method_decorators_expand_params(ExcursionTimeSerializer))
class ExcursionTimeViewSet(BaseModelViewSet):
    queryset = ExcursionTime.objects.all()
    serializer_class = ExcursionTimeSerializer

    filter_backends = (
        d_filters.DjangoFilterBackend,
    )

    filterset_class = ExcursionTimeFilter
