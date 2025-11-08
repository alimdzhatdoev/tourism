from drf_yasg import inspectors
from drf_yasg.app_settings import swagger_settings
from drf_yasg.openapi import Parameter
from drf_yasg.utils import swagger_auto_schema

from .serializers import ChoiceAsDictField


class ChoiceFieldInspector(inspectors.ChoiceFieldInspector):
    """Field inspector for handling ChoiceAsDictField
    By default, drf_yasg uses choice value to representation to get "enum" in
    swagger schema. This leads to incorrect value choices for ChoiceAsDictField
    representation.
    """

    def field_to_swagger_object(
        self, field, swagger_object_type, use_references, **kwargs
    ):
        swagger_object = super().field_to_swagger_object(
            field, swagger_object_type, use_references, **kwargs
        )
        if isinstance(field, ChoiceAsDictField):
            swagger_object["enum"] = list(field.choices.keys())
        return swagger_object


class BaseAutoSchema(inspectors.SwaggerAutoSchema):
    field_inspectors = [
        ChoiceFieldInspector
    ] + swagger_settings.DEFAULT_FIELD_INSPECTORS

    def get_parser_classes(self):
        """Get the parser classes of this view by calling `get_parsers`.

        :return: parser classes
        :rtype: list[type[rest_framework.parsers.BaseParser]]
        """
        if hasattr(self.view, "yasg_parser_classes"):
            return self.view.yasg_parser_classes

        return super().get_parser_classes()


def get_method_decorators_expand_params(serializer_class) -> dict:
    return dict(
        name="list",
        decorator=swagger_auto_schema(
            manual_parameters=[
                Parameter(
                    "expand",
                    "query",
                    "make FK fields as object",
                    False,
                    type="string",
                    enum=list(serializer_class.Meta.expandable_fields.keys()),
                )
            ]
        ),
    )
