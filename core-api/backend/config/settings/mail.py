import os

from common.helpers import str2bool

if str2bool(os.environ["EMAIL_IS_CONSOLE"]):
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
else:
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
    EMAIL_HOST = os.environ["EMAIL_HOST"]
    EMAIL_PORT = os.environ["EMAIL_PORT"]
    EMAIL_HOST_USER = os.environ["EMAIL_HOST_USER"]
    EMAIL_HOST_PASSWORD = os.environ["EMAIL_HOST_PASSWORD"]
    EMAIL_USE_TLS = bool(int(os.getenv("EMAIL_USE_TLS", "0")))
    EMAIL_USE_SSL = bool(int(os.getenv("EMAIL_USE_SSL", "0")))
    DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
