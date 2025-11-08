from django.utils import timezone
from django_filters import rest_framework as d_filters
from djangorestframework_camel_case.parser import CamelCaseJSONParser
from rest_framework import filters, permissions, serializers, status
from rest_framework.decorators import action
from rest_framework.response import Response

from common.ordering_filter import NullsAlwaysLastOrderingFilter
from common.viewsets import BaseModelViewSet

from ..models import Post, PostContent, PostSection, UserGalleryPhoto
from .serializers import (
    PostContentCreateSerializer,
    PostContentSerializer,
    PostCreateSerializer,
    PostSectionSerializer,
    PostSerializer,
    UserGalleryPhotoSerializer,
)


class PostSectionViewSet(BaseModelViewSet):
    queryset = PostSection.objects.all()
    serializer_class = PostSectionSerializer


class PostFilter(d_filters.FilterSet):
    section_slug = d_filters.CharFilter(
        field_name="section__slug", lookup_expr="iexact"
    )
    is_published = d_filters.BooleanFilter(method="filter_is_published")

    def filter_is_published(self, queryset, name, value):
        if value is True:
            return queryset.filter(published_at__isnull=False)
        elif value is False:
            return queryset.filter(published_at=None)
        return queryset


class PostViewSet(BaseModelViewSet):
    yasg_parser_classes = [CamelCaseJSONParser]

    queryset = Post.objects.select_related("section").prefetch_related("content")
    serializer_class = PostSerializer

    def get_serializer_class(self):
        if self.action == "create":
            return PostCreateSerializer
        else:
            return super().get_serializer_class()

    filter_backends = (
        d_filters.DjangoFilterBackend,
        NullsAlwaysLastOrderingFilter,
        filters.SearchFilter,
    )

    filterset_class = PostFilter

    ordering_fields = [
        "published_at",
        "created_at",
    ]

    search_fields = [
        "title",
    ]

    staff_permission = permissions.DjangoModelPermissions & permissions.IsAdminUser

    @property
    def permission_classes(self):
        if self.action in ("published", "retrieve"):
            return [permissions.AllowAny]
        return [self.staff_permission]

    def filter_queryset(self, queryset):
        qs = super().filter_queryset(queryset)
        if self.action == "published":
            qs = qs.exclude(published_at=None)
        if self.action == "retrieve" and not self.staff_permission().has_permission(
            self.request, self
        ):
            qs = qs.exclude(published_at=None)
        return qs

    @action(methods=["GET"], detail=False)
    def published(self, request):
        return self.list(request)

    @action(methods=["POST"], detail=True, serializer_class=serializers.Serializer)
    def publish(self, request, *args, **kwargs):
        object = self.get_object()
        object.published_at = timezone.now()
        object.save(update_fields=("published_at",))
        return Response(status=status.HTTP_200_OK)

    @action(methods=["POST"], detail=True, serializer_class=serializers.Serializer)
    def unpublish(self, request, *args, **kwargs):
        object = self.get_object()
        object.published_at = None
        object.save(update_fields=("published_at",))
        return Response(status=status.HTTP_200_OK)


class PostContentViewSet(BaseModelViewSet):
    yasg_parser_classes = [CamelCaseJSONParser]

    queryset = PostContent.objects.select_related("post")
    serializer_class = PostContentSerializer

    def get_serializer_class(self):
        if self.action == "create":
            return PostContentCreateSerializer
        return super().get_serializer_class()

    filter_backends = (
        d_filters.DjangoFilterBackend,
        NullsAlwaysLastOrderingFilter,
        filters.SearchFilter,
    )

    filterset_fields = ["post"]
    search_fields = ["subtitle", "text"]
    ordering_fields = ["created_dttm"]

    staff_permission = permissions.DjangoModelPermissions & permissions.IsAdminUser

    @property
    def permission_classes(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny]
        return [self.staff_permission]


class UserGalleryPhotoFilter(d_filters.FilterSet):
    region_id = d_filters.NumberFilter()
    is_published = d_filters.BooleanFilter(method="filter_is_published")

    def filter_is_published(self, queryset, name, value):
        if value is True:
            return queryset.filter(published_at__isnull=False)
        elif value is False:
            return queryset.filter(published_at=None)
        return queryset


class UserGalleryPhotoViewSet(BaseModelViewSet):
    yasg_parser_classes = [CamelCaseJSONParser]

    queryset = UserGalleryPhoto.objects.select_related("region", "created_by")
    serializer_class = UserGalleryPhotoSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = (d_filters.DjangoFilterBackend,)

    filterset_class = UserGalleryPhotoFilter

    def filter_queryset(self, queryset):
        qs = super().filter_queryset(queryset)
        if self.action == "published":
            qs = qs.exclude(published_at=None)
        if self.action in (
            self.destroy.__name__,
            self.update.__name__,
        ):
            if not self.request.user.is_admin or not self.request.user.is_superuser:
                qs = qs.filter(created_by=self.request.user)
        return qs

    @action(methods=["GET"], detail=False, permission_classes=[permissions.AllowAny])
    def published(self, request):
        return self.list(request)

    @action(
        methods=["POST"],
        detail=True,
        serializer_class=serializers.Serializer,
        permission_classes=[permissions.DjangoModelPermissions],
    )
    def publish(self, request, *args, **kwargs):
        object = self.get_object()
        object.published_at = timezone.now()
        object.save(update_fields=("published_at",))
        return Response(status=status.HTTP_200_OK)

    @action(
        methods=["POST"],
        detail=True,
        serializer_class=serializers.Serializer,
        permission_classes=[permissions.DjangoModelPermissions],
    )
    def unpublish(self, request, *args, **kwargs):
        object = self.get_object()
        object.published_at = None
        object.save(update_fields=("published_at",))
        return Response(status=status.HTTP_200_OK)
