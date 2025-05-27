from django import forms
from .models import Museum

class MuseumForm(forms.ModelForm):
    class Meta:
        model = Museum
        fields = ['title', 'short_description', 'description', 'category', 'image']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-input'}),
            'short_description': forms.Textarea(attrs={'class': 'form-input', 'rows': 3}),
            'description': forms.Textarea(attrs={'class': 'form-input', 'rows': 6}),
            'category': forms.Select(attrs={'class': 'form-input'}),
            'image': forms.ClearableFileInput(attrs={'class': 'form-input'}),
        }
