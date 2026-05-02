from django.contrib import admin

# Register your models here.
from .models import Sede, Espacio, Reserva

@admin.register(Sede)
class SedeAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'ubicacion')

@admin.register(Espacio)
class EspacioAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'sede', 'tipo', 'capacidad')
    list_filter = ('sede', 'tipo')

@admin.register(Reserva)
class ReservaAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'espacio', 'fecha', 'hora_inicio', 'hora_fin')
    list_filter = ('fecha', 'usuario')