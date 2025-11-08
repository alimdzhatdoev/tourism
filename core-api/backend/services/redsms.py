import hashlib
import logging
import time
from dataclasses import dataclass
from typing import Dict, List

import requests
from constance import config
from django.conf import settings
from requests.compat import urljoin

logger = logging.getLogger(__name__)


# Описание API https://redsms.ru/integration/api/https/


class exceptions:
    class RedSMSCredentialsMissing(Exception):
        pass

    class RedSMSBadCredentials(Exception):
        pass

    class RedSMSInsufficientFunds(Exception):
        pass

    class RedSMSBadRequest(Exception):
        pass

    class RedSMSNotFound(Exception):
        pass

    class RedSMSError(Exception):
        pass


@dataclass
class RedSMSCredentials:
    login: str
    api_key: str
    api_url: str


def check_credentials(*, credentials: RedSMSCredentials):
    if not all((credentials.login, credentials.api_key, credentials.api_url)):
        logger.error("credentials missing")
        raise exceptions.RedSMSCredentialsMissing


def get_redsms_auth_headers(*, data: Dict[str, str], credentials: RedSMSCredentials):
    ts = str(time.time())

    field_values = [value for _, value in sorted(data.items())]
    md5_encoder = hashlib.md5(
        ("".join(field_values) + ts + credentials.api_key).encode("utf-8")
    )
    sig = md5_encoder.hexdigest()

    return {
        "login": credentials.login,
        "ts": ts,
        "sig": sig,
    }


def raise_exception(*, status_code: int, data: dict):
    EXCEPTION_MAP = {
        400: exceptions.RedSMSBadRequest,
        401: exceptions.RedSMSBadCredentials,
        404: exceptions.RedSMSNotFound,
        420: exceptions.RedSMSInsufficientFunds,
        500: exceptions.RedSMSError,
    }
    exception: type[Exception] = EXCEPTION_MAP[status_code]
    logger.error(f"{exception.__name__}: {data}")
    raise exception(data)


def send_sms(
    *, text: str, sender: str, to: List[str], credentials: RedSMSCredentials
) -> bool:
    data = {
        "from": sender,
        "to": ",".join(to),
        "text": text,
        "route": "sms",
    }

    headers = get_redsms_auth_headers(data=data, credentials=credentials)
    headers.update({"Accept": "application/json"})

    url = urljoin(credentials.api_url, "message")
    response = requests.post(url, data=data, headers=headers)

    if response.status_code != 200:
        raise_exception(response.status_code, response.json())

    logger.info("SMS sent.")


def get_redsms_credentials():
    return RedSMSCredentials(
        api_key=settings.REDSMS_API_KEY,
        login=settings.REDSMS_LOGIN,
        api_url=settings.REDSMS_URL,
    )


class RedSMSClient:
    def __init__(self) -> None:
        self.credentials = get_redsms_credentials()
        self.is_enabled = config.REDSMS__IS_ENABLED
        self.sender = config.REDSMS__SENDER_NAME

    def send_sms(self, *, text: str, to: List[str]):
        if not self.is_enabled:
            logger.warn(
                (
                    "RedSMS is disabled. Fake sending a message:\n"
                    f'  FROM: "{self.sender}"\n'
                    f'  TO: "{to}"\n'
                    f'  TEXT: "{text}"'
                )
            )
            return

        send_sms(text=text, sender=self.sender, to=to, credentials=self.credentials)
