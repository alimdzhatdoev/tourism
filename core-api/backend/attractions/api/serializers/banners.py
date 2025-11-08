from attractions.models.banners import Banner
from common.serializers import BaseFileModelSerializer


class BannerSerializer(BaseFileModelSerializer):
    class Meta:
        model = Banner
        expandable_fields = dict(
            attraction="attractions.api.serializers.AttractionSerializer",
            route="routes.api.serializers.RouteSerializer",
        )
