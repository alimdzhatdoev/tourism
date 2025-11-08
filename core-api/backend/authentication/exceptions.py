from datetime import timedelta
from typing import Union

from rest_framework.exceptions import AuthenticationFailed, NotFound, Throttled


class VerificationCodeNotFound(NotFound):
    default_detail = "Сперва запросите код подтверждения"
    default_code = "code_not_found"


class VerificationCodeInvalid(AuthenticationFailed):
    default_detail = "Неверный код подтверждения"
    default_code = "code_invalid"


class VerificationCodeExpired(AuthenticationFailed):
    default_detail = "Срок действия кода подтверждения истек"
    default_code = "code_expired"


class VerificationCodeTryLater(Throttled):
    default_code = "try_later"

    def __init__(self, wait: timedelta = None, detail: str = None, code: str = None):
        wait_verbose = self.get_wait_verbose(wait)
        detail = detail or f"Повторите попытку {wait_verbose}"
        super().__init__(detail=detail)

    @staticmethod
    def get_wait_verbose(wait: Union[timedelta, None] = None):
        if wait is None:
            return "позже"
        seconds = wait.seconds
        if seconds == 1:
            return "через 1 секунду"
        if 2 <= seconds <= 4:
            return f"через {seconds} секунды"
        if seconds == 0 or seconds >= 5:
            return f"через {seconds} секунд"
