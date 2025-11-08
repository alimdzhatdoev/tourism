from django.contrib.auth.models import Group
from rest_framework.exceptions import APIException


def get_customer_group_or_404():
    customer_group = Group.objects.filter(name="Customer")
    if not customer_group.exists():
        raise APIException(
            {
                "error": "500 server error",
                "detail": "customer group does not exist",
            },
        )
    else:
        return customer_group.first()
