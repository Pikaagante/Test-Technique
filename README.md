# Gestion de produits et factures

## Installation

Cloner le dépôt et se placer dans le projet :

```bash
git clone -b Ex2 https://github.com/Pikaagante/Test-Technique.git
```

Créer l'environnement virtuel :

```bash
python -m venv venv
```

Activer l'environnement :

```bash
source venv/Scripts/activate
```

Installer les dépendances :

```bash
python -m pip install -r requirements.txt
```

## Fonctionnalités

- Création de factures
- Consultation des factures
- Authentification et gestion des comptes
- Vues protégées selon les droits de l'utilisateur
- Les administrateurs peuvent ajouter, modifier et supprimer des produits
- Les administrateurs peuvent consulter les factures de tous les clients

## Structure

- `produits/views/` : logique des pages
- `produits/forms.py` : formulaires
- `produits/templates/` : pages HTML
- `produits/templates/partials/` : parties HTML réutilisables
- `produits/static/` : CSS et JavaScript

