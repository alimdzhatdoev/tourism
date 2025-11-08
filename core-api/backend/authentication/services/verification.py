import logging
import random
from dataclasses import dataclass
from datetime import datetime
from secrets import compare_digest

from constance import config
from django.utils import timezone

from .. import exceptions, models
from ..interfaces import send_message

logger = logging.getLogger(__name__)


def get_four_digit_code():
    digits = random.sample("123456789", 3)
    code = digits[0] + digits[1] + digits[0] + digits[2]
    return code


@dataclass
class VerificationCodeDTO:
    request_id: str
    value: str
    expires_at: datetime
    retry_at: datetime

    def __str__(self) -> str:
        return f"VerificationCodeDTO({self.request_id})"


def find_verification_code(*, request_id: str):
    obj = models.VerificationCode.objects.filter(request_id=request_id).first()
    if obj is None:
        return None
    return VerificationCodeDTO(
        request_id=obj.request_id,
        value=obj.value,
        expires_at=obj.expires_at,
        retry_at=obj.retry_at,
    )


def save_verification_code(*, code: VerificationCodeDTO):
    models.VerificationCode.objects.update_or_create(
        request_id=code.request_id,
        defaults={
            "value": code.value,
            "expires_at": code.expires_at,
            "retry_at": code.retry_at,
        },
    )
    logger.info(f"{code} saved")


def delete_verification_code(*, request_id: str):
    models.VerificationCode.objects.filter(request_id=request_id).delete()


def get_new_verification_code(*, request_id: str):
    now = timezone.now()
    return VerificationCodeDTO(
        request_id=request_id,
        value=get_four_digit_code(),
        expires_at=now + config.VERIFICATION_CODE__EXPIRES_AFTER,
        retry_at=now + config.VERIFICATION_CODE__RETRY_AFTER,
    )


def raise_exception_if_request_too_early(*, request_id: str):
    now = timezone.now()
    code = find_verification_code(request_id=request_id)

    if code is None:
        return
    if code.retry_at <= now:
        return

    raise exceptions.VerificationCodeTryLater(wait=(code.retry_at - now))


def get_verification_message(*, code: VerificationCodeDTO):
    template: str = config.VERIFICATION_CODE__MESSAGE_TEMPLATE
    message = template.format(code=code.value)
    return message


def send_verification_code(*, code: VerificationCodeDTO):
    message = get_verification_message(code=code)
    send_message(text=message, to=code.request_id)
    logger.info(f"{code} sent")


def request_verification_code(*, request_id: str):
    raise_exception_if_request_too_early(request_id=request_id)

    code = get_new_verification_code(request_id=request_id)

    save_verification_code(code=code)

    return code


def verify_verification_code(*, request_id: str, value: str) -> bool:
    code = find_verification_code(request_id=request_id)
    if not code:
        raise exceptions.VerificationCodeNotFound
    if not compare_digest(code.value, value):
        raise exceptions.VerificationCodeInvalid
    now = timezone.now()
    if now > code.expires_at:
        raise exceptions.VerificationCodeExpired

    delete_verification_code(request_id=request_id)
    logger.info(f"{code} verified")
    return True


def is_test_user_phone(*, phone: str):
    if not config.TEST__IS_TEST_USER_PHONES_ACTIVE:
        return False
    return phone in config.TEST__TEST_USER_PHONES
