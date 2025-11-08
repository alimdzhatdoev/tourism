from rest_framework.routers import SimpleRouter

from routes.api import views

router = SimpleRouter()

# addresses
router.register("routes", views.RouteViewSet, basename="routes")
router.register("route_stops", views.RouteStopViewSet, basename="route_stops")
router.register("route_photos", views.RoutePhotoViewSet, basename="route_photos")
router.register("tags", views.TagViewSet, basename="tags")
router.register("route_tags", views.RouteTagViewSet, basename="route_tags")
router.register("route_reviews", views.RouteReviewViewSet, basename="route_reviews")
router.register(
    "route_review_photos", views.RouteReviewPhotoViewSet, basename="route_review_photos"
)
router.register("route_kinds", views.RouteKindViewSet, basename="route_kinds")
router.register("route_browses", views.RouteBrowsViewSet, basename="route_browses")
router.register("route_likes", views.RouteLikeViewSet, basename="route_likes")
router.register(
    "route_map_browses", views.RouteMapBrowsViewSet, basename="route_map_browses"
)
router.register(
    "route_categories", views.RouteCategoryViewSet, basename="route_categories"
)

urlpatterns = router.urls
