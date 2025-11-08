import os
from typing import Any, Dict

from authentication.models import User
from django.core.mail import send_mail
from django.template.loader import render_to_string
from bookings.models import ExcursionBooking
from common.choices import PaymentMethodChoices

from config import settings


def get_message_data(booking: ExcursionBooking) -> Dict[str, Any]:
    payment_kind_dict = {
        PaymentMethodChoices.CASH: "наличные",
        PaymentMethodChoices.CARD: "оплата картой",
    }
    months = {
        1: "января",
        2: "февраля",
        3: "марта",
        4: "апреля",
        5: "мая",
        6: "июня",
        7: "июля",
        8: "августа",
        9: "сентября",
        10: "октября",
        11: "ноября",
        12: "декабря",
    }

    excursion = booking.excursion_time.excursion_date.excursion
    if excursion.attraction:
        excursion_type = "Место"
        excursion_name = excursion.attraction.name
        address = excursion.attraction.location.formatted or "-"
    elif excursion.route:
        excursion_type = "Маршрут"
        excursion_name = excursion.route.name
        territory = excursion.route.territory
        if territory:
            address = territory.region.region 
            if territory.city:
                address = f"{address}, {territory.city.city}"
        else:
            address = "-"
    else:
        excursion_type = "Место"
        excursion_name = "-"
        address = "-"

    customer: User = booking.created_by

    data = {
        "id": booking.id,
        "type": excursion_type,
        "name": excursion_name,
        "address": address,
        "date": f"{booking.date.day} {months[booking.date.month]}",
        "time": booking.time.strftime("%H:%M"),
        "visitors": booking.visitors,
        "user_full_name": str(customer),
        "phone": customer.phone or "-",
        "email": customer.email,
        "total_price": booking.total_price,
        "payment_kind": payment_kind_dict[booking.payment_kind]
    }
    return data


def get_message(data: Dict[str, Any]):
    text = """Бронировние: #%(id)s
%(type)s: %(name)s
Адрес: %(address)s
Дата и время: %(date)s в %(time)s
Количество человек: %(visitors)s чел
ФИО: %(user_full_name)s
Телефон: %(phone)s
Почта: %(email)s
Стоимость: %(total_price)s руб
Тип оплаты: %(payment_kind)s"""
    return text % data


def send_booking_details_message(booking: ExcursionBooking, action: str):
    data = get_message_data(booking)

    title_dict = {
        "create": f"Новое бронирование #{booking.id}",
        "update": f"Изменения в бронировании #{booking.id}",
    }
    title = title_dict[action]
    data.update(title=title)

    message = get_message(data)
    html_message = render_to_string(
        os.path.join(settings.TEMPLATES_DIR, "email", "booking_info.html"), data,
    )

    send_mail(
        f"VISITKCHR. {title}",
        message,
        os.getenv("EMAIL_HOST_USER"),
        [os.getenv("ORDER_NOTIFICATION_EMAIL")],
        html_message=html_message,
        fail_silently=False
    )
