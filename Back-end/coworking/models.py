from django.db import models

# Create your models here.

from django.db import models
from django.contrib.auth.models import User 

class Sede(models.Model):
    nombre = models.CharField(max_length=100)
    ubicacion = models.CharField(max_length=200)

    def __str__(self):
        return self.nombre

class Espacio(models.Model):
    # Un espacio pertenece a una sola sede
    sede = models.ForeignKey(Sede, on_delete=models.CASCADE, related_name='espacios')
    nombre = models.CharField(max_length=100)
    tipo = models.CharField(max_length=50) # escritorio, sala de juntas, sala de reuniones, etc
    capacidad = models.IntegerField()

    def __str__(self):
        return f"{self.nombre} - {self.sede.nombre}"

class Reserva(models.Model):
    # La reserva une a un usuario con un espacio en un tiempo dado
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    espacio = models.ForeignKey(Espacio, on_delete=models.CASCADE)
    fecha = models.DateField()
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()

    def __str__(self):
        return f"Reserva de {self.usuario.username} en {self.espacio.nombre}"