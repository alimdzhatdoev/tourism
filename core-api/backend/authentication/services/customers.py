from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

User = get_user_model()


def get_customer_group():
    group, _ = Group.objects.get_or_create(name="Customer")
    return group


def get_or_create_customer(*, phone: str):
    user, is_created = User.objects.get_or_create(
        phone=phone, defaults={"is_active": True, "username": phone}
    )
    if is_created:
        customer_group = get_customer_group()
        user.groups.add(customer_group)
    return user


def get_all_customers():
    customer_group = get_customer_group()
    return User.objects.filter(groups=customer_group).all()
