from django.db.models import Exists, OuterRef
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, authentication, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from attractions.models import Attraction, AttractionStatusChoices
from excursions.models import Excursion, ExcursionDate, ExcursionTime
from routes.models import Route, RouteStatusChoices
from systems.api.serializers import ServiceVersionSerializer, StatsSerializer
from systems.models import ServiceVersion


class ServiceVersionView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, format=None):
        """
        Return a list of all users.
        """
        api_service_version = ServiceVersion.objects.first()
        data = ServiceVersionSerializer(api_service_version).data
        return Response(data)


@swagger_auto_schema(method="GET", responses={200: StatsSerializer})
@api_view(["GET"])
@permission_classes((permissions.AllowAny,))
def stats(request):
    attractions_published = Attraction.objects.filter(status=AttractionStatusChoices.PUBLISHED).count()
    routes_published = Route.objects.filter(status=RouteStatusChoices.PUBLICATION).count()
    dates = ExcursionDate.annotated_objects.filter(min_price__isnull=False, excursion=OuterRef("pk"))
    excursions_available = (
        Excursion.objects.annotate(is_available=Exists(dates)).filter(is_active=True, is_available=True).count()
    )

    popular_filter_kwargs = dict(
        status=AttractionStatusChoices.PUBLISHED,
        review_count__gt=2,
        rating__gte=4
    )

    attractions_popular = Attraction.annotated_objects.filter(**popular_filter_kwargs).count()
    routes_popular = Route.annotated_objects.filter(**popular_filter_kwargs).count()

    return Response({
        "attractions_published": attractions_published,
        "attractions_popular": attractions_popular,
        "routes_published": routes_published,
        "routes_popular": routes_popular,
        "excursions_available": excursions_available,
    })
