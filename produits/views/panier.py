from django.shortcuts import get_object_or_404
from django.http import JsonResponse

from ..models import Produit


# Ajoute un produit au panier
def ajouter_panier(request, produit_id):

    produit = get_object_or_404(
        Produit,
        id=produit_id
    )

    panier = request.session.get(
        "panier",
        {}
    )

    produit_id = str(produit.id)

    panier[produit_id] = (
        panier.get(produit_id, 0) + 1
    )

    request.session["panier"] = panier
    request.session.modified = True

    return JsonResponse({
        "success": True
    })


# Modifie la quantité d'un produit
def modifier_quantite(request, produit_id):

    get_object_or_404(
        Produit,
        id=produit_id
    )

    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "Méthode non autorisée."
        }, status=405)

    panier = request.session.get(
        "panier",
        {}
    )

    produit_id = str(produit_id)

    try:
        quantite = int(
            request.POST.get(
                "quantite",
                1
            )
        )
    except (ValueError, TypeError):
        return JsonResponse({
            "success": False,
            "message": "Quantité invalide."
        }, status=400)

    if quantite <= 0:
        panier.pop(produit_id, None)
    else:
        panier[produit_id] = quantite

    request.session["panier"] = panier
    request.session.modified = True

    return JsonResponse({
        "success": True
    })


# Supprime un produit du panier
def supprimer_panier(request, produit_id):

    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "Méthode non autorisée."
        }, status=405)

    panier = request.session.get(
        "panier",
        {}
    )

    produit_id = str(produit_id)

    panier.pop(
        produit_id,
        None
    )

    request.session["panier"] = panier
    request.session.modified = True

    return JsonResponse({
        "success": True
    })


# Récupère le contenu du panier
def afficher_panier(request):

    panier = request.session.get(
        "panier",
        {}
    )

    produits = Produit.objects.filter(
        id__in=panier.keys()
    )

    liste = []
    nombre_produits = 0
    total = 0

    for produit in produits:

        quantite = panier.get(
            str(produit.id),
            0
        )

        sous_total = (
            produit.prix * quantite
        )

        liste.append({
            "id": produit.id,
            "nom": produit.nom,
            "marque": produit.marque,
            "prix": str(produit.prix),
            "quantite": quantite,
            "sous_total": str(sous_total),
        })

        nombre_produits += quantite
        total += sous_total

    return JsonResponse({
        "produits": liste,
        "nombre_produits": nombre_produits,
        "total": str(total),
        "modification": request.session.get(
            "facture_modification"
        )
    })