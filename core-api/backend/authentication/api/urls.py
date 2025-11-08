from django.urls import path
from rest_framework.routers import SimpleRouter
from rest_framework_simplejwt import views as simplejwt_views

from authentication.api import views

router = SimpleRouter()

router.register("users", views.UserViewSet, basename="users")
router.register(
    "notification_tokens",
    views.NotificationTokenViewSet,
    basename="notification_tokens",
)

urlpatterns = [
    path(
        "token/obtain/",
        simplejwt_views.TokenObtainPairView.as_view(),
        name="token-obtain",
    ),
    path(
        "token/refresh/",
        simplejwt_views.TokenRefreshView.as_view(),
        name="token-refresh",
    ),
    path("users/me/", views.UserViewSet.as_view({"get": "list"}), name="users-me"),
    path("authenticate/", views.AuthenticateView.as_view(), name="authenticate"),
    path("email-verify/", views.VerifyEmail.as_view(), name="email-verify"),
    path(
        "change-password/", views.ChangePasswordView.as_view(), name="change-password"
    ),
    path("reset-password/", views.ResetPasswordView.as_view(), name="reset-password"),
]

urlpatterns += router.urls
