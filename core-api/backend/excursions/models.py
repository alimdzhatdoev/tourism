import datetime

from django.apps import apps
from django.conf import settings
from django.db import models
from django.db.models import Min, OuterRef, Subquery, Func, F

from attractions.models import Attraction
from common.models import BaseModel
from routes.models import Route


class AnnotatedExcursionManager(models.Manager):
    def get_queryset(self):
        likes = (
            apps.get_model("excursions", "ExcursionLike")
            .objects.filter(excursion=OuterRef("pk"))
            .annotate(number=Func(F("id"), function="Count"))
            .values("number")
        )
        queryset = (
            super()
            .get_queryset()
            .annotate(
                like_count=Subquery(likes),
            )
        )
        return queryset


class Excursion(BaseModel):
    attraction = models.ForeignKey(Attraction, on_delete=models.PROTECT, related_name="excursions", null=True, blank=True)
    route = models.ForeignKey(Route, on_delete=models.PROTECT, related_name="excursions", null=True, blank=True)
    is_active = models.BooleanField("Is Active", default=True)

    annotated_objects = AnnotatedExcursionManager()
    objects = models.Manager()

    def __repr__(self):
        return f"Экскурсия [{self.attraction} | {self.route}] <id: {self.pk}>"

    def __str__(self):
        return f"Экскурсия [{self.attraction} | {self.route}] <id: {self.pk}>"


class ExcursionLike(BaseModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="favourite_excursions"
    )
    excursion = models.ForeignKey(
        Excursion, on_delete=models.CASCADE, related_name="user_likes"
    )

    class Meta:
        db_table = "excursion_likes"


class AnnotatedExcursionDateManager(models.Manager):
    def get_queryset(self):

        excursion_time = (
            apps.get_model("excursions", "ExcursionTime")
            .annotated_objects.filter(excursion_date=OuterRef("pk"), is_booking_available=True)
            .annotate(min_price=Min("price"))
            .values("min_price")
        )

        queryset = (
            super()
            .get_queryset()
            .annotate(
                min_price=Subquery(excursion_time[:1]),
            )
        )
        return queryset.filter(date__gte=datetime.datetime.now())


class PerformanceExcursionDateManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(date__gte=datetime.datetime.now())


class ExcursionDate(BaseModel):
    excursion = models.ForeignKey(Excursion, on_delete=models.CASCADE, related_name="schedule_dates")
    date = models.DateField("Date")

    annotated_objects = AnnotatedExcursionDateManager()
    objects = models.Manager()
    super_manager = PerformanceExcursionDateManager()


class ExcursionTimeAnnotateManager(models.Manager):
    def get_queryset(self):
        booked = (apps.get_model("bookings", "ExcursionBooking").objects.filter(excursion_time=OuterRef("pk"))
                  .values("excursion_time__pk")
                  .annotate(total_booked_places=models.Sum("visitors"))
                  .values("total_booked_places"))
        qs = (
            super().get_queryset()
            .annotate(booked_places=Subquery(booked))
            .annotate(is_available_places=models.F("max_visitors") - models.F("booked_places"))
            .annotate(is_booking_available=models.ExpressionWrapper(
                ~models.Q(is_available_places=0) | models.Q(is_available_places=None),
                models.BooleanField(default=True, null=False, blank=False)
                )
            )
        ).filter(is_booking_available=True)

        return qs


class ExcursionTime(BaseModel):
    excursion_date = models.ForeignKey(ExcursionDate, on_delete=models.CASCADE, related_name="times")
    time = models.TimeField("Time")
    price = models.DecimalField("Price", decimal_places=2, max_digits=10)
    max_visitors = models.PositiveSmallIntegerField("Max Visitors")

    annotated_objects = ExcursionTimeAnnotateManager()
    objects = models.Manager()

    def get_available_places(self):
        booked_places = self.bookings.all().aggregate(total_visitors=models.Sum("visitors"))["total_visitors"]
        return self.max_visitors if not booked_places else self.max_visitors - booked_places
