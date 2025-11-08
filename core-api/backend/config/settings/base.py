""" Django base settings for TravelApp project"""

import os


def reduce_path(file_name, times):
    result = os.path.realpath(file_name)
    for i in range(times):
        result = os.path.dirname(result)
    return result


ROOT_DIR = reduce_path(__file__, 4)
APPS_DIR = reduce_path(__file__, 3)

DJANGO_ENV = os.getenv("DJANGO_ENV", "DEVELOPMENT")
DEBUG = DJANGO_ENV != "PRODUCTION"
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
CELERY_SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
ALLOWED_HOSTS = os.environ["DJANGO_ALLOWED_HOSTS"].split(",")
CSRF_TRUSTED_ORIGINS = os.environ["DJANGO_CORS_ALLOWED_ORIGINS"].split(",")

ROOT_URLCONF = "config.urls"

STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(ROOT_DIR, "static/")
STATICFILES_DIRS = [os.path.join(APPS_DIR, "static/")]

MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(ROOT_DIR, "media/")


INSTALLED_APPS = [
    # Django apps
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.postgres",
    "django.contrib.gis",
    "django.contrib.humanize",
    # Third party apps
    "rest_framework_serializer_extensions",
    "django_better_admin_arrayfield",
    "drf_yasg",
    "simple_history",
    "django_filters",
    "corsheaders",
    "storages",
    "django_cleanup.apps.CleanupConfig",
    "constance",
    # Local apps
    "authentication.apps.AuthenticationAppConfig",
    "attractions.apps.AttractionsAppConfig",
    "routes.apps.RoutesAppConfig",
    "payments.apps.PaymentsAppConfig",
    "bookings.apps.BookingsAppConfig",
    "excursions.apps.ExcursionsAppConfig",
    "systems.apps.SystemsAppConfig",
    "chats.apps.ChatsAppConfig",
    "contents.apps.ContentsAppConfig",
    "feedback.apps.FeedbackAppConfig",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "authentication.middleware.CheckAdminPermissionMiddleware",
]

if DJANGO_ENV == "DEVELOPMENT":
    CORS_ALLOW_ALL_ORIGINS = True
else:
    CORS_ALLOWED_ORIGINS = os.getenv("DJANGO_CORS_ALLOWED_ORIGINS").split(",")

TEMPLATES_DIR = os.path.join(APPS_DIR, "templates")
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [TEMPLATES_DIR],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

LANGUAGE_CODE = "en-us"

TIME_ZONE = "Europe/Moscow"
USE_I18N = False
USE_L10N = False
USE_TZ = True

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
DEFAULT_AUTO_FIELD = "django.db.models.AutoField"
