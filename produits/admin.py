from django.contrib import admin
from .models import Produit, Facture, ContenuFacture

admin.site.register(Produit)
admin.site.register(Facture)
admin.site.register(ContenuFacture)