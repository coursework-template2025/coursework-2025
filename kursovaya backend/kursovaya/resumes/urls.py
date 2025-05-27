# resumes/urls.py
from django.urls import path
from . import views
urlpatterns = [
    path('', views.home_view, name='home'),
    path('resumes/', views.resume_list, name='resume_list'),
    path('resumes/<int:pk>/', views.resume_detail, name='resume_detail'),
    path('resumes/create/', views.resume_form, name='resume_create'),
    path('resumes/<int:pk>/edit/', views.resume_form, name='resume_edit'),
    path('resumes/<int:pk>/delete/', views.resume_delete, name='resume_delete'),
    path('resumes/<int:pk>/export_docx/', views.export_resume_docx, name='export_resume'),
    path('register/', views.register, name='register'),
    path('profile/', views.user_profile_view, name='user_profile'),
    path('logout/', views.custom_logout, name='logout'),
    path('login/', views.user_login, name='login'),
    path('', views.index, name='index'),
]