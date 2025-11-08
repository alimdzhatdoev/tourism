# Non-API urls
from django.contrib.auth import views as auth_views
from django.urls import path
from django.views.generic import RedirectView

urlpatterns = [
    path(
        "password_reset/",
        auth_views.PasswordResetView.as_view(template_name="registration/reset_password.html"),
        name="admin_password_reset",
    ),
    path(
        "password_reset/done/",
        auth_views.PasswordResetDoneView.as_view(template_name="registration/password_reset_sent.html"),
        name="password_reset_done",
    ),
    path(
        "reset/<uidb64>/<token>/",
        auth_views.PasswordResetConfirmView.as_view(template_name="registration/password_reset_form.html"),
        name="password_reset_confirm",
    ),
    path(
        "reset/done/",
        auth_views.PasswordResetCompleteView.as_view(template_name="registration/password_reset_done.html"),
        name="password_reset_complete",
    ),
    path("accounts/login/", RedirectView.as_view(url="/admin/")),
]
