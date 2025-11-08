from . import views

from rest_framework.routers import SimpleRouter

router = SimpleRouter()

router.register(
    "feedbacks",
    views.FeedbackViewSet,
    "feedbacks",
)

urlpatterns = router.urls
