function ajouterAuPanier(event, id) {

    event.stopPropagation();

    fetch(`/panier/ajouter/${id}/`)
        .then(response => response.json())
        .then(() => {

            chargerPanier();

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


function afficherPanier(data) {

    const contenu = document.getElementById("panier-contenu");
    const nombre = document.getElementById("nombre-produits");
    const total = document.getElementById("panier-total");

    nombre.textContent = data.nombre_produits;

    total.textContent = data.total;

    if (data.produits.length === 0) {

        contenu.innerHTML = `
            <p>
                Votre facture est vide.
            </p>
        `;

        return;
    }

    let html = "";

    data.produits.forEach(produit => {

        html += `
            <div class="ligne-panier">

                <div class="panier-produit">

                    <strong>
                        ${produit.nom}
                    </strong>

                    <small>
                        ${produit.marque}
                    </small>

                </div>

                <div class="quantite">

                    <button
                        onclick="modifierQuantite(
                            ${produit.id},
                            ${produit.quantite - 1}
                        )"
                    >
                        −
                    </button>

                    <input
                        type="number"
                        class="quantite-input"
                        value="${produit.quantite}"
                        min="0"
                        onchange="modifierQuantite(${produit.id}, this.value)"
                    >

                    <button
                        onclick="modifierQuantite(
                            ${produit.id},
                            ${produit.quantite + 1}
                        )"
                    >
                        +
                    </button>

                </div>

                <span class="prix-panier">
                    ${produit.sous_total} €
                </span>

                <button
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


function modifierQuantite(id, quantite) {

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
    .then(() => {

        chargerPanier();

    });

}


function supprimerDuPanier(id) {

    fetch(`/panier/supprimer/${id}/`, {

        method: "POST",

        headers: {
            "X-CSRFToken": getCookie("csrftoken")
        }

    })
    .then(response => response.json())
    .then(() => {

        chargerPanier();

    });

}

function confirmerFacture() {

    if (!utilisateurConnecte) {

        afficherNotification(
            "Merci de vous connecter ou de vous inscrire."
        );

        return;
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

            return;
        }

        fermerPanier();

        afficherNotification(
            `Commande confirmée ! Facture #${data.facture_id}`
        );

        chargerPanier();

    });

}

document.addEventListener("click", function(event) {

    const popup = document.getElementById("popup-panier");

    if (event.target === popup) {
        fermerPanier();
    }

});

document.addEventListener("DOMContentLoaded", function() {
    chargerPanier();
});

function afficherNotification(message) {

    const notification = document.getElementById("notification");

    notification.textContent = message;

    notification.classList.add("visible");

    setTimeout(function() {

        notification.classList.remove("visible");

    }, 3000);

}