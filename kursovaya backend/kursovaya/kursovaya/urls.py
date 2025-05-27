from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    path('', include('resumes.urls')),  # теперь начальная и другие страницы через resumes.urls
    # path('accounts/', include('django.contrib.auth.urls')),  логин/логаут от Django
]
