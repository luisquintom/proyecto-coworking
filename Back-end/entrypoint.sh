#!/bin/sh

# Esperar a que la base de datos esté lista
echo "Esperando a MySQL..."
while ! nc -z db 3306; do
  sleep 1
done
echo "MySQL está listo."

# Aplicar migraciones
python manage.py migrate --noinput

# Crear superusuario automáticamente si no existe
# Usamos variables de entorno para seguridad
python manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('Superusuario "admin" creado con éxito')
else:
    print('El superusuario ya existe')
EOF

# Iniciar el servidor
exec "$@"