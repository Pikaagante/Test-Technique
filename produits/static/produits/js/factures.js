// Affiche le détail d'une facture dans le popup
function ouvrirFacture(id) {
    const popup = document.getElementById("popup-facture");
    const infos = document.getElementById("facture-infos");

    infos.innerHTML = "<p>Chargement...</p>";
    popup.classList.add("visible");

    fetch(`/factures/${id}/`)
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                infos.innerHTML = `<p>${data.message}</p>`;
                return;
            }

            const facture = data.facture;
            const dateSeule = facture.date.split(" à ")[0];

            let html = `
                <h2>Commande du ${dateSeule}</h2>

                <div class="facture-entete">
                    <div class="facture-info">
                        <h3>Client</h3>
                        <p>${facture.utilisateur}</p>
                    </div>
                    <div class="facture-info">
                        <h3>Date</h3>
                        <p>${dateSeule}</p>
                    </div>
                </div>
            `;

            facture.produits.forEach(produit => {
                html += `
                    <div class="ligne-facture">
                        <div>
                            <div class="facture-produit-nom">${produit.nom}</div>
                            <div class="facture-produit-detail">${produit.marque}</div>
                        </div>
                        <div class="facture-quantite">× ${produit.quantite}</div>
                        <div class="facture-prix">${produit.sous_total} €</div>
                    </div>
                `;
            });

            html += `
                <div class="resume-facture">
                    <strong>Nombre de produits : ${facture.nombre_produits}</strong>
                    <span>Total : <strong>${facture.total} €</strong></span>
                </div>
            `;

            if (facture.peut_modifier) {
                html += `
                    <div class="facture-actions">
                        <button
                            class="btn-modifier"
                            onclick="modifierFacture(${facture.id})"
                        >
                            Modifier
                        </button>
                        <button
                            class="btn-supprimer"
                            onclick="supprimerFacture(event, ${facture.id})"
                        >
                            Supprimer
                        </button>
                    </div>
                `;
            }

            infos.innerHTML = html;
        })
        .catch(error => {
            infos.innerHTML = "<p>Erreur lors du chargement de la facture.</p>";
            console.error(error);
        });
}


// Commence la modification d'une facture
function modifierFacture(id) {
    const bouton = document.querySelector(".btn-modifier");

    if (bouton) {
        bouton.disabled = true;
    }

    fetch(`/factures/${id}/modifier/`, {
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

            window.location.href = data.redirect;
        })
        .catch(() => {
            afficherNotification("Une erreur est survenue.");

            if (bouton) {
                bouton.disabled = false;
            }
        });
}


// Ferme le popup
function fermerFacture() {
    document.getElementById("popup-facture").classList.remove("visible");
}


// Supprime une facture
function supprimerFacture(event, id) {
    event.stopPropagation();

    if (!confirm("Êtes-vous sûr de vouloir supprimer cette facture ?")) {
        return;
    }

    fetch(`/factures/${id}/supprimer/`, {
        method: "POST",
        headers: {
            "X-CSRFToken": getCookie("csrftoken")
        }
    })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                afficherNotification(data.message);
                return;
            }

            fermerFacture();
            location.reload();
        })
        .catch(() => {
            afficherNotification("Une erreur est survenue lors de la suppression.");
        });
}


// Récupère le token CSRF nécessaire aux requêtes POST
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


// Affiche une notification temporaire
function afficherNotification(message) {
    const notification = document.getElementById("notification");

    notification.textContent = message;
    notification.classList.add("visible");

    setTimeout(() => {
        notification.classList.remove("visible");
    }, 3000);
}


// Ferme le popup en cliquant sur l'arrière-plan
document.addEventListener("click", function(event) {
    const popup = document.getElementById("popup-facture");

    if (event.target === popup) {
        fermerFacture();
    }
});