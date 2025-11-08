from logging import getLogger

from django.db.models import Exists, OuterRef, Subquery
from django.utils.decorators import method_decorator
from django_filters import rest_framework as d_filters
from rest_framework import filters
from rest_framework.response import Response
from rest_framework.decorators import action
from djangorestframework_camel_case.parser import CamelCaseJSONParser
from rest_framework.permissions import IsAuthenticated

from common.swagger import get_method_decorators_expand_params
from common.viewsets import BaseModelViewSet
from routes.api.serializers import (
    RouteBrowsSerializer,
    RouteKindSerializer,
    RouteLikeSerializer,
    RouteMapBrowsSerializer,
    RoutePhotoSerializer,
    RouteReviewPhotoSerializer,
    RouteReviewSerializer,
    RouteSerializer,
    RouteStopSerializer,
    RouteTagSerializer,
    TagSerializer, RouteCategorySerializer,
)
from routes.business_logic import shift_order_after_change_stop, shift_order_after_stop
from routes.models import (
    Route,
    RouteBrows,
    RouteKind,
    RouteLike,
    RouteMapBrows,
    RoutePhoto,
    RouteReview,
    RouteReviewPhoto,
    RouteStop,
    RouteTag,
    Tag, RouteCategory,
)

logger = getLogger(__name__)


class RouteFilter(d_filters.FilterSet):
    min_rating = d_filters.NumberFilter(
        field_name="rating", lookup_expr="gte", label="min_rating"
    )
    max_rating = d_filters.NumberFilter(
        field_name="rating", lookup_expr="lte", label="max_rating"
    )
    min_difficulty = d_filters.NumberFilter(
        field_name="difficulty", lookup_expr="gte", label="min_difficulty"
    )
    max_difficulty = d_filters.NumberFilter(
        field_name="difficulty", lookup_expr="lte", label="max_difficulty"
    )

    is_not_excursions_available = d_filters.BooleanFilter(field_name="min_excursion_price", lookup_expr="isnull")

    is_liked = d_filters.BooleanFilter(field_name="is_liked")

    season = d_filters.BaseInFilter(field_name="properties__season", lookup_expr="in")
    is_overnight = d_filters.BaseInFilter(field_name="properties__is_overnight", lookup_expr="in")
    is_family = d_filters.BaseInFilter(field_name="properties__is_family", lookup_expr="in")
    is_on_horseback = d_filters.BaseInFilter(field_name="properties__is_on_horseback", lookup_expr="in")
    is_on_foot = d_filters.BaseInFilter(field_name="properties__is_on_foot", lookup_expr="in")
    is_on_quad_bike = d_filters.BaseInFilter(field_name="properties__is_on_quad_bike", lookup_expr="in")
    is_on_car = d_filters.BaseInFilter(field_name="properties__is_on_car", lookup_expr="in")
    is_swimming = d_filters.BaseInFilter(field_name="properties__is_swimming", lookup_expr="in")

    class Meta:
        model = Route
        fields = {
            "stops__attraction__location__city__city": ["exact"],
            "tags__tag__name": ["exact", "in"],
            "status": ["exact", "in"],
            "id": ["in"],
        }


@method_decorator(**get_method_decorators_expand_params(RouteSerializer))
class RouteViewSet(BaseModelViewSet):
    yasg_parser_classes = [CamelCaseJSONParser]

    queryset = Route.annotated_objects.all()
    serializer_class = RouteSerializer

    filter_backends = (
        filters.SearchFilter,
        d_filters.DjangoFilterBackend,
        filters.OrderingFilter,
    )

    filterset_class = RouteFilter

    search_fields = [
        "name",
        "description",
        "tags__tag__name",
        "stops__attraction__name",
        "stops__attraction__description",
        "stops__attraction__location__city__city",
        "stops__attraction__location__region__region",
    ]

    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset()

        if user.is_anonymous:
            return qs
        
        user_review = RouteReview.objects.filter(created_by=user, route=OuterRef("pk")).order_by("-created_dttm").values("star_rate")
        qs = qs.annotate(user_review_rate=Subquery(user_review[:1]))

        user_browses = RouteBrows.objects.filter(
            route=OuterRef("pk"), user__pk=self.request.user.pk
        )
        user_likes = RouteLike.objects.filter(
            route=OuterRef("pk"), user__pk=self.request.user.pk
        )
        return qs.annotate(is_viewed=Exists(user_browses), is_liked=Exists(user_likes)).select_related("properties")

    @action(
        methods=["POST", "DELETE"],
        detail=True,
        permission_classes=(IsAuthenticated,),
        serializer_class=None,
    )
    def like(self, request, *args, **kwargs):
        route = self.get_object()
        if request.method == "POST":
            RouteLike.objects.get_or_create(
                user=self.request.user,
                route=route,
                defaults=dict(
                    created_by=self.request.user
                ),
            )
            return Response(status=200)
        if request.method == "DELETE":
            RouteLike.objects.filter(
                user=self.request.user,
                route=route
            ).delete()
            return Response(status=204)


@method_decorator(**get_method_decorators_expand_params(RouteStopSerializer))
class RouteStopViewSet(BaseModelViewSet):
    queryset = RouteStop.annotated_objects.all()
    serializer_class = RouteStopSerializer

    filter_backends = (
        filters.SearchFilter,
        d_filters.DjangoFilterBackend,
        filters.OrderingFilter,
    )

    filterset_fields = {
        "route_id": ["exact"]
    }

    def perform_create(self, serializer):
        stop = serializer.save()
        shift_order_after_stop(stop)

    def perform_update(self, serializer):
        if serializer.initial_data.get("order") != serializer.instance.order:
            old_order = serializer.instance.order
            decrease = int(serializer.initial_data.get("order")) > old_order
            stop = serializer.save()
            shift_order_after_change_stop(stop, old_order, decrease)
        else:
            serializer.save()

    def perform_destroy(self, instance):
        shift_order_after_stop(instance, decrease=True)
        super(RouteStopViewSet, self).perform_destroy(instance)


@method_decorator(**get_method_decorators_expand_params(RoutePhotoSerializer))
class RoutePhotoViewSet(BaseModelViewSet):
    queryset = RoutePhoto.objects.all()
    serializer_class = RoutePhotoSerializer


@method_decorator(**get_method_decorators_expand_params(RouteReviewSerializer))
class RouteReviewViewSet(BaseModelViewSet):
    queryset = RouteReview.annotated_objects.all()
    serializer_class = RouteReviewSerializer

    filter_backends = (
        filters.SearchFilter,
        d_filters.DjangoFilterBackend,
        filters.OrderingFilter,
    )

    filterset_fields = {
        "route": ["exact", "in"],
    }


@method_decorator(**get_method_decorators_expand_params(RouteReviewPhotoSerializer))
class RouteReviewPhotoViewSet(BaseModelViewSet):
    queryset = RouteReviewPhoto.objects.all()
    serializer_class = RouteReviewPhotoSerializer


@method_decorator(**get_method_decorators_expand_params(TagSerializer))
class TagViewSet(BaseModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


@method_decorator(**get_method_decorators_expand_params(RouteTagSerializer))
class RouteTagViewSet(BaseModelViewSet):
    queryset = RouteTag.objects.all()
    serializer_class = RouteTagSerializer


@method_decorator(**get_method_decorators_expand_params(RouteKindSerializer))
class RouteKindViewSet(BaseModelViewSet):
    queryset = RouteKind.objects.all()
    serializer_class = RouteKindSerializer


@method_decorator(**get_method_decorators_expand_params(RouteBrowsSerializer))
class RouteBrowsViewSet(BaseModelViewSet):
    queryset = RouteBrows.objects.all()
    serializer_class = RouteBrowsSerializer


@method_decorator(**get_method_decorators_expand_params(RouteMapBrowsSerializer))
class RouteMapBrowsViewSet(BaseModelViewSet):
    queryset = RouteMapBrows.objects.all()
    serializer_class = RouteMapBrowsSerializer


@method_decorator(**get_method_decorators_expand_params(RouteLikeSerializer))
class RouteLikeViewSet(BaseModelViewSet):
    queryset = RouteLike.objects.all()
    serializer_class = RouteLikeSerializer


@method_decorator(**get_method_decorators_expand_params(RouteCategorySerializer))
class RouteCategoryViewSet(BaseModelViewSet):
    queryset = RouteCategory.objects.all()
    serializer_class = RouteCategorySerializer
