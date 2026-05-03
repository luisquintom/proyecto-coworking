from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Sede, Espacio, Reserva

class SedeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sede
        fields = '__all__'

class EspacioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Espacio
        fields = '__all__'

class ReservaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reserva
        fields = '__all__'
    
    def validate(self, data):
        """
        Validación: Evita que dos personas reserven 
        el mismo espacio en el mismo rango de tiempo.
        """
        espacio = data.get('espacio')
        fecha = data.get('fecha')
        inicio_nuevo = data.get('hora_inicio')
        fin_nuevo = data.get('hora_fin')

        # Buscamos en la base de datos si existen choques
        solapamientos = Reserva.objects.filter(
            espacio=espacio,
            fecha=fecha,
            hora_inicio__lt=fin_nuevo,
            hora_fin__gt=inicio_nuevo
        )

        # Si estamos editando una reserva, excluimos la reserva actual de la búsqueda
        if self.instance:
            solapamientos = solapamientos.exclude(pk=self.instance.pk)

        if solapamientos.exists():
            raise serializers.ValidationError(
                "El espacio ya está ocupado en este rango horario."
            )

        return data    

# para el registro de ususario        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Usamos create_user para que contraseña encriptada
        user = User.objects.create_user(**validated_data)
        return user        