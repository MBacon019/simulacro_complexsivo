from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Marca, Vehiculo
from .serializers import ShowsSerializer, ReservationSerializer
from .permissions import IsAdminOrReadOnly

class ShowsViewSet(viewsets.ModelViewSet):
    queryset = Marca.objects.all().order_by("id")
    serializer_class = ShowsSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["movie_title"]
    ordering_fields = ["id", "movie_title"]

class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Vehiculo.objects.select_related("show").all().order_by("-id")
    serializer_class = ReservationSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["show"]
    search_fields = ["movie_title", "room", "price", "available_seats"]
    ordering_fields = ["id", "show_id", "customer_name", "seats", "status","created_at"]

    def get_queryset(self):
        qs = super().get_queryset()
        available_seats_min = self.request.query_params.get("available_seats_min")
        available_seats_max = self.request.query_params.get("available_seats_max")
        if available_seats_min:
            qs = qs.filter(anio__gte=int(available_seats_min))
        if available_seats_max:
            qs = qs.filter(anio__lte=int(available_seats_max))
        return qs

    def get_permissions(self):
        # Público: SOLO listar vehículos
        if self.action == "list":
            return [AllowAny()]
        return super().get_permissions()