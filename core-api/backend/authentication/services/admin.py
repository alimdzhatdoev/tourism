def is_admin(user):
    if user is None:
        return False
    return user.is_superuser or user.is_staff
