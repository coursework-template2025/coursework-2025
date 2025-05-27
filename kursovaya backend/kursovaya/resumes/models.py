from django.db import models
from django.contrib.auth.models import User
class Resume(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255)
    date_of_birth = models.DateField(null=True, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=255, null=True, blank=True)
    summary = models.TextField()
    skills = models.TextField()
    experience = models.TextField(blank=True, null=True)
    education = models.TextField(blank=True, null=True)
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    hobby = models.TextField(default="None")
    project = models.TextField(default="None")