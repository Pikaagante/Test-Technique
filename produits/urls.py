from django.urls import path

from .views.produits import (
    liste_produits,
    ajouter_produit,
    modifier_produit,
    supprimer_produit,
)


urlpatterns = [
    path(
        "produits/",
        liste_produits,
        name="liste_produits"
    ),

    path(
        "produits/ajouter/",
        ajouter_produit,
        name="ajouter_produit"
    ),

    path(
        "produits/<int:produit_id>/modifier/",
        modifier_produit,
        name="modifier_produit"
    ),

    path(
        "produits/<int:produit_id>/supprimer/",
        supprimer_produit,
        name="supprimer_produit"
    ),
]