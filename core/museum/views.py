from django.shortcuts import render, get_object_or_404, redirect

from .models import Museum
from .forms import MuseumForm

from django.shortcuts import render
from .models import Museum, Category
from django.db.models import Q

def main(request):
    query = request.GET.get('q', '')
    category_id = request.GET.get('category', '')

    museums = Museum.objects.all()

    if query:
        museums = museums.filter(
            Q(title__icontains=query) |
            Q(short_description__icontains=query)
        )

    if category_id:
        museums = museums.filter(category__id=category_id)

    categories = Category.objects.all()

    return render(request, 'museum/index.html', {
        'museums': museums,
        'categories': categories,
        'query': query,
        'selected_category': category_id
    })



def detail(request, pk):

    museum = get_object_or_404(Museum, id=pk)
    museum_update_form = MuseumForm(instance=museum)

    return render(request, 'museum/museum_detail.html', context={'museum': museum, 'museum_update_form': museum_update_form})

def museum_update(request, pk):
    museum = get_object_or_404(Museum, id=pk)

    if request.method == 'POST':
        form = MuseumForm(request.POST, request.FILES, instance=museum)
        if form.is_valid():
            form.save()
            return redirect('museum_detail', pk)


    return redirect('museum_detail', pk)

def museum_delete(request, pk):
    museum = get_object_or_404(Museum, id=pk)
    
    if museum:
        museum.delete()
        
        return redirect('index')

def museum_create(request):
    if request.method == 'POST':
        form = MuseumForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('index')
    else:
        form = MuseumForm()

    return render(request, 'museum/museum_create.html', {'form': form})