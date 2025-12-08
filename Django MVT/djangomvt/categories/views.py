from django.shortcuts import render

from django.utils.text import slugify
from unidecode import unidecode
from .models import Category

# Create your views here.
def show_categories(request):
    categories = Category.objects.all()
    return render(request, 'categories.html', {'categories': categories})


def add_category(request):
    if request.method == 'POST':
        myData = request.POST
        name = myData.get('name')
        image = request.FILES.get('image')
        slug = slugify(unidecode(name))
        category = Category(name=name, image=image)
        print("request -- post", request)
    
    return render(request, 'add_category.html')