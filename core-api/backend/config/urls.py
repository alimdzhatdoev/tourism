"""
URL Configuration
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

api_urlpatterns = [
    path("", include("authentication.api.urls")),
    path("", include("authentication.api_v2.urls")),
    path("", include("attractions.api.urls")),
    path("", include("routes.api.urls")),
    path("", include("payments.api.urls")),
    path("", include("bookings.api.urls")),
    path("", include("excursions.api.urls")),
    path("", include("systems.api.urls")),
    path("", include("chats.api.urls")),
    path("", include("contents.api.urls")),
    path("", include("feedback.api.urls")),
]


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(api_urlpatterns)),
    path("", include("authentication.urls")),
]

schema_view = get_schema_view(
    openapi.Info(
        title="<Travel App API>",
        default_version="v1",
        description="<Travel App API>",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns += [
    re_path(
        r"^api/swagger(?P<format>\.json|\.yaml)$",
        schema_view.without_ui(cache_timeout=0),
        name="schema-json",
    ),
    re_path(
        r"^api/swagger/$",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    re_path(
        r"^api/redoc/$",
        schema_view.with_ui("redoc", cache_timeout=0),
        name="schema-redoc",
    ),
    re_path(
        r"^docs/$",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-docs",
    ),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
