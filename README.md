# App Coworking Spaces - Gestión Integral (Django + React + Docker)

Proyecto del Máster de Desarrollo Web y Aplicaciones. Esta aplicación permite la gestión de sedes, espacios de trabajo y reservas en tiempo real, optimizada mediante contenedores para facilitar su despliegue y escalabilidad.

## Funcionalidades

-   **Gestión de Sedes (`/sedes`)**: Visualización y administración de las diferentes ubicaciones físicas del coworking.
    
-   **Reserva de Espacios (`/reservas`)**: Sistema para que los usuarios reserven escritorios o salas de juntas según disponibilidad, fecha y hora.
    
-   **Autenticación Segura**: Implementación de **JWT (JSON Web Tokens)** para el acceso protegido de usuarios y gestión de sesiones.
    
-   **Arquitectura de Contenedores**: Uso de **Docker Compose** para orquestar el backend, frontend y la base de datos de forma aislada.
    
-   **API RESTful**: Backend robusto que comunica los modelos de datos con el cliente mediante endpoints optimizados.
    

## Tecnologías Utilizadas

-   **Django 4.2** (Framework Backend)
    
-   **React + Vite** (Librería Frontend de alta velocidad)
    
-   **MySQL 8.0** (Motor de base de datos relacional para persistencia)
    
-   **Docker & Docker Compose** (Virtualización y despliegue)
    
## Instalación y Ejecución

Sigue estos pasos para ejecutar la infraestructura completa en tu máquina local:

**1. Clonar el repositorio:**

Bash

```
git clone https://github.com/luisquintom/proyecto-coworking
cd proyecto-coworking

```

**2. Configurar variables de entorno:** Crea un archivo `.env` en la raíz del proyecto para que Docker y Django puedan configurar la conexión segura. **Importante:** Este archivo no se incluye en el control de versiones por seguridad.

Bash

```
# Ejemplo de contenido del .env
MYSQL_DATABASE=coworking_db
MYSQL_USER=coworking_user
MYSQL_PASSWORD=coworking_pass
MYSQL_ROOT_PASSWORD=rootpass
MYSQL_HOST=db
DEBUG=True
SECRET_KEY=tu_clave_secreta_aqui
VITE_API_URL=http://localhost:8000/api/

```

**3. Lanzar la aplicación con Docker:**

Bash

```
docker-compose up --build

```

La aplicación estará disponible en:

-   **Frontend:** http://localhost:5173
    
-   **Backend (API):** http://localhost:8000/api/
    

**4. Aplicar migraciones iniciales:**

Una vez los contenedores estén corriendo, inicializa la estructura de la base de datos:

Bash

```
docker-compose exec backend python manage.py migrate

```

## Estructura del Proyecto

Fragmento de código

```
/                    # Raíz con docker-compose.yml y .env
├── Back-end/        # Código fuente Django (config, usuarios, coworking)
│   ├── config/      # Ajustes principales (settings.py, urls.py)
│   ├── coworking/   # App para sedes, espacios y reservas
│   └── usuarios/    # App para gestión de usuarios y perfiles
├── Front-end/       # Aplicación React (Vite)
│   ├── src/api/     # Configuración de Axios e interceptores
│   ├── src/pages/   # Vistas de Sedes, Reservas y Auth
│   └── src/components/
└── .gitignore       # Exclusión de node_modules, __pycache__ y .env

```

Desarrollado por Luis Enrique Quinto.