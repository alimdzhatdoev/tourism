from rest_framework.routers import SimpleRouter

from bookings.api import views

router = SimpleRouter()

router.register("excursion_bookings", views.ExcursionBookingViewSet, basename="excursion-bookings")


urlpatterns = router.urls
