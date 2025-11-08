import datetime

from django.apps import apps
from django.contrib.auth import get_user_model
from django.contrib.gis.db.models.functions import GeometryDistance
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Avg, Count, F, Func, OuterRef, Subquery, Sum
from django.db.models.functions import Round, Coalesce

from attractions.models import Attraction, RegionCity, Category
from common.choices import BaseTextChoices, FiveGradeChoices, TenGradeChoices
from common.model_fields import get_field_from_choices
from common.models import BaseFileModel, BaseHistoricalModel, BaseModel

User = get_user_model()


class RouteKind(BaseModel):
    name = models.CharField("Name", max_length=16, unique=True)
    average_speed = models.PositiveSmallIntegerField("Average Speed (km/h)")

    class Meta:
        db_table = "route_kinds"


class AnnotateRouteManager(models.Manager):
    def get_queryset(self):
        stops = RouteStop.annotated_objects.filter(route=OuterRef("pk")).annotate(
            total_length=Sum("distance_to_next")
        )
        likes = (
            apps.get_model("routes", "RouteLike")
            .objects.filter(route=OuterRef("pk"))
            .annotate(number=Func(F("id"), function="Count"))
            .values("number")
        )
        views = (
            apps.get_model("routes", "RouteBrows")
            .objects.filter(route=OuterRef("pk"))
            .annotate(number=Func(F("id"), function="Count"))
            .values("number")
        )
        map_views = (
            apps.get_model("routes", "RouteMapBrows")
            .objects.filter(route=OuterRef("pk"))
            .annotate(number=Func(F("id"), function="Count"))
            .values("number")
        )
        now = datetime.datetime.now().date()
        delta_7_days = datetime.timedelta(days=7)
        excursion_dates = (
            apps.get_model("excursions", "ExcursionDate")
            .objects.filter(excursion__route=OuterRef("pk"), date__range=[now, now + delta_7_days])
            .annotate(min_price=models.Min("times__price"))
            .values("min_price")
        )
        queryset = (
            super()
            .get_queryset()
            .annotate(
                review_count=Count("reviews"),
                rating=Coalesce(Round(Avg("reviews__star_rate"), 1), 0.0),
                length=Subquery(stops.values("total_length")[:1]),
                time=models.ExpressionWrapper(
                    models.F("length")
                    / models.F("kind__average_speed")
                    * models.Value(60),
                    output_field=models.PositiveIntegerField(),
                ),
                min_excursion_price=Subquery(excursion_dates[:1]),
            )
            .annotate(
                view_count=Subquery(views),
                map_view_count=Subquery(map_views),
                like_count=Subquery(likes),
            )
        )
        return queryset


class AnnotateRouteStopManager(models.Manager):
    def get_queryset(self):
        next_stop = RouteStop.objects.filter(
            route=OuterRef("route"), order=OuterRef("order") + 1
        )

        queryset = (
            super()
            .get_queryset()
            .annotate(
                distance_to_next=GeometryDistance(
                    "attraction__location__point",
                    Subquery(next_stop.values("attraction__location__point")[:1]),
                )
                / 1000,
            )
        )
        return queryset


class RouteStatusChoices(BaseTextChoices):
    CREATION = "CREATION", "Creation"
    VERIFICATION = "VERIFICATION", "Verification"
    SUSPENSION = "SUSPENSION", "Suspension"
    PUBLICATION = "PUBLICATION", "Publication"


class Route(BaseHistoricalModel):
    name = models.CharField("Name", max_length=64, unique=True)
    description = models.TextField("Description")
    custom_properties = models.JSONField("Custom Properties", null=True, blank=True) # не обрабатываются бэкендом

    total_distance = models.DecimalField("Total distance", decimal_places=3, max_digits=10, null=True, blank=True)
    total_duration = models.PositiveIntegerField("Minute Duration", null=True, blank=True)

    main_details = models.CharField(
        "Main Details", max_length=128, null=True, blank=True
    )
    difficulty = get_field_from_choices(
        "Difficulty", TenGradeChoices, default=TenGradeChoices.ONE
    )
    is_original = models.BooleanField("Is Original Route", default=False)

    kind = models.ForeignKey(
        RouteKind,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="routes",
    )

    # common location could be only region
    territory = models.ForeignKey(
        RegionCity,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="routes",
    )

    status = get_field_from_choices(
        "Status", RouteStatusChoices, default=RouteStatusChoices.SUSPENSION
    )
    published_dttm = models.DateTimeField("Published Date Time", null=True, blank=True)

    objects = models.Manager()
    annotated_objects = AnnotateRouteManager()

    def __str__(self):
        return f"{self.name}"


class RouteSeasonChoices(BaseTextChoices):
    WINTER = "winter", "зима"
    SPRING = "spring", "весна"
    SUMMER = "summer", "лето"
    AUTUMN = "autumn", "осень"
    ALL = "all", "все время года"


class RouteProperties(models.Model):
    route = models.OneToOneField(Route, on_delete=models.CASCADE, related_name="properties", primary_key=True)

    season = get_field_from_choices("Season", RouteSeasonChoices, null=True, blank=True, db_index=True)
    rise_degree = models.IntegerField(null=True, blank=True)
    is_overnight = models.BooleanField(null=True, blank=True)
    is_family = models.BooleanField(null=True, blank=True)
    is_on_horseback = models.BooleanField(null=True, blank=True)
    is_on_foot = models.BooleanField(null=True, blank=True)
    is_on_quad_bike = models.BooleanField(null=True, blank=True)
    is_on_car = models.BooleanField(null=True, blank=True)
    is_swimming = models.BooleanField(null=True, blank=True)

    class Meta:
        db_table = "route_properties"


class RouteStop(BaseModel):
    attraction = models.ForeignKey(
        Attraction, on_delete=models.CASCADE, related_name="routes"
    )
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name="stops")
    order = models.PositiveSmallIntegerField("Order number")

    annotated_objects = AnnotateRouteStopManager()
    objects = models.Manager()

    def clean(self):
        if self.order > 1 and self.route.stops.filter(order=(self.order - 1)).exists():
            raise ValidationError("Can't be done before previous stop was not added")

    class Meta:
        db_table = "route_stops"
        ordering = ("order",)


class AnnotatedRouteReviewManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset()


class RouteReview(BaseModel):
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name="reviews")
    text = models.CharField("review Text", max_length=512, null=True, blank=True)
    star_rate = get_field_from_choices("Stars", FiveGradeChoices)

    annotated_objects = AnnotatedRouteReviewManager()
    objects = models.Manager()

    class Meta:
        db_table = "route_reviews"


class RouteReviewPhoto(BaseFileModel):
    review = models.ForeignKey(
        RouteReview, on_delete=models.CASCADE, related_name="photos"
    )

    class Meta:
        db_table = "route_review_photos"


class Tag(BaseModel):
    name = models.CharField("Name", max_length=32, unique=True, db_index=True)


class RouteTag(BaseModel):
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name="tags")
    tag = models.ForeignKey(Tag, on_delete=models.PROTECT, related_name="routes")

    class Meta:
        db_table = "route_tags"


class RouteLike(BaseModel):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="favourite_routes"
    )
    route = models.ForeignKey(
        Route, on_delete=models.CASCADE, related_name="user_likes"
    )

    class Meta:
        db_table = "route_likes"


class RouteBrows(BaseModel):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="viewed_routes"
    )
    route = models.ForeignKey(
        Route, on_delete=models.CASCADE, related_name="user_views"
    )

    class Meta:
        db_table = "route_views"


class RouteMapBrows(BaseModel):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="map_viewed_routes"
    )
    route = models.ForeignKey(
        Route, on_delete=models.CASCADE, related_name="user_map_views"
    )

    class Meta:
        db_table = "route_map_views"


class RoutePhoto(BaseFileModel):
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name="photos")

    class Meta:
        db_table = "route_photos"
        ordering = ["order"]


class RouteCategory(BaseModel):
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name="categories")
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="routes")
