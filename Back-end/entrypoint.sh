#!/bin/sh

echo "Esperando a MySQL..."
while ! nc -z db 3306; do
  sleep 1
done
echo "MySQL está listo."
python manage.py migrate --noinput
python manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('Superusuario "admin" creado con éxito')
else:
    print('El superusuario ya existe')
EOF

exec "$@"