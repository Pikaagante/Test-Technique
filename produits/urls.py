from django.urls import path
from . import views

urlpatterns = [
    path("produits/", views.liste_produits, name="liste_produits"),
]