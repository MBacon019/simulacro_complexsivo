from django.db import models


class Shows(models.Model):
    movie_title = models.CharField(max_length=120, unique=True)
    room = models.CharField(max_length=20, unique=True)
    price = models.DecimalField(
        max_digits=10,  # total de dígitos
        decimal_places=2,  # decimales
        default=0
    )
    available_seats = models.IntegerField(
        null=True, blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(120)]
    )

    def __str__(self):
        return f"{self.shows.movie_title} {self.room} ({self.price})"
    


class Reservations(models.Model):
    show_id = models.ForeignKey(Shows, on_delete=models.PROTECT, related_name="Reservations")
    customer_name =models.CharField(max_length=120, unique=True)
    seats = models.IntegerField()
    class Estado(models.TextChoices):
        RESERVED = "reserved", "Reserved"
        CONFIRMED = "confirmed", "Confirmed"
        CANCELLED = "cancelled ", "Cancelled"
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.shows.movie_title} {self.customer_name} ({self.seats})"