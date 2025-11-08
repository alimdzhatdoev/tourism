from django.urls import path
from rest_framework.routers import SimpleRouter

from attractions.api import views

router = SimpleRouter()

# addresses
router.register("cities", views.CityViewSet, basename="cities")
router.register("regions", views.RegionViewSet, basename="regions")
router.register("locations", views.LocationViewSet, basename="locations")
# router.register("region_cities", views.RegionCityViewSet, basename="region_cities")

# attractions
router.register("attractions", views.AttractionViewSet, basename="attractions")
router.register(
    "attraction_transfer_stops", views.AttractionTransferStopViewSet, basename="attraction_transfer_stops"
)
router.register(
    "attraction_photos", views.AttractionPhotoViewSet, basename="attraction_photos"
)
router.register(
    "attraction_schedules",
    views.AttractionScheduleViewSet,
    basename="attraction_schedules",
)
# router.register("categories", views.CategoryViewSet, basename="categories")
router.register(
    "attraction_contacts",
    views.AttractionContactViewSet,
    basename="attraction_contacts",
)
router.register(
    "attraction_reviews", views.AttractionReviewViewSet, basename="attraction_reviews"
)
router.register(
    "attraction_review_photos",
    views.AttractionReviewPhotoViewSet,
    basename="attraction_review_photos",
)
# router.register(
#     "attraction_categories",
#     views.AttractionCategoryViewSet,
#     basename="attraction_categories",
# )

router.register("group_kinds", views.GroupKindViewSet, basename="group_kinds")
router.register("groups", views.GroupViewSet, basename="groups")
router.register("subgroups", views.SubGroupViewSet, basename="subgroups")

router.register("catalogue", views.CatalogueViewSet, basename="catalogue")

# payments
router.register("promotions", views.PromotionViewSet, basename="promotions")
router.register(
    "attraction_promotions",
    views.AttractionPromotionViewSet,
    basename="attraction_promotions",
)

# counters
router.register(
    "user_favourite_attractions",
    views.UserFavouriteAttractionViewSet,
    basename="user_favourite_attractions",
)
router.register(
    "user_viewed_attractions",
    views.AttractionBrowsViewSet,
    basename="user_viewed_attractions",
)
router.register(
    "user_called_attractions",
    views.AttractionCallViewSet,
    basename="user_called_attractions",
)

# contacts
router.register("contact_kinds", views.ContactKindViewSet, basename="contact_kinds")
router.register("contacts", views.ContactViewSet, basename="contacts")

# discounts
router.register("discounts", views.DiscountViewSet, basename="discounts")
router.register(
    "attraction_discounts",
    views.AttractionDiscountViewSet,
    basename="attraction_discounts",
)

# banners
router.register("banners", views.BannerViewSet, basename="banners")


urlpatterns = router.urls + [
    path("geocoder/", views.GeoCoderView.as_view(), name="geocoder")
]
