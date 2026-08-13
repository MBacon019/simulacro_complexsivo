from rest_framework import serializers
from .models import Shows, Reservations

class ShowsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shows
        fields = ["id", "movie_title","room","price","available_seats"]

class ReservationSerializer(serializers.ModelSerializer):
    shows_nombre = serializers.CharField(source="shows.nombre", read_only=True)

    class Meta:
        model = Reservations
        fields = ["id", "shows", "show_id ", "customer_name", "seats", "status", "created_at"]