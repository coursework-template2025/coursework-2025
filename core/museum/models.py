from django.db import models


class Category(models.Model):
    name = models.CharField(
        max_length=100
    )
    
    def __str__(self):
        return self.name


class Museum(models.Model):
    title = models.CharField(
        max_length=100
    )
    short_description = models.CharField(
        max_length=1000
    )
    description = models.TextField()
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to='media/museum_image/')
    created_date = models.DateTimeField(
        auto_now_add=True
    )
    updated_date = models.DateTimeField(
        auto_now=True
    )
    
    def __str__(self):
        return f'{self.title} | {self.id}'
