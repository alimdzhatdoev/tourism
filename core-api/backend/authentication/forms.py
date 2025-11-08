from django.contrib.auth.forms import AuthenticationForm
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


class CustomAdminAuthenticationForm(AuthenticationForm):
    """
    Admin authentication form with customized error message for non staff users
    """

    error_messages = {
        **AuthenticationForm.error_messages,
        "not_a_staff_user": _("Access denied. Reason: not a staff user."),
    }
    required_css_class = "required"

    def confirm_login_allowed(self, user):
        super().confirm_login_allowed(user)
        if not user.is_staff:
            raise ValidationError(
                self.error_messages["not_a_staff_user"],
                code="not_a_staff_user",
                params={"username": self.username_field.verbose_name},
            )
