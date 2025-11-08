import os

# Logging config
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "console": {
            "format": "%(asctime)s,%(msecs)d %(levelname)-8s %(name)-4s [%(filename)s:%(lineno)d] %(message)s"
        },
    },
    "handlers": {"console": {"class": "logging.StreamHandler", "formatter": "console"}},
    "loggers": {
        "": {
            "handlers": ["console"],
            "level": os.getenv("DJANGO_LOG_LEVEL", "INFO"),
        },
    },
}
