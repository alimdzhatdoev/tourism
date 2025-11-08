from typing import Optional

from django.db.models import F

from routes.models import RouteStop


def shift_order_after_change_stop(
    stop: RouteStop,
    old_order: Optional[int] = None,
    decrease: Optional[bool] = False,
) -> None:
    """Shifts the order number of all
    stops after stop changed"""

    if decrease:
        stop.route.stops.filter(order__lte=stop.order, order__gt=old_order).exclude(
            id=stop.id
        ).update(order=F("order") - 1)

    else:
        stop.route.stops.filter(order__gte=stop.order, order__lt=old_order).exclude(
            id=stop.id
        ).update(order=F("order") + 1)


def shift_order_after_stop(stop: RouteStop, decrease: Optional[bool] = False) -> None:
    """Shifts the order number of all stops after an
    incoming stop in forward or reverse direction"""
    if decrease:
        stop.route.stops.filter(order__gte=stop.order).exclude(id=stop.id).update(
            order=F("order") - 1
        )
    else:
        stop.route.stops.filter(order__gte=stop.order).exclude(id=stop.id).update(
            order=F("order") + 1
        )
