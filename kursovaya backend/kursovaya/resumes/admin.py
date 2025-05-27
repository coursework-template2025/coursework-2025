from django.contrib import admin
from .models import Resume

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'is_public', 'user', 'created_at')
    list_filter = ('is_public', 'created_at')
    search_fields = ('full_name', 'email')
    list_editable = ('is_public',)
    fields = (
        'user', 'full_name', 'email', 'phone', 'date_of_birth', 'address',
        'summary', 'skills', 'experience', 'education', 'is_public',
        'hobby', 'project'
    )