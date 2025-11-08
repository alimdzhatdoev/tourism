from django.urls import path
from rest_framework.routers import SimpleRouter

from . import views

router = SimpleRouter()

urlpatterns = [
    path(
        "auth/verification_code/",
        views.VerificationCodeRequestView.as_view(),
        name="authenticate",
    ),
    path(
        "auth/token/obtain/",
        views.TokenObtainPairView.as_view(),
        name="token-obtain",
    ),
    path(
        "auth/token/refresh/",
        views.TokenRefreshView.as_view(),
        name="token-refresh",
    ),
] + router.urls
