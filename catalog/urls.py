from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ShowsViewSet, ReservationViewSet

router = DefaultRouter()
router.register(r"Shows", ShowsViewSet, basename="Shows")
router.register(r"Reservations", ReservationViewSet, basename="Reservations")

urlpatterns = [
    # Mongo
    path("service-types/", catalogo_types_list_create),
    path("service-types/<str:id>/", catalogo_types_detail),
    path("vehicle-services/", eventos_services_list_create),
    path("vehicle-services/<str:id>/", eventos_services_detail),
]
urlpatterns += router.urls