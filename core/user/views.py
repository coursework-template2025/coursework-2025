from django.shortcuts import get_object_or_404, render, redirect

from .models import MyUser
from .forms import RegisterForm, LoginForm

from django.contrib.auth import login, logout, authenticate

def profile(request):
    user = get_object_or_404(MyUser, id=request.user.id)
    return render(request, 'user/profile.html', {'profile_user': user})

def register_view(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.save()
            return redirect('index') 
    else:
        form = RegisterForm()
    return render(request, 'user/register.html', {'form': form})

def user_logout_view(request):
    logout(request)
    
    return redirect('index')

def login_view(request):
    error = None
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            user = authenticate(request, email=email, password=password)
            if user is not None:
                login(request, user)
                return redirect('index')
            else:
                error = 'Неверный email или пароль'
    else:
        form = LoginForm()

    return render(request, 'user/login.html', {'form': form, 'error': error})
