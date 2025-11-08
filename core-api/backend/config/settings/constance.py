from datetime import timedelta
import os


CONSTANCE_FULL_CONFIG = {
    "Verification": {
        "VERIFICATION_CODE__EXPIRES_AFTER": (
            timedelta(minutes=2),
            "Время жизни кода подтверждения",
            timedelta,
        ),
        "VERIFICATION_CODE__RETRY_AFTER": (
            timedelta(minutes=1),
            "Через какое время возможен повторный запрос кода подтверждения",
            timedelta,
        ),
        "VERIFICATION_CODE__MESSAGE_TEMPLATE": (
            "Ваш код для входа:\n{code}",
            "Шаблон сообщения с кодом подтверждения",
            "code_template",
        ),
    },
    "RedSMS": {
        "REDSMS__IS_ENABLED": (True, "Включить отправку СМС", bool),
        "REDSMS__SENDER_NAME": (os.getenv("REDSMS_SENDER_NAME") or "edisoncorp", "Имя отправителя СМС", "inline"),
    },
    "Testing": {
        "TEST__IS_TEST_USER_PHONES_ACTIVE": (
            False,
            "Активность тестовых номеров",
            bool,
        ),
        "TEST__TEST_USER_PHONES": (
            [],
            "Список тестовых номеров ЧЕРЕЗ ЗАПЯТУЮ",
            "str_list",
        ),
    },
}


CONSTANCE_CONFIG = {}
for config in CONSTANCE_FULL_CONFIG.values():
    CONSTANCE_CONFIG.update(config)

CONSTANCE_CONFIG_FIELDSETS = {
    f"{i}. {fieldset}": tuple(CONSTANCE_FULL_CONFIG[fieldset].keys())
    for i, fieldset in enumerate(CONSTANCE_FULL_CONFIG, 1)
}

CONSTANCE_IGNORE_ADMIN_VERSION_CHECK = True
CONSTANCE_BACKEND = "constance.backends.database.DatabaseBackend"

CONSTANCE_ADDITIONAL_FIELDS = {
    "inline": ["django.forms.CharField", {}],
    "str_not_required": ["django.forms.CharField", {"required": False}],
    "str_list": ["common.constance.StringList", {"required": False}],
    "code_template": [
        "common.constance.TemplateField",
        {"placeholders": [r"{code}"]},
    ],
    "point": [
        "django.contrib.gis.forms.fields.PointField",
        {
            "srid": 4326,
            "widget": "django.contrib.gis.forms.widgets.OSMWidget",
        },
    ],
}
