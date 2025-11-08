import os

from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken

from config import settings

User = get_user_model()


def get_message_data(user: User, username: str, scheme: str, domain: str) -> tuple:
    token = RefreshToken.for_user(user).access_token

    relative_link = reverse("email-verify")

    absolute_url = f"{scheme}://{domain}{relative_link}?token={str(token)}"
    email_body = (
        f"Hi {username} Use the link below to verify your email \n {absolute_url}"
    )

    return absolute_url, email_body


def send_verify_email_message(absolute_url: str, email_body: str, emails: list, password: str, message: str):
    html_message = render_to_string(
        os.path.join(settings.TEMPLATES_DIR, "email", "verification_code.html"),
        {"link": absolute_url, "message": message, "access_code": password},
    )
    send_mail(
        "Verify your email",
        email_body,
        os.getenv("EMAIL_HOST_USER"),
        emails,
        html_message=html_message,
    )
