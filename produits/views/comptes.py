from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.shortcuts import render, redirect


def inscription(request):

    if request.method == "POST":

        username = request.POST.get("username")
        password = request.POST.get("password")
        confirmation = request.POST.get("confirmation")
        type_compte = request.POST.get("type_compte")

        if password != confirmation:
            return render(request, "produits/inscription.html", {
                "erreur": "Les mots de passe ne correspondent pas."
            })

        if User.objects.filter(username=username).exists():
            return render(request, "produits/inscription.html", {
                "erreur": "Ce nom d'utilisateur existe déjà."
            })

        utilisateur = User.objects.create_user(
            username=username,
            password=password
        )

        if type_compte == "admin":
            utilisateur.is_staff = True
            utilisateur.save()

        return redirect("connexion")

    return render(request, "produits/inscription.html")


def connexion(request):

    if request.method == "POST":

        username = request.POST.get("username")
        password = request.POST.get("password")

        utilisateur = authenticate(
            request,
            username=username,
            password=password
        )

        if utilisateur is not None:
            login(request, utilisateur)
            return redirect("liste_produits")

        return render(request, "produits/connexion.html", {
            "erreur": "Nom d'utilisateur ou mot de passe incorrect."
        })

    return render(request, "produits/connexion.html")


def deconnexion(request):
    logout(request)
    return redirect("liste_produits")
