from django.contrib.gis.db.models.functions import GeometryDistance
from django.db import models
from django.db.models import Exists, OuterRef, Value, Subquery
from django.utils.decorators import method_decorator
from django_filters import rest_framework as d_filters
from rest_framework import filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.serializers import ValidationError
from django.contrib.gis.geos import Point, Polygon

from attractions.api.serializers.attractions import (
    AttractionCategorySerializer,
    AttractionContactSerializer,
    AttractionPhotoSerializer,
    AttractionReviewPhotoSerializer,
    AttractionReviewSerializer,
    AttractionScheduleSerializer,
    AttractionSerializer,
    CategorySerializer,
    UserFavouriteAttractionSerializer,
    GroupKindSerializer,
    GroupSerializer,
    SubGroupSerializer,
    AttractionTransferStopSerializer,
)
from attractions.models import (
    Attraction,
    AttractionBrows,
    AttractionCategory,
    AttractionContact,
    AttractionPhoto,
    AttractionReview,
    AttractionReviewPhoto,
    AttractionSchedule,
    AttractionTransferStop,
    Category,
    UserFavouriteAttraction,
    GroupKind,
    Group,
    SubGroup,
    AttractionStatusChoices,
)
from common.swagger import get_method_decorators_expand_params
from common.viewsets import BaseModelViewSet


class AttractionFilter(d_filters.FilterSet):
    min_rating = d_filters.NumberFilter(field_name="rating", lookup_expr="gte")
    max_rating = d_filters.NumberFilter(field_name="rating", lookup_expr="lte")

    is_user_added = d_filters.BooleanFilter(field_name="is_user_added")
    is_recommended = d_filters.BooleanFilter(field_name="is_recommended")
    is_favorite = d_filters.BooleanFilter(field_name="is_favorite")
    point = d_filters.CharFilter(method="sort_by_distance", label="Sort by distance to `x,y`")
    in_bbox = d_filters.CharFilter(method="filter_in_bbox", label="Filter by bbox: `xmin,ymin,xmax,ymax`")

    is_not_excursions_available = d_filters.BooleanFilter(field_name="min_excursion_price", lookup_expr="isnull")

    group_id = d_filters.NumberFilter(field_name="groups")
    subgroup_id = d_filters.NumberFilter(field_name="subgroups")

    def sort_by_distance(self, queryset, name, value):
        try:
            x, y = list(map(float, value.split(",")))
        except Exception as e:
            msg = {"point": ["Invalid format. Expected two numbers separated by comma: x,y"]}
            raise ValidationError(msg) from e
        point = Point(x=x, y=y, srid=4326)
        return (
            queryset
            .annotate(
                distance_to_point=GeometryDistance("location__point", point) / 1000
            )
            .order_by("distance_to_point")
        )

    def filter_in_bbox(self, queryset, name, value):
        try:
            x1, y1, x2, y2 = list(map(float, value.split(",")))
        except Exception as e:
            msg = {"in_bbox": ["Invalid format. Expected four numbers separated by comma: xmin,ymin,xmax,ymax"]}
            raise ValidationError(msg) from e
        polygon = Polygon(
            (
                (x1, y1),
                (x1, y2),
                (x2, y2),
                (x2, y1),
                (x1, y1),
            ),
            srid=4326
        )
        return queryset.filter(location__point__contained=polygon)

    class Meta:
        model = Attraction
        fields = {
            "location__city__city": ["exact", "in"],
            "categories__category__name": ["exact", "in"],
            "created_by__id": ["exact"],
            "status": ["exact", "in"],
            "categories__category__is_season": ["exact"],
            "id": ["in"],
            "location__city_id": ["exact"],
            "location__region_id": ["exact"],
        }


@method_decorator(**get_method_decorators_expand_params(AttractionSerializer))
class AttractionViewSet(BaseModelViewSet):
    queryset = Attraction.annotated_objects.all()
    serializer_class = AttractionSerializer

    filter_backends = (
        filters.SearchFilter,
        d_filters.DjangoFilterBackend,
        filters.OrderingFilter,
    )

    filterset_class = AttractionFilter

    search_fields = [
        "name",
        "location__city__city",
        "location__region__region",
    ]

    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset()

        # add user review info
        if not user.is_anonymous:
            user_review = AttractionReview.objects.filter(created_by=user, attraction=OuterRef("pk")).order_by("-created_dttm").values("star_rate")
            user_likes = UserFavouriteAttraction.objects.filter(
                attraction=OuterRef("pk"), user__pk=self.request.user.pk
            )
            qs = qs.annotate(user_review_rate=Subquery(user_review[:1]), is_liked=Exists(user_likes))
        # add distance to each attraction from last user location
        user_coordinates = getattr(user, "last_location", None)
        user_browses = AttractionBrows.objects.filter(
            attraction=OuterRef("pk"), user__pk=self.request.user.pk
        )
        user_favorites = UserFavouriteAttraction.objects.filter(
            attraction=OuterRef("pk"), user__pk=self.request.user.pk,
        )
        if user_coordinates is None:
            distance = Value(None, output_field=models.DecimalField())
        else:
            distance = GeometryDistance("location__point", user_coordinates) / 1000
        return (
            qs
            .annotate(
                distance=distance,
                is_viewed=Exists(user_browses),
                is_favorite=Exists(user_favorites),
            )
        )

    @action(
        methods=["POST", "DELETE"],
        detail=True,
        permission_classes=(IsAuthenticated,),
        serializer_class=None,
    )
    def favorite(self, request, *args, **kwargs):
        attraction = self.get_object()
        if request.method == "POST":
            UserFavouriteAttraction.objects.get_or_create(
                user=self.request.user,
                attraction=attraction,
                defaults=dict(
                    created_by=self.request.user
                ),
            )
            return Response(status=200)
        if request.method == "DELETE":
            UserFavouriteAttraction.objects.filter(
                user=self.request.user,
                attraction=attraction
            ).delete()
            return Response(status=204)


@method_decorator(**get_method_decorators_expand_params(AttractionPhotoSerializer))
class AttractionPhotoViewSet(BaseModelViewSet):
    queryset = AttractionPhoto.objects.all()
    serializer_class = AttractionPhotoSerializer


@method_decorator(**get_method_decorators_expand_params(AttractionScheduleSerializer))
class AttractionScheduleViewSet(BaseModelViewSet):
    queryset = AttractionSchedule.objects.all()
    serializer_class = AttractionScheduleSerializer


@method_decorator(**get_method_decorators_expand_params(AttractionTransferStopSerializer))
class AttractionTransferStopViewSet(BaseModelViewSet):
    queryset = AttractionTransferStop.objects.all()
    serializer_class = AttractionTransferStopSerializer


@method_decorator(
    **get_method_decorators_expand_params(UserFavouriteAttractionSerializer)
)
class UserFavouriteAttractionViewSet(BaseModelViewSet):
    queryset = UserFavouriteAttraction.objects.all()
    serializer_class = UserFavouriteAttractionSerializer


@method_decorator(**get_method_decorators_expand_params(CategorySerializer))
class CategoryViewSet(BaseModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


@method_decorator(**get_method_decorators_expand_params(AttractionCategorySerializer))
class AttractionCategoryViewSet(BaseModelViewSet):
    queryset = AttractionCategory.objects.all()
    serializer_class = AttractionCategorySerializer


@method_decorator(**get_method_decorators_expand_params(GroupKindSerializer))
class GroupKindViewSet(BaseModelViewSet):
    http_method_names = ['get', "options"]

    queryset = GroupKind.objects.all()
    serializer_class = GroupKindSerializer


@method_decorator(**get_method_decorators_expand_params(GroupSerializer))
class GroupViewSet(BaseModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

    filter_backends = (
        filters.OrderingFilter,
        d_filters.DjangoFilterBackend,
    )
    filterset_fields = {
        "kind_id": ["exact"],
    }
    ordering_fields = (
        "created_at",
        "position",
    )


@method_decorator(**get_method_decorators_expand_params(SubGroupSerializer))
class SubGroupViewSet(BaseModelViewSet):
    queryset = SubGroup.objects.all()
    serializer_class = SubGroupSerializer

    filter_backends = (
        filters.OrderingFilter,
        d_filters.DjangoFilterBackend,
    )

    filterset_fields = {
        "group_id": ["exact"],
    }
    ordering_fields = (
        "created_at",
        "group__position",
        "position",
    )


@method_decorator(**get_method_decorators_expand_params(AttractionReviewSerializer))
class AttractionReviewViewSet(BaseModelViewSet):
    queryset = AttractionReview.annotated_objects.all()
    serializer_class = AttractionReviewSerializer

    filter_backends = (
        filters.SearchFilter,
        d_filters.DjangoFilterBackend,
        filters.OrderingFilter,
    )

    filterset_fields = {
        "attraction": ["exact", "in"],
    }

    search_fields = (
        "text",
        "attraction__name",
        "attraction__description",
    )


@method_decorator(
    **get_method_decorators_expand_params(AttractionReviewPhotoSerializer)
)
class AttractionReviewPhotoViewSet(BaseModelViewSet):
    queryset = AttractionReviewPhoto.objects.all()
    serializer_class = AttractionReviewPhotoSerializer


@method_decorator(**get_method_decorators_expand_params(AttractionContactSerializer))
class AttractionContactViewSet(BaseModelViewSet):
    queryset = AttractionContact.objects.all()
    serializer_class = AttractionContactSerializer


@method_decorator(**get_method_decorators_expand_params(GroupSerializer))
class CatalogueViewSet(BaseModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

    filter_backends = (
        filters.OrderingFilter,
        d_filters.DjangoFilterBackend,
    )
    filterset_fields = {
        "kind_id": ["exact"],
    }
    ordering_fields = (
        "created_at",
        "position",
    )

    def get_queryset(self):
        ATTRACTIONS_NUMBER = 10
        SUBGROUPS_NUMBER = 5

        attractions_viewset = AttractionViewSet()
        attractions_viewset.setup(request=self.request)
        attractions: models.QuerySet = (
            attractions_viewset.get_queryset()
            .filter(status=AttractionStatusChoices.PUBLISHED)
        )

        subgroup_attractions = (
            attractions
            .exclude(subgroup_id=None)
            .annotate(
                row_number=models.Window(
                    expression=models.functions.RowNumber(),
                    partition_by=[models.F("subgroup_id")],
                    order_by=[models.F("created_dttm")],
                )
            )
            .filter(row_number__lte=ATTRACTIONS_NUMBER)
        )
        group_attractions = (
            attractions
            .annotate(
                row_number=models.Window(
                    expression=models.functions.RowNumber(),
                    partition_by=[models.F("group_id")],
                    order_by=[models.F("created_dttm")],
                )
            )
            .filter(row_number__lte=ATTRACTIONS_NUMBER)
        )
        subgroups = (
            SubGroup.objects.filter(position__lte=SUBGROUPS_NUMBER)
            .prefetch_related(
                models.Prefetch("attractions", subgroup_attractions),
            )
        )
        return (
            super().get_queryset()
            .prefetch_related(
                models.Prefetch("attractions", group_attractions),
                models.Prefetch("subgroups", subgroups),
            )
        )
