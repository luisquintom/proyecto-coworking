from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SedeViewSet, EspacioViewSet, ReservaViewSet

router = DefaultRouter()
router.register(r'sedes', SedeViewSet)
router.register(r'espacios', EspacioViewSet)
router.register(r'reservas', ReservaViewSet, basename='reserva')

urlpatterns = [
    path('', include(router.urls)),
]