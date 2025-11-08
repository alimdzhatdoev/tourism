from attractions.models.counters import AttractionBrows, AttractionCall
from common.serializers import BaseModelSerializer


class AttractionBrowsSerializer(BaseModelSerializer):
    class Meta:
        model = AttractionBrows
        expandable_fields = dict(
            attractions="attractions.api.serializers.AttractionScheduleSerializer",
            user="authentication.api.serializers.UserSerializer",
        )


class AttractionCallSerializer(BaseModelSerializer):
    class Meta:
        model = AttractionCall
        expandable_fields = dict(
            attractions="attractions.api.serializers.AttractionScheduleSerializer",
            user="authentication.api.serializers.UserSerializer",
        )
