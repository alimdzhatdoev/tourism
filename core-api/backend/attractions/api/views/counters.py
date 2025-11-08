from django.utils.decorators import method_decorator

from attractions.api.serializers.counters import (
    AttractionBrowsSerializer,
    AttractionCallSerializer,
)
from attractions.models.counters import AttractionBrows, AttractionCall
from common.swagger import get_method_decorators_expand_params
from common.viewsets import BaseModelViewSet


@method_decorator(**get_method_decorators_expand_params(AttractionBrowsSerializer))
class AttractionBrowsViewSet(BaseModelViewSet):
    queryset = AttractionBrows.objects.all()
    serializer_class = AttractionBrowsSerializer


@method_decorator(**get_method_decorators_expand_params(AttractionCallSerializer))
class AttractionCallViewSet(BaseModelViewSet):
    queryset = AttractionCall.objects.all()
    serializer_class = AttractionCallSerializer
