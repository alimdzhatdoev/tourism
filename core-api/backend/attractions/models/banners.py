from django.core.exceptions import ValidationError
from django.db import models

from attractions.models import Attraction
from common.models import BaseModel
from routes.models import Route


class Banner(BaseModel):
    title = models.CharField("Title", max_length=32)
    subtitle = models.CharField("Subtitle", max_length=128)
    file = models.FileField("Photo", null=True, blank=True)

    attraction = models.ForeignKey(Attraction, on_delete=models.CASCADE, related_name="banners", null=True, blank=True)
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name="banners", null=True, blank=True)

    order = models.PositiveSmallIntegerField("Order", default=0)
    is_active = models.BooleanField("Is Active", default=True)

    def clean(self):
        super().clean()
        if not self.attraction and not self.route:  # This will check for None or Empty
            raise ValidationError({'attraction': 'One of attraction or route should have a value.',
                                   'route': 'One of attraction or route should have a value.'})
        elif self.attraction and self.route:  # This will check for None or Empty
            raise ValidationError({'attraction': 'Only One of attraction or route should have a value.',
                                   'route': 'Only One of attraction or route should have a value.'})

    class Meta:
        ordering = ("order",)
