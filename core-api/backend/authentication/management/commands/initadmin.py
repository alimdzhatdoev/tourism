from django.core.management.base import BaseCommand

from authentication.models import User


class Command(BaseCommand):
    def handle(self, *args, **options):
        if not User.objects.filter(email="admin@example.com"):
            print("Creating admin account...")
            user = User.objects.create(
                email="admin@example.com",
                first_name="admin",
                last_name="admin",
                is_active=True,
                is_superuser=True,
                is_staff=True,
            )
            user.set_password("admin")
            user.save()
        else:
            print("Admin already initialized")
