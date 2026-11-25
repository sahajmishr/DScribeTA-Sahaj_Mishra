from django.http import JsonResponse
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import PatientViewSet

router = DefaultRouter()
router.register("patients", PatientViewSet, basename="patient")


def health(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("health/", health),
    path("", include(router.urls)),
]