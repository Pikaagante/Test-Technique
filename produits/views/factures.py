from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.core.paginator import Paginator

from ..models import Facture, ContenuFacture, Produit


# Vérifie si l'utilisateur peut modifier une facture
def utilisateur_peut_modifier(request, facture):
    return (
        request.user.is_staff
        or facture.utilisateur == request.user
    )


# Commence la modification d'une facture
@login_required
def commencer_modification_facture(request, facture_id):

    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "Méthode non autorisée."
        }, status=405)

    facture = get_object_or_404(
        Facture,
        id=facture_id
    )

    if not utilisateur_peut_modifier(request, facture):
        return JsonResponse({
            "success": False,
            "message": "Vous n'avez pas accès à cette facture."
        }, status=403)

    contenus = ContenuFacture.objects.filter(
        facture=facture
    )

    panier = {}

    for contenu in contenus:
        panier[str(contenu.produit_id)] = contenu.quantite

    request.session["panier_avant_modification"] = (
        request.session.get("panier", {})
    )

    request.session["panier"] = panier
    request.session["facture_modification"] = facture.id
    request.session.modified = True

    return JsonResponse({
        "success": True,
        "redirect": "/"
    })


# Annule la modification d'une facture
@login_required
def annuler_modification_facture(request):

    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "Méthode non autorisée."
        }, status=405)

    ancien_panier = request.session.get(
        "panier_avant_modification",
        {}
    )

    request.session["panier"] = ancien_panier
    request.session.pop("panier_avant_modification", None)
    request.session.pop("facture_modification", None)
    request.session.modified = True

    return JsonResponse({
        "success": True
    })


# Crée ou modifie une facture
@login_required
def confirmer_facture(request):

    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "Méthode non autorisée."
        }, status=405)

    panier = request.session.get("panier", {})

    if not panier:
        return JsonResponse({
            "success": False,
            "message": "Votre panier est vide."
        }, status=400)

    facture_id = request.session.get(
        "facture_modification"
    )

    # Modification d'une facture existante
    if facture_id:

        facture = get_object_or_404(
            Facture,
            id=facture_id
        )

        if not utilisateur_peut_modifier(request, facture):
            return JsonResponse({
                "success": False,
                "message": "Vous n'avez pas accès à cette facture."
            }, status=403)

        contenus_existants = {
            contenu.produit_id: contenu
            for contenu in ContenuFacture.objects.filter(
                facture=facture
            )
        }

        produits_panier = set()

        for produit_id, quantite in panier.items():

            try:
                quantite = int(quantite)
            except (ValueError, TypeError):
                continue

            if quantite <= 0:
                continue

            produit = Produit.objects.filter(
                id=produit_id
            ).first()

            if produit is None:
                continue

            produits_panier.add(produit.id)

            if produit.id in contenus_existants:
                contenu = contenus_existants[produit.id]
                contenu.quantite = quantite
                contenu.save()

            else:
                ContenuFacture.objects.create(
                    facture=facture,
                    produit=produit,
                    quantite=quantite,
                    prix_unitaire=produit.prix
                )

        for produit_id, contenu in contenus_existants.items():

            if produit_id not in produits_panier:
                contenu.delete()

        request.session["panier"] = {}
        request.session.pop("panier_avant_modification", None)
        request.session.pop("facture_modification", None)
        request.session.modified = True

        return JsonResponse({
            "success": True,
            "facture_id": facture.id,
            "modification": True
        })

    # Création d'une nouvelle facture
    facture = Facture.objects.create(
        utilisateur=request.user
    )

    for produit_id, quantite in panier.items():

        try:
            quantite = int(quantite)
        except (ValueError, TypeError):
            continue

        if quantite <= 0:
            continue

        produit = Produit.objects.filter(
            id=produit_id
        ).first()

        if produit is None:
            continue

        ContenuFacture.objects.create(
            facture=facture,
            produit=produit,
            quantite=quantite,
            prix_unitaire=produit.prix
        )

    request.session["panier"] = {}
    request.session.modified = True

    return JsonResponse({
        "success": True,
        "facture_id": facture.id,
        "modification": False
    })


# Affiche les factures avec pagination
@login_required
def liste_factures(request):

    if request.user.is_staff:
        factures = Facture.objects.all().order_by(
            "-date_creation"
        )
    else:
        factures = Facture.objects.filter(
            utilisateur=request.user
        ).order_by("-date_creation")

    liste_factures = []

    for facture in factures:

        contenus = ContenuFacture.objects.filter(
            facture=facture
        )

        nombre_produits = 0
        total = 0

        for contenu in contenus:
            nombre_produits += contenu.quantite
            total += (contenu.prix_unitaire* contenu.quantite)

        liste_factures.append({
            "id": facture.id,
            "date": facture.date_creation,
            "utilisateur": facture.utilisateur.username,
            "nombre_produits": nombre_produits,
            "total": total,
        })

    paginator = Paginator(liste_factures, 12)
    page_number = request.GET.get("page")
    factures = paginator.get_page(page_number)

    return render(
        request,
        "produits/facture.html",
        {"factures": factures}
    )


# Affiche le détail d'une facture
@login_required
def detail_facture(request, facture_id):

    facture = get_object_or_404(
        Facture,
        id=facture_id
    )

    if not utilisateur_peut_modifier(request, facture):
        return JsonResponse({
            "success": False,
            "message": "Vous n'avez pas accès à cette facture."
        }, status=403)

    contenus = ContenuFacture.objects.filter(
        facture=facture
    ).select_related("produit")

    produits = []
    nombre_produits = 0
    total = 0

    for contenu in contenus:

        sous_total = (contenu.prix_unitaire * contenu.quantite)

        produits.append({
            "id": contenu.produit.id,
            "nom": contenu.produit.nom,
            "marque": contenu.produit.marque,
            "quantite": contenu.quantite,
            "prix_unitaire": str(contenu.prix_unitaire),
            "sous_total": str(sous_total),
        })

        nombre_produits += contenu.quantite
        total += sous_total

    return JsonResponse({
        "success": True,
        "facture": {
            "id": facture.id,
            "date": facture.date_creation.strftime(
                "%d/%m/%Y à %H:%M"
            ),
            "utilisateur": facture.utilisateur.username,
            "nombre_produits": nombre_produits,
            "total": str(total),
            "peut_modifier": utilisateur_peut_modifier(
                request,
                facture
            ),
            "peut_supprimer": utilisateur_peut_modifier(
                request,
                facture
            ),
            "produits": produits,
        }
    })


# Supprime une facture
@login_required
def supprimer_facture(request, facture_id):

    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "Méthode non autorisée."
        }, status=405)

    facture = get_object_or_404(
        Facture,
        id=facture_id
    )

    if not utilisateur_peut_modifier(request, facture):
        return JsonResponse({
            "success": False,
            "message": "Vous n'avez pas accès à cette facture."
        }, status=403)

    facture.delete()

    return JsonResponse({
        "success": True
    })