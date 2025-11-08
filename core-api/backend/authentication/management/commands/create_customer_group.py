from django.contrib.auth.models import Group
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    def handle(self, *args, **options):
        if not Group.objects.filter(name="Customer"):
            print("Creating Customer group...")
            Group.objects.create(name="Customer")
        else:
            print("Customer group already initialized")
