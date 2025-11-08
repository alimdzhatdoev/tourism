from rest_framework.routers import SimpleRouter
from django.urls import path

from payments.api import views

router = SimpleRouter()

router.register("payments", views.PaymentViewSet, basename="payments")
router.register("payments", views.CheckPaymentViewSet, basename="payments")

urlpatterns = router.urls
