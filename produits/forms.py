from django import forms

from .models import Produit


class ProduitForm(forms.ModelForm):

    class Meta:
        model = Produit

        fields = [
            "categorie",
            "nom",
            "marque",
            "description",
            "prix",
            "gramme",
            "prixkg",
            "litre",
            "prixlitre",
            "date_peremption",
            "image",
            "origine",
            "nutriscore",
            "bio",
            "label_rouge",
            "aop",
            "igp",
        ]

        widgets = {
            "date_peremption": forms.DateInput(
                attrs={"type": "date"}
            ),
        }