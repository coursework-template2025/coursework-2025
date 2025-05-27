from django.urls import path

from .views import profile, register_view, user_logout_view, login_view

urlpatterns = [
    path('profile/', profile, name='profile'),
    path('register/', register_view, name='register'),
    path('logout/', user_logout_view, name='logout'),
    path('login/', login_view, name='login')
]
