from typing import Any

from django.db import models


def allocate_position(*, position: int, group_queryset: models.QuerySet):
    assert position > 0, "position must pe a positive integer"

    group_queryset.filter(position__gte=position).update(
        position=models.F("position") + 1
    )


def free_allocated_position(
    *, position: int, group_queryset: models.QuerySet
):
    assert position > 0, "position must pe a positive integer"

    group_queryset.filter(position__gt=position).update(
        position=models.F("position") - 1
    )


def move_allocated_position(
    *,
    new_position: int,
    old_position: int,
    group_queryset: models.QuerySet
):
    if old_position is None:
        return allocate_position(position=new_position, group_queryset=group_queryset)

    assert new_position > 0, "new_position must pe a positive integer"

    if new_position == old_position:
        return

    if old_position < new_position:
        group_queryset.filter(
            position__gt=old_position, position__lte=new_position
        ).update(position=models.F("position") - 1)
    elif old_position > new_position:
        group_queryset.filter(
            position__lt=old_position, position__gte=new_position
        ).update(position=models.F("position") + 1)


def get_last_position(
    *, group_queryset: models.QuerySet
) -> int:
    max_position = (
        group_queryset.aggregate(max_position=models.Max("position"))["max_position"]
        or 0
    )
    return max_position
