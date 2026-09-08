import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Ex2.settings")
django.setup()

from django.conf import settings
from produits.models import Produit


def normaliser(texte):
    import unicodedata

    texte = texte.replace("Œ", "OE").replace("œ", "oe")
    texte = texte.replace("Æ", "AE").replace("æ", "ae")

    texte = unicodedata.normalize("NFD", texte)
    texte = "".join(
        caractere
        for caractere in texte
        if unicodedata.category(caractere) != "Mn"
    )

    return (
        texte.lower()
        .replace(" ", "-")
        .replace("'", "")
    )


dossier_images = os.path.join(settings.MEDIA_ROOT, "produits")

images = os.listdir(dossier_images)

images_normalisees = {}

for image in images:
    if image.lower().endswith(".png"):
        nom = os.path.splitext(image)[0]
        nom_normalise = normaliser(nom)

        # On privilégie le fichier sans suffixe
        if nom_normalise not in images_normalisees:
            images_normalisees[nom_normalise] = image
        elif "_" in image:
            continue
        else:
            images_normalisees[nom_normalise] = image


for produit in Produit.objects.all():
    nom_normalise = normaliser(produit.nom)
    image = images_normalisees.get(nom_normalise)

    if image:
        produit.image = f"produits/{image}"
        produit.save()

        print(f"✓ {produit.nom} -> {image}")
    else:
        print(f"✗ Image introuvable : {produit.nom}")

