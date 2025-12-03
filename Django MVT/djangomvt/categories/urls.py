from django.urls import path
from . import views

app_name="categories"

urlpatterns = [
    path('', views.show_categories, name='show_categories'),
]