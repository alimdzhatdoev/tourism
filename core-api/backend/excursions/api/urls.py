from rest_framework.routers import SimpleRouter

from excursions.api import views

router = SimpleRouter()

router.register("excursions", views.ExcursionViewSet, basename="excursions")
router.register("excursion_likes", views.ExcursionLikeViewSet, basename="excursion_dates")
router.register("excursion_dates", views.ExcursionDateViewSet, basename="excursion_dates")
router.register("excursion_times", views.ExcursionTimeViewSet, basename="excursion_times")


urlpatterns = router.urls
