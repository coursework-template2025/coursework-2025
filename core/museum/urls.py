from django.urls import path

from .views import main, detail, museum_update, museum_delete, museum_create

urlpatterns = [
    path('museums/', main, name='index'),
    path('museum/<int:pk>/', detail, name='museum_detail'),
    path('museum/update/<int:pk>/', museum_update, name='museum_update'),
    path('museum/delete/<int:pk>/', museum_delete, name='museum_delete'),
    path('museum/create/', museum_create, name='museum_create')
]
