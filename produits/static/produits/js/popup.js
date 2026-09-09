// Affichage du produit
function ouvrirProduit(id) {
    const produit = produits[id];

    let html = `
        <div class="produit-entete">
            <div class="produit-image">
                ${produit.image
                    ? `<img src="${produit.image}" alt="${produit.nom}">`
                    : `<div class="sans-image">Aucune image</div>`
                }
            </div>

            <div class="produit-principal">
                <span class="produit-categorie">
                    ${produit.categorie}
                </span>

                <h2 class="produit-titre">
                    ${produit.nom}
                </h2>

                <p class="produit-marque">
                    ${produit.marque || "Marque non renseignée"}
                </p>

                <div class="produit-prix">
                    ${produit.prix} €
                </div>
            </div>
        </div>

        ${produit.description
            ? `
                <div class="produit-description">
                    <h3>Description</h3>
                    <p>${produit.description}</p>
                </div>
            `
            : ""
        }

        <div class="produit-details">
            <div class="detail-groupe">
                <h3>Informations</h3>

                <div class="detail-item">
                    <span>Catégorie</span>
                    <strong>${produit.categorie}</strong>
                </div>

                <div class="detail-item">
                    <span>Origine</span>
                    <strong>${produit.origine || "Non renseignée"}</strong>
                </div>

                <div class="detail-item">
                    <span>Date de péremption</span>
                    <strong>${produit.date_peremption}</strong>
                </div>

                <div class="detail-item">
                    <span>Nutri-Score</span>
                    <strong>${produit.nutriscore || "Non renseigné"}</strong>
                </div>
            </div>

            <div class="detail-groupe">
                <h3>Caractéristiques</h3>

                ${produit.gramme
                    ? `
                        <div class="detail-item">
                            <span>Poids</span>
                            <strong>${produit.gramme} g</strong>
                        </div>

                        <div class="detail-item">
                            <span>Prix au kg</span>
                            <strong>${produit.prixkg} €/kg</strong>
                        </div>
                    `
                    : ""
                }

                ${produit.litre
                    ? `
                        <div class="detail-item">
                            <span>Volume</span>
                            <strong>${produit.litre} L</strong>
                        </div>

                        <div class="detail-item">
                            <span>Prix au litre</span>
                            <strong>${produit.prixlitre} €/L</strong>
                        </div>
                    `
                    : ""
                }

                <div class="detail-labels">
                    ${produit.bio ? '<span>Bio</span>' : ""}
                    ${produit.label_rouge ? '<span>Label Rouge</span>' : ""}
                    ${produit.aop ? '<span>AOP</span>' : ""}
                    ${produit.igp ? '<span>IGP</span>' : ""}
                </div>
            </div>
        </div>

        <div class="produit-actions">
            <button
                type="button"
                class="btn-ajouter"
                onclick="ajouterAuPanier(event, ${id})"
            >
                Ajouter au panier
            </button>
    `;

    if (estAdmin) {
        html += `
            <button
                type="button"
                class="btn-modifier"
                onclick="modifierProduit(${id})"
            >
                Modifier
            </button>

            <button
                type="button"
                class="btn-supprimer"
                onclick="supprimerProduit(${id})"
            >
                Supprimer
            </button>
        `;
    }

    html += `
        </div>
    `;

    document.getElementById("popup-infos").innerHTML = html;
    document.getElementById("popup").style.display = "flex";
}


// Fermeture du popup
function fermerPopup() {
    document.getElementById("popup").style.display = "none";
}


// Gestion du produit
function supprimerProduit(id) {
    if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) {
        return;
    }

    fetch(`/produits/${id}/supprimer/`, {
        method: "POST",
        headers: {
            "X-CSRFToken": getCookie("csrftoken")
        }
    })
        .then(response => {
            if (response.ok) {
                location.reload();
            }
        });
}


function modifierProduit(id) {
    window.location.href = `/produits/${id}/modifier/`;
}


// Utilitaire
function getCookie(name) {
    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {
        const [key, value] = cookie.trim().split("=");

        if (key === "csrftoken") {
            return decodeURIComponent(value);
        }
    }

    return null;
}


// Fermeture en cliquant sur l'arrière-plan
document.getElementById("popup").addEventListener("click", function(event) {
    if (event.target === this) {
        fermerPopup();
    }
});