from django.contrib.auth import get_user_model
from django.db import models

from attractions.models import Attraction
from common.models import BaseModel

User = get_user_model()


class AttractionBrows(BaseModel):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="viewed_attractions"
    )
    attraction = models.ForeignKey(
        Attraction, on_delete=models.CASCADE, related_name="user_views"
    )

    class Meta:
        db_table = "attraction_views"
        unique_together = ("user", "attraction")


class AttractionCall(BaseModel):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="called_attractions"
    )
    attraction = models.ForeignKey(
        Attraction, on_delete=models.CASCADE, related_name="user_calls"
    )
    count = models.PositiveSmallIntegerField("User Calls", default=0)

    class Meta:
        unique_together = ("user", "attraction")
        db_table = "attraction_calls"
