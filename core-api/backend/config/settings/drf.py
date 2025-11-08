from datetime import timedelta

from .base import DEBUG, INSTALLED_APPS

INSTALLED_APPS += ("rest_framework", "rest_framework_gis")


REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": (
        "djangorestframework_camel_case.render.CamelCaseJSONRenderer",
        "djangorestframework_camel_case.render.CamelCaseBrowsableAPIRenderer",
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",
    ),
    "DEFAULT_PARSER_CLASSES": (
        "djangorestframework_camel_case.parser.CamelCaseFormParser",
        "djangorestframework_camel_case.parser.CamelCaseMultiPartParser",
        "djangorestframework_camel_case.parser.CamelCaseJSONParser",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly",
    ),
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ),
    "DEFAULT_FILTER_BACKENDS": ("django_filters.rest_framework.DjangoFilterBackend",),
    "DEFAULT_PAGINATION_CLASS": "common.pagination.PageSizePagination",
    "PAGE_SIZE": 10,
    "TEST_REQUEST_DEFAULT_FORMAT": "json",
    "COERCE_DECIMAL_TO_STRING": False,
}

if DEBUG:
    REST_FRAMEWORK["DEFAULT_AUTHENTICATION_CLASSES"] += (  # type: ignore
        "rest_framework.authentication.BasicAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    )


# SERIALIZER EXTENSION
REST_FRAMEWORK["SERIALIZER_EXTENSIONS"] = {
    "MAX_EXPAND_DEPTH": 5,
    # "AUTO_OPTIMIZE": True,
}


SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=10),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=90),
    "ROTATE_REFRESH_TOKENS": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# DRF-YASG SETTINGS
SWAGGER_SETTINGS = {"DEFAULT_AUTO_SCHEMA_CLASS": "common.swagger.BaseAutoSchema"}
if not DEBUG:
    SWAGGER_SETTINGS.update(
        {
            "USE_SESSION_AUTH": False,
            "SECURITY_DEFINITIONS": {
                "Bearer": {
                    "type": "apiKey",
                    "name": "Authorization",
                    "description": "JWT authentication. Put 'Bearer <YOUR_TOKEN>' in the field bellow. NOTE: You need to "
                    "manually add 'Bearer' prefix in front of your token since current version does not support "
                    "automated Bearer login",
                    "in": "header",
                }
            },
        }
    )
