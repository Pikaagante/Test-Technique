from django.shortcuts import render
from django.core.paginator import Paginator
from django.db.models import Q

from .models import Produit


def liste_produits(request):

    produits = Produit.objects.all()

    recherche = request.GET.get("recherche", "")
    categories = request.GET.getlist("categorie")
    prix_min = request.GET.get("prix_min", "")
    prix_max = request.GET.get("prix_max", "")
    nutriscores = request.GET.getlist("nutriscore")
    labels = request.GET.getlist("label")
    origines = request.GET.getlist("origine")

    if recherche:
        produits = produits.filter(
            Q(nom__icontains=recherche) |
            Q(marque__icontains=recherche)
        )

    if categories:
        produits = produits.filter(
            categorie__in=categories
        )

    if prix_min:
        produits = produits.filter(
            prix__gte=prix_min
        )

    if prix_max:
        produits = produits.filter(
            prix__lte=prix_max
        )

    if nutriscores:
        produits = produits.filter(
            nutriscore__in=nutriscores
        )

    if origines:
        produits = produits.filter(
            origine__in=origines
        )

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
    })