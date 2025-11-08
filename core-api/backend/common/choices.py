from django.db import models


class BaseTextChoices(models.TextChoices):
    @classmethod
    def max_length(cls):
        return max([len(v) for v in cls.values])


class WeekDayChoices(models.IntegerChoices):
    MONDAY = 1, "Monday"
    TUESDAY = 2, "Tuesday"
    WEDNESDAY = 3, "Wednesday"
    THURSDAY = 4, "Thursday"
    FRIDAY = 5, "Friday"
    SATURDAY = 6, "Saturday"
    SUNDAY = 7, "Sunday"


class TenGradeChoices(models.IntegerChoices):
    ONE = 1
    TWO = 2
    THREE = 3
    FOUR = 4
    FIVE = 5
    SIX = 6
    SEVEN = 7
    EIGHT = 8
    NINE = 9
    TEN = 10


class FiveGradeChoices(models.IntegerChoices):
    ONE = 1
    TWO = 2
    THREE = 3
    FOUR = 4
    FIVE = 5


class CurrencyChoices(BaseTextChoices):
    RUB = "RUB", "rub"
    EUR = "EUR", "eur"
    USD = "USD", "usd"
    GBP = "GBP", "gbp"
    UAH = "UAH", "uah"
    BYR = "BYR", "byr"
    BYN = "BYN", "byn"
    KZT = "KZT", "kzt"
    AZN = "AZN", "azn"
    CHF = "CHF", "chf"
    CZK = "CZK", "czk"
    CAD = "CAD", "cad"
    PLN = "PLN", "pln"
    SEK = "SEK", "sek"
    TRY = "TRY", "try"
    CNY = "CNY", "cny"
    INR = "INR", "inr"
    BRL = "BRL", "brl"
    ZAR = "ZAR", "zar"
    UZS = "UZS", "uzs"
    BGN = "BGN", "bgn"
    RON = "RON", "ron"
    AUD = "AUD", "aud"
    HKD = "HKD", "hkd"
    GEL = "GEL", "gel"
    KGS = "KGS", "kgs"
    AMD = "AMD", "amd"
    AED = "AED", "aed"


class CultureNameChoices(BaseTextChoices):
    RU_RU = "ru-RU"
    EN_US = "en-US"
    KK = "kk"
    UK = "uk"
    PL = "pl"
    VI = "vi"
    TR = "tr"


class PaymentMethodChoices(BaseTextChoices):
    CASH = "CASH", "Cash"
    CARD = "CARD", "Card"
