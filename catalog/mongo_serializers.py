from rest_framework import serializers

class CatalogoSerializer(serializers.Serializer):
    movie_title = serializers.CharField(max_length=120)
    genre = serializers.CharField(max_length=120)
    duration_min = serializers.IntegerField()
    rating = serializers.CharField(max_length=120)   
    is_active = serializers.BooleanField(default=True)

class EventosSerializer(serializers.Serializer):
    _id  = serializers.IntegerField()        # ID de Vehiculo (Postgres)
    reservation_id = serializers.CharField()
    class event_type:
        CREADO = "CREATED"
        CONFIRMADO = "CONFIRMED"
        CANCELADO = "CANCELLED"
        CHECKED_IN = "CHECKED_IN"

        CHOICES = [
            (CREADO, "CREADO"),
            (CONFIRMADO, "CONFIRMADO"),
            (CANCELADO, "CANCELADO"),
            (CHECKED_IN, "CHECKED_IN"),
        ]# ObjectId (string) de service_types
    class source:
                WEB = "WEB"
                MOBILE = "MOBIL"
                SYSTEM = "SISTEMA"
        
                CHOICES = [
                    (WEB, "CREADO"),
                    (MOBILE, "CONFIRMADO"),
                    (SYSTEM, "CANCELADO"),
                ]
    created_at = serializers.DateField(required=False)    # No se envía desde el cliente; el backend asigna la fecha actual al crear
    notes = serializers.CharField(required=False, allow_blank=True)