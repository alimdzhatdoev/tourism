from rest_framework import serializers

from systems.models import ServiceVersion


class ServiceVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceVersion
        fields = ["service", "version"]


class StatsSerializer(serializers.Serializer):
    attractions_published = serializers.CharField(read_only=True)
    attractions_popular = serializers.CharField(read_only=True)
    routes_published = serializers.CharField(read_only=True)
    routes_popular = serializers.CharField(read_only=True)
    excursions_available = serializers.CharField(read_only=True)
