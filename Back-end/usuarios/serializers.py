from django.contrib.auth.models import User
from rest_framework import serializers

class RegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        # Campos solicitados: Nombres, Apellidos, Correo y Contraseña
        fields = ['first_name', 'last_name', 'email', 'password']

    def create(self, validated_data):
        # Usamos el email como 'username' 
        user = User.objects.create_user(
            username=validated_data['email'], 
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password']
        )
        return user