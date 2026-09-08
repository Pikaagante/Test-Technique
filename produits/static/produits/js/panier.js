const modificationsEnCours = new Set();

// Ajout et affichage du panier
function ajouterAuPanier(event, id) {
    event.stopPropagation();

    if (modificationsEnCours.has(id)) {
        return;
    }

    modificationsEnCours.add(id);

    fetch(`/panier/ajouter/${id}/`)
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                afficherNotification(data.message || "Erreur.");
                return;
            }

            chargerPanier();
        })
        .finally(() => {
            modificationsEnCours.delete(id);
        });
}

function ouvrirPanier() {
    document.getElementById("popup-panier").style.display = "flex";
    chargerPanier();
}

function fermerPanier() {
    document.getElementById("popup-panier").style.display = "none";
}

function chargerPanier() {
    fetch("/panier/")
        .then(response => response.json())
        .then(data => {
            afficherPanier(data);
        });
}


// Affichage du contenu

function afficherPanier(data) {
    const contenu = document.getElementById("panier-contenu");
    const nombre = document.getElementById("nombre-produits");
    const total = document.getElementById("panier-total");
    const titre = document.getElementById("panier-titre");
    const boutonConfirmation = document.getElementById("confirmer-panier");
    const boutonAnnuler = document.getElementById("annuler-modification");

    nombre.textContent = data.nombre_produits;
    total.textContent = `${data.total} €`;

    const modification =
        data.modification !== null &&
        data.modification !== undefined;

    if (titre) {
        titre.textContent = modification
            ? "Modifier la commande"
            : "Votre panier";
    }

    if (boutonConfirmation) {
        boutonConfirmation.textContent = modification
            ? "Enregistrer la commande"
            : "Confirmer la commande";
    }

    if (boutonAnnuler) {
        boutonAnnuler.style.display = modification
            ? "block"
            : "none";
    }

    if (data.produits.length === 0) {
        contenu.innerHTML = `
            <div class="panier-vide">
                <p>Votre panier est vide.</p>
            </div>
        `;

        if (boutonConfirmation) {
            boutonConfirmation.disabled = true;
        }

        return;
    }

    if (boutonConfirmation) {
        boutonConfirmation.disabled = false;
    }

    let html = "";

    data.produits.forEach(produit => {
        html += `
            <div class="ligne-panier">
                <div class="panier-produit">
                    <strong>${produit.nom}</strong>
                    <small>${produit.marque}</small>
                    <small>${produit.prix} € / unité</small>
                </div>

                <div class="quantite">
                    <button type="button" onclick="modifierQuantite(${produit.id}, ${produit.quantite - 1})"> 
                        −
                    </button>

                    <input
                        type="number"
                        class="quantite-input"
                        value="${produit.quantite}"
                        min="0"
                        onchange="modifierQuantite(${produit.id}, this.value)"
                    >

                    <button type="button" onclick="modifierQuantite(${produit.id}, ${produit.quantite + 1})">
                        +
                    </button>
                </div>

                <span class="prix-panier">
                    ${produit.sous_total} €
                </span>

                <button
                    type="button"
                    class="supprimer-panier"
                    onclick="supprimerDuPanier(${produit.id})"
                >
                    🗑️
                </button>
            </div>
        `;
    });

    contenu.innerHTML = html;
}

// Modification des quantités
function modifierQuantite(id, quantite) {
    if (modificationsEnCours.has(id)) {
        return;
    }

    quantite = parseInt(quantite, 10);

    if (isNaN(quantite)) {
        return;
    }

    modificationsEnCours.add(id);

    const donnees = new FormData();
    donnees.append("quantite", quantite);

    fetch(`/panier/modifier/${id}/`, {
        method: "POST",
        headers: {
            "X-CSRFToken": getCookie("csrftoken")
        },
        body: donnees
    })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                afficherNotification(data.message || "Erreur.");
                return;
            }

            chargerPanier();
        })
        .finally(() => {
            modificationsEnCours.delete(id);
        });
}

function supprimerDuPanier(id) {
    if (modificationsEnCours.has(id)) {
        return;
    }

    modificationsEnCours.add(id);

    fetch(`/panier/supprimer/${id}/`, {
        method: "POST",
        headers: {
            "X-CSRFToken": getCookie("csrftoken")
        }
    })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                afficherNotification(data.message || "Erreur.");
                return;
            }

            chargerPanier();
        })
        .finally(() => {
            modificationsEnCours.delete(id);
        });
}


// Confirmation et annulation
function confirmerFacture() {
    const bouton = document.getElementById("confirmer-panier");

    if (bouton && bouton.disabled) {
        return;
    }

    if (!utilisateurConnecte) {
        afficherNotification(
            "Merci de vous connecter ou de vous inscrire."
        );

        return;
    }

    if (bouton) {
        bouton.disabled = true;
    }

    fetch("/facture/confirmer/", {
        method: "POST",
        headers: {
            "X-CSRFToken": getCookie("csrftoken")
        }
    })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                afficherNotification(data.message);

                if (bouton) {
                    bouton.disabled = false;
                }

                return;
            }

            fermerPanier();

            if (data.modification) {
                afficherNotification(
                    `Commande #${data.facture_id} modifiée !`
                );
            } else {
                afficherNotification(
                    `Commande confirmée ! Facture #${data.facture_id}`
                );
            }

            chargerPanier();
        });
}

function annulerModification() {
    const bouton = document.getElementById("annuler-modification");

    if (bouton) {
        bouton.disabled = true;
    }

    fetch("/factures/annuler-modification/", {
        method: "POST",
        headers: {
            "X-CSRFToken": getCookie("csrftoken")
        }
    })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                afficherNotification(data.message);

                if (bouton) {
                    bouton.disabled = false;
                }

                return;
            }

            chargerPanier();
            afficherNotification("Modification annulée.");
        });
}

// Utilitaires
function getCookie(name) {
    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {
        const [key, value] = cookie.trim().split("=");

        if (key === name) {
            return decodeURIComponent(value);
        }
    }

    return null;
}

function afficherNotification(message) {
    const notification = document.getElementById("notification");

    notification.textContent = message;
    notification.classList.add("visible");

    setTimeout(() => {
        notification.classList.remove("visible");
    }, 3000);
}


// Fermeture du popup
document.addEventListener("click", function(event) {
    const popup = document.getElementById("popup-panier");

    if (event.target === popup) {
        fermerPanier();
    }
});

document.addEventListener("DOMContentLoaded", function() {
    chargerPanier();
});
