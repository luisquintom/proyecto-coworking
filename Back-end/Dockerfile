FROM python:3.11-slim

# Instalamos netcat para el script de espera y dependencias de mysql
RUN apt-get update && apt-get install -y netcat-traditional gcc default-libmysqlclient-dev pkg-config && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Primero las dependencias (Caché de Docker)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos el código y el script
COPY . .
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]