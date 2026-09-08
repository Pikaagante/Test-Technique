from django.shortcuts import render, redirect, get_object_or_404
from django.core.paginator import Paginator
from django.db.models import Q
from django.http import JsonResponse

from ..models import Produit
from ..forms import ProduitForm

# Affiche les produits avec filtres et pagination
def liste_produits(request):

    produits = Produit.objects.all()

    recherche = request.GET.get("recherche", "")
    categories = request.GET.getlist("categorie")
    prix_min = request.GET.get("prix_min", "")
    prix_max = request.GET.get("prix_max", "")
    nutriscores = request.GET.getlist("nutriscore")
    labels = request.GET.getlist("label")
    origines = request.GET.getlist("origine")

    facture_id = request.GET.get("modifier_facture")

    if recherche:
        produits = produits.filter(
            Q(nom__icontains=recherche) |
            Q(marque__icontains=recherche)
        )

    if categories:
        produits = produits.filter(categorie__in=categories)

    if prix_min:
        produits = produits.filter(prix__gte=prix_min)

    if prix_max:
        produits = produits.filter(prix__lte=prix_max)

    if nutriscores:
        produits = produits.filter(nutriscore__in=nutriscores)

    if origines:
        produits = produits.filter(origine__in=origines)

    for label in labels:
        if label in ["bio", "label_rouge", "aop", "igp"]:
            produits = produits.filter(
                **{label: True}
            )

    paginator = Paginator(produits, 12)
    page_number = request.GET.get("page")
    produits = paginator.get_page(page_number)

    query_params = request.GET.copy()
    query_params.pop("page", None)

    return render(request, "produits/liste.html", {
        "produits": produits,
        "query_params": query_params.urlencode(),
        "categories": Produit.CATEGORIE_CHOICES,
        "selected_categories": categories,
        "nutriscores": Produit.NUTRISCORE_CHOICES,
        "selected_nutriscores": nutriscores,
        "selected_labels": labels,
        "selected_origines": origines,
        "recherche": recherche,
        "prix_min": prix_min,
        "prix_max": prix_max,
        "facture_id": facture_id,
    })


# Ajoute un produit
def ajouter_produit(request):

    if not request.user.is_staff:
        return redirect("liste_produits")

    if request.method == "POST":
        formulaire = ProduitForm(
            request.POST,
            request.FILES
        )

        if formulaire.is_valid():
            formulaire.save()
            return redirect("liste_produits")

    else:
        formulaire = ProduitForm()

    return render(request, "produits/ajouter.html", {
        "formulaire": formulaire
    })


# Modifie un produit
def modifier_produit(request, produit_id):

    if not request.user.is_staff:
        return redirect("liste_produits")

    produit = get_object_or_404(
        Produit,
        id=produit_id
    )

    if request.method == "POST":
        formulaire = ProduitForm(
            request.POST,
            request.FILES,
            instance=produit
        )

        if formulaire.is_valid():
            formulaire.save()
            return redirect("liste_produits")

    else:
        formulaire = ProduitForm(
            instance=produit
        )

    return render(request, "produits/modifier.html", {
        "formulaire": formulaire,
        "produit": produit
    })


# Supprime un produit
def supprimer_produit(request, produit_id):

    if not request.user.is_staff:
        return redirect("liste_produits")

    produit = get_object_or_404(
        Produit,
        id=produit_id
    )

    if request.method == "POST":
        produit.delete()

    return redirect("liste_produits")


# Recherche dynamique des produits
def rechercher_produits(request):

    recherche = request.GET.get(
        "recherche",
        ""
    ).strip()

    produits = Produit.objects.all()

    if recherche:
        produits = produits.filter(
            Q(nom__icontains=recherche) |
            Q(marque__icontains=recherche)
        )

    resultat = []

    for produit in produits:
        resultat.append({
            "id": produit.id,
            "nom": produit.nom,
            "marque": produit.marque,
            "prix": str(produit.prix),
            "image": produit.image.url if produit.image else "",
        })

    return JsonResponse({
        "produits": resultat
    })