from django.urls import path

from systems.api import views


urlpatterns = [
    path("server-access/", views.ServiceVersionView.as_view(), name="server-access"),
    path("stats/", views.stats, name="stats")
]

