from django.urls import path

from .views.produits import (
    liste_produits,
    ajouter_produit,
    rechercher_produits,
    modifier_produit,
    supprimer_produit
)

from .views.comptes import (
    inscription,
    connexion,
    deconnexion
)

from .views.panier import (
    ajouter_panier,
    modifier_quantite,
    supprimer_panier,
    afficher_panier
)

from .views.factures import (
    commencer_modification_facture,
    annuler_modification_facture,
    confirmer_facture,
    liste_factures,
    detail_facture,
    supprimer_facture
)


urlpatterns = [
    
    path(
        "produits/rechercher/",
        rechercher_produits,
        name="rechercher_produits"
    ),

    path(
        "",
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

    path(
        "inscription/",
        inscription,
        name="inscription"
    ),

    path(
        "connexion/",
        connexion,
        name="connexion"
    ),

    path(
        "deconnexion/",
        deconnexion,
        name="deconnexion"
    ),

    path(
        "panier/ajouter/<int:produit_id>/",
        ajouter_panier,
        name="ajouter_panier"
    ),

    path(
        "panier/modifier/<int:produit_id>/",
        modifier_quantite,
        name="modifier_quantite"
    ),

    path(
        "panier/supprimer/<int:produit_id>/",
        supprimer_panier,
        name="supprimer_panier"
    ),

    path(
        "panier/",
        afficher_panier,
        name="afficher_panier"
    ),

    path(
        "facture/confirmer/",
        confirmer_facture,
        name="confirmer_facture"
    ),

    path(
        "factures/",
        liste_factures,
        name="liste_factures"
    ),

    path(
        "factures/<int:facture_id>/",
        detail_facture,
        name="detail_facture"
    ),

    path(
        "factures/<int:facture_id>/modifier/",
        commencer_modification_facture,
        name="commencer_modification_facture"
    ),

    path(
        "factures/annuler-modification/",
        annuler_modification_facture,
        name="annuler_modification_facture"
    ),

    path(
        "factures/<int:facture_id>/supprimer/",
        supprimer_facture,
        name="supprimer_facture"
    ),
]