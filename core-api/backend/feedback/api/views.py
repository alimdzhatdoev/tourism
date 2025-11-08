from rest_framework.viewsets import ModelViewSet
from common.pagination import PageSizePagination
from rest_framework.permissions import DjangoModelPermissions
from django.utils import timezone
from rest_framework import permissions, serializers
from rest_framework.decorators import action
from rest_framework.response import Response

from feedback.models import Feedback


class EmptySerializer(serializers.Serializer):
    pass


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = (
            "id",
            "name",
            "phone",
            "email",
            "subject",
            "message",
            "seen_at",
            "created_at",
        )
        read_only_fields = (
            "id",
            "seen_at",
            "created_at",
        )


class FeedbackPagination(PageSizePagination):
    def get_paginated_response(self, data):
        response = super().get_paginated_response(data)
        response.data.update(
            {
                "not_seen_count": self.page.paginator.object_list.all()
                .filter(seen_at=None)
                .count(),
            }
        )
        return response

    def get_paginated_response_schema(self, schema):
        response_schema = super().get_paginated_response_schema(schema)
        response_schema["properties"].update(
            {
                "not_seen_count": {
                    "type": "integer",
                    "example": 12,
                    "description": "Количество непрочитанных",
                },
            }
        )
        return response_schema


class FeedbackViewSet(ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    pagination_class = FeedbackPagination
    ordering = ("created_at",)

    @property
    def permission_classes(self):
        if self.action == "create":
            return (permissions.AllowAny,)
        return (DjangoModelPermissions,)

    @action(methods=["POST"], detail=True, serializer_class=EmptySerializer)
    def see(self, request, *args, **kwargs):
        """Отметить прочитанным"""
        instance = self.get_object()
        instance.seen_at = timezone.now()
        instance.save()
        return Response(status=204)
