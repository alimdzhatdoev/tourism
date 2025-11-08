from django.utils.decorators import method_decorator

from attractions.api.serializers.payments import (
    AttractionPromotionSerializer,
    PromotionSerializer,
)
from attractions.models import AttractionPromotion, Promotion
from common.swagger import get_method_decorators_expand_params
from common.viewsets import BaseModelViewSet


@method_decorator(**get_method_decorators_expand_params(PromotionSerializer))
class PromotionViewSet(BaseModelViewSet):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer


@method_decorator(**get_method_decorators_expand_params(AttractionPromotionSerializer))
class AttractionPromotionViewSet(BaseModelViewSet):
    queryset = AttractionPromotion.objects.all()
    serializer_class = AttractionPromotionSerializer
