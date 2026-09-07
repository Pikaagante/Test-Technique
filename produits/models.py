from django.db import models


class Produit(models.Model):
    CATEGORIE_CHOICES = [
        ("fruit", "Fruit"),
        ("legume", "Légume"),
        ("viande", "Viande"),
        ("poisson", "Poisson"),
        ("produit_laitier", "Produit laitier"),
        ("epicerie", "Épicerie"),
        ("boisson", "Boisson"),
        ("boulangerie", "Boulangerie"),
        ("confiserie", "Confiserie"),
        ("autre", "Autre"),
    ]

    categorie = models.CharField(
        max_length=30,
        choices=CATEGORIE_CHOICES
    )
    
    nom = models.CharField(max_length=100)
    marque = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)

    prix = models.DecimalField(max_digits=10, decimal_places=2)

    gramme = models.IntegerField(null=True, blank=True)
    prixkg = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    litre = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    prixlitre = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    date_peremption = models.DateField()

    image = models.ImageField(
        upload_to="produits/",
        blank=True,
        null=True
    )

    origine = models.CharField(max_length=100, blank=True)

    NUTRISCORE_CHOICES = [
        ("A", "A"),
        ("B", "B"),
        ("C", "C"),
        ("D", "D"),
        ("E", "E"),
    ]

    nutriscore = models.CharField(
        max_length=1,
        choices=NUTRISCORE_CHOICES,
        blank=True
    )

    bio = models.BooleanField(default=False)
    label_rouge = models.BooleanField(default=False)
    aop = models.BooleanField(default=False)
    igp = models.BooleanField(default=False)

class Facture(models.Model):
    date_creation = models.DateTimeField(auto_now_add=True)


class ContenuFacture(models.Model):
    facture = models.ForeignKey(Facture, on_delete=models.CASCADE)
    produit = models.ForeignKey(Produit, on_delete=models.CASCADE)
    quantite = models.IntegerField()
    prix_unitaire = models.DecimalField(max_digits=10, decimal_places=2)