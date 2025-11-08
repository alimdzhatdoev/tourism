import os

from .base import DJANGO_ENV

if (DJANGO_ENV == "PRODUCTION") or os.getenv("S3_ID", False):
    # Static and media files settings
    STATICFILES_STORAGE = "common.storages.StaticStorage"
    DEFAULT_FILE_STORAGE = "common.storages.PublicMediaStorage"
    YANDEX_CLIENT_DOCS_BUCKET_NAME = os.getenv("S3_BUCKET")
    AWS_ACCESS_KEY_ID = os.getenv('S3_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('S3_KEY')
    AWS_S3_ENDPOINT_URL = os.getenv("S3_ENDPOINT")

IMGPROXY_PREFIX = os.getenv("IMGPROXY_PREFIX", "test/")
