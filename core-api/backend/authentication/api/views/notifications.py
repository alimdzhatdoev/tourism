from django.utils.decorators import method_decorator

from authentication.api.serializers import NotificationTokenSerializer
from authentication.models import NotificationToken
from common.swagger import get_method_decorators_expand_params
from common.viewsets import BaseModelViewSet


@method_decorator(**get_method_decorators_expand_params(NotificationTokenSerializer))
class NotificationTokenViewSet(BaseModelViewSet):
    queryset = NotificationToken.objects.all()
    serializer_class = NotificationTokenSerializer
