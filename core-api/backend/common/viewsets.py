from django.db.models import ProtectedError
from djangorestframework_camel_case.parser import (
    CamelCaseFormParser,
    CamelCaseMultiPartParser,
)
from rest_framework import permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_serializer_extensions.views import SerializerExtensionsAPIViewMixin


def choices_to_dict(choices):
    if choices:
        return [{"id": k, "label": v} for k, v in choices]
    else:
        return None


class ActionBasedPermission(permissions.AllowAny):
    """
    Grant or deny access to a view, based on a mapping in view.action_permissions
    """

    def has_permission(self, request, view):
        for klass, actions in getattr(view, "action_permissions", {}).items():
            if view.action in actions:
                return klass().has_permission(request, view)
        return False


class BaseModelViewSet(SerializerExtensionsAPIViewMixin, viewsets.ModelViewSet):
    yasg_parser_classes = [CamelCaseFormParser, CamelCaseMultiPartParser]

    @action(methods=["GET"], detail=False)
    def choices(self, request):
        """ Get all available values for choice fields """
        qs = self.get_queryset()
        model_fields = qs.model._meta.fields

        field_choices = {
            field.name: choices_to_dict(field.choices)
            for field in model_fields
            if hasattr(field, "choices") and field.choices is not None
        }

        return Response(field_choices)

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True
            serializer = super().get_serializer(*args, **kwargs)
            serializer.is_valid()
        else:
            serializer = super().get_serializer(*args, **kwargs)
        return serializer

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError as e:
            return Response(data={"detail": f"{self.serializer_class.Meta.model._meta.object_name} "
                                            f"cannot be deleted while {e.protected_objects} exists"},
                            status=status.HTTP_400_BAD_REQUEST)
