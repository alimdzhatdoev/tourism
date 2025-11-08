import datetime

from django.apps import apps
from django.contrib.auth import get_user_model
from django.db import models
from django.db.models import Avg, Count, Exists, F, Func, OuterRef, Subquery, Min
from django.db.models.functions import Round, Coalesce
from django.utils import timezone

from attractions.models.addresses import Contact, Location, RegionCity
from common.choices import BaseTextChoices, FiveGradeChoices, WeekDayChoices
from common.model_fields import AmountField, get_field_from_choices
from common.models import BaseFileModel, BaseHistoricalModel, BaseModel, BaseManager
from payments.models import Payment

User = get_user_model()


class AttractionStatusChoices(BaseTextChoices):
    CREATION = "CREATION", "Creation"
    ARCHIVE = "ARCHIVE", "Archive"
    PUBLISHED = "PUBLISHED", "Published"


class AnnotateAttractionManager(BaseManager):
    def get_queryset(self):
        promotions = AttractionPromotion.objects.filter(
            from_dttm__lte=timezone.now(),
            till_dttm__gte=timezone.now(),
            attraction=models.OuterRef("pk"),
        )
        reviews = (
            apps.get_model("attractions", "AttractionReview")
            .objects.filter(attraction=OuterRef("pk"))
            .annotate(number=Func(F("id"), function="Count"))
            .values("number")
        )
        likes = (
            apps.get_model("attractions", "UserFavouriteAttraction")
            .objects.filter(attraction=OuterRef("pk"))
            .annotate(number=Func(F("id"), function="Count"))
            .values("number")
        )
        views = (
            apps.get_model("attractions", "AttractionBrows")
            .objects.filter(attraction=OuterRef("pk"))
            .annotate(number=Func(F("id"), function="Count"))
            .values("number")
        )
        calls = (
            apps.get_model("attractions", "AttractionCall")
            .objects.filter(attraction=OuterRef("pk"))
            .annotate(number=Func(F("id"), function="Count"))
            .values("number")
        )

        now = datetime.datetime.now().date()
        delta_30_days = datetime.timedelta(days=30)
        excursion_dates = (
            apps.get_model("excursions", "ExcursionDate")
            .annotated_objects.filter(excursion__attraction=OuterRef("pk"), date__range=[now, now + delta_30_days])
            .annotate(min_price=Min("min_price"))
            .values("min_price").order_by("min_price")
        )
        queryset = (
            super()
            .get_queryset()
            .annotate(
                review_count=Subquery(reviews),
                rating=Coalesce(Round(Avg("reviews__star_rate"), 1), 0.0),
                is_promoting=Exists(promotions),
                views=Subquery(views),
                likes=Subquery(likes),
                calls=Subquery(calls),
                contained_routes=Count("routes"),
                min_excursion_price=Subquery(excursion_dates[:1]),
            )
        )
        return queryset


class Attraction(BaseHistoricalModel):
    name = models.CharField("Name", max_length=64, unique=True)
    description = models.TextField("Description", null=True, blank=True)
    how_to_get = models.CharField("How To Get", max_length=256, null=True, blank=True)
    main_details = models.CharField(
        "Main Details", max_length=128, null=True, blank=True
    )
    audio_guid = models.FileField("Audio Guid", null=True, blank=True)

    location = models.ForeignKey(
        Location, on_delete=models.PROTECT, related_name="attractions"
    )

    is_recommended = models.BooleanField("Is Attraction Recommends", default=False)
    is_user_added = models.BooleanField("Is Added by User", default=False)

    ticket_price_from = AmountField("Ticket Price From", null=True, blank=True)

    # cafe
    average_check = models.PositiveIntegerField("Average Check", null=True, blank=True)
    cuisine_kind = models.CharField(
        "Cuisine Kind", max_length=128, null=True, blank=True
    )

    # coffee, hotels, sport
    min_price = models.PositiveIntegerField("Minimal Price", null=True, blank=True)

    # hotels
    room_number = models.PositiveIntegerField("Room Number", null=True, blank=True)
    checkin_time = models.TimeField("CheckIn Time", null=True, blank=True)
    checkout_time = models.TimeField("CheckOut Time", null=True, blank=True)

    # common location could be only region if attraction is out of city
    territory = models.ForeignKey(
        RegionCity,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="attractions",
    )

    groups = models.ManyToManyField("Group", related_name="attractions")
    subgroups = models.ManyToManyField(
        "SubGroup", blank=True, related_name="attractions"
    )

    status = get_field_from_choices(
        "Status", AttractionStatusChoices, default=AttractionStatusChoices.ARCHIVE
    )
    published_dttm = models.DateTimeField("Published Date Time", null=True, blank=True)

    objects = BaseManager()
    annotated_objects = AnnotateAttractionManager()

    def __str__(self):
        return f"{self.name}"


class AttractionContact(BaseModel):
    attraction = models.ForeignKey(
        Attraction, on_delete=models.CASCADE, related_name="contacts"
    )
    contact = models.ForeignKey(
        Contact, on_delete=models.PROTECT, related_name="attractions"
    )

    class Meta:
        db_table = "attractions_attraction_contacts"


class Promotion(BaseModel):
    name = models.CharField("Name", max_length=32)
    description = models.CharField("Description", max_length=512, null=True, blank=True)
    day_limit = models.PositiveSmallIntegerField("Day Limit")


class AttractionPromotion(BaseModel):
    attraction = models.ForeignKey(
        Attraction,
        on_delete=models.CASCADE,
        related_name="promotions",
        limit_choices_to={"is_user_added": True},
    )
    promotion = models.ForeignKey(
        Promotion,
        on_delete=models.PROTECT,
        related_name="attractions",
    )
    payment = models.ForeignKey(
        Payment,
        on_delete=models.PROTECT,
        related_name="promotions",
        limit_choices_to={"is_success": True},
    )
    from_dttm = models.DateTimeField("From Dttm")
    till_dttm = models.DateTimeField("Till Dttm")

    class Meta:
        db_table = "attractions_attraction_promotions"
        ordering = ("-created_dttm",)


class AnnotatedAttractionPhotoManager(BaseManager):
    def get_queryset(self):
        return super().get_queryset()


class AttractionPhoto(BaseFileModel):
    attraction = models.ForeignKey(
        Attraction, on_delete=models.CASCADE, related_name="photos"
    )

    annotated_objects = AnnotatedAttractionPhotoManager()
    objects = BaseManager()

    class Meta:
        db_table = "attraction_photos"
        ordering = ["order"]


class AnnotatedAttractionReviewManager(BaseManager):
    def get_queryset(self):
        return super(AnnotatedAttractionReviewManager, self).get_queryset()


class AttractionReview(BaseModel):
    attraction = models.ForeignKey(
        Attraction, on_delete=models.CASCADE, related_name="reviews"
    )
    text = models.CharField("Review Text", max_length=512, null=True, blank=True)

    star_rate = get_field_from_choices("Stars", FiveGradeChoices)

    annotated_objects = AnnotatedAttractionReviewManager()
    objects = BaseManager()

    class Meta:
        db_table = "attraction_reviews"


class AttractionReviewPhoto(BaseFileModel):
    review = models.ForeignKey(
        AttractionReview, on_delete=models.CASCADE, related_name="photos"
    )

    class Meta:
        db_table = "attraction_review_photos"
        ordering = ["order"]


class AttractionSchedule(BaseModel):
    attraction = models.ForeignKey(
        Attraction, on_delete=models.CASCADE, related_name="schedules"
    )
    from_time = models.TimeField("From Time", null=True, blank=True)
    till_time = models.TimeField("Till Time", null=True, blank=True)
    week_day = get_field_from_choices("Week Day", WeekDayChoices)

    is_filled = models.BooleanField("Is Filled", default=True)
    is_24_hour = models.BooleanField("Is 24 Hour Works", default=False)

    class Meta:
        db_table = "attraction_schedules"
        unique_together = ("attraction", "week_day")


class UserFavouriteAttraction(BaseModel):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="favourite_attractions"
    )
    attraction = models.ForeignKey(
        Attraction, on_delete=models.CASCADE, related_name="users_favourite"
    )

    class Meta:
        db_table = "user_favourite_attractions"
        unique_together = ("user", "attraction")


class Category(BaseFileModel):
    name = models.CharField("Name", max_length=32, unique=True, db_index=True)
    file = models.FileField("Logo", null=True, blank=True)
    is_season = models.BooleanField("Is Season", default=False)

    def __str__(self):
        return f"{self.name}"

    class Meta:
        db_table = "attraction_categories"


class AttractionCategory(BaseModel):
    attraction = models.ForeignKey(
        Attraction, on_delete=models.CASCADE, related_name="categories"
    )
    category = models.ForeignKey(
        Category, on_delete=models.PROTECT, related_name="attractions"
    )

    def __str__(self):
        return f"{self.attraction} {self.category}"

    class Meta:
        db_table = "attraction_category_summary"
        unique_together = ("attraction", "category")


# Замена Category, AttractionCategory


class LayoutChoices(BaseTextChoices):
    LIST = "list"
    BANNER = "banner"
    NAME = "name"


class GroupKind(BaseModel):
    name = models.CharField(max_length=64, unique=True, db_index=True)

    class Meta:
        db_table = "attraction_group_kind"


class Group(BaseModel):
    name = models.CharField(max_length=32, unique=True, db_index=True)
    icon = models.FileField(null=True, blank=True)
    position = models.PositiveIntegerField(null=True)
    kind = models.ForeignKey(GroupKind, on_delete=models.PROTECT, db_index=True, related_name="groups")

    is_user_can_contribute = models.BooleanField(default=False)

    layout = get_field_from_choices("Layout", LayoutChoices, default=LayoutChoices.LIST)

    class Meta:
        db_table = "attraction_groups"
        ordering = ["kind", "position"]


class SubGroup(BaseModel):
    name = models.CharField(max_length=32, unique=True, db_index=True)
    icon = models.FileField(null=True, blank=True)
    position = models.PositiveIntegerField(null=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, db_index=True, related_name="subgroups")

    class Meta:
        db_table = "attraction_subgroups"
        ordering = ["group", "position"]


class AttractionTransferStop(BaseModel):
    attraction = models.ForeignKey(
        Attraction, on_delete=models.CASCADE, related_name="transfer_stops"
    )

    name = models.CharField(max_length=124)
    description = models.TextField(blank=True)
    time = models.TimeField()
    day = models.PositiveSmallIntegerField(default=0)
    
    class Meta:
        db_table = "attraction_transfer_stops"
        ordering = ["attraction", "day", "time"]
