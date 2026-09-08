function ouvrirFacture(id) {

    const popup = document.getElementById(
        "popup-facture"
    );

    const infos = document.getElementById(
        "facture-infos"
    );

    infos.innerHTML = `
        <p>Chargement...</p>
    `;

    popup.style.display = "flex";

    fetch(`/factures/${id}/`)
        .then(response => response.json())
        .then(data => {

            if (!data.success) {

                infos.innerHTML = `
                    <p>${data.message}</p>
                `;

                return;
            }

            const facture = data.facture;

            let html = `
                <h2>
                    Commande du ${facture.date.split(" à ")[0]}
                </h2>

                <p>
                    <strong>Client :</strong>
                    ${facture.utilisateur}
                </p>

                <hr>
            `;

            facture.produits.forEach(produit => {

                html += `
                    <div class="ligne-facture">

                        <div>
                            <strong>
                                ${produit.nom}
                            </strong>

                            <small>
                                ${produit.marque}
                            </small>
                        </div>

                        <span>
                            × ${produit.quantite}
                        </span>

                        <span class="facture-prix">
                            ${produit.sous_total} €
                        </span>

                    </div>
                `;

            });

            html += `
                <div class="resume-facture">

                    <strong>
                        Nombre de produits :
                        ${facture.nombre_produits}
                    </strong>

                    <strong>
                        Total :
                        ${facture.total} €
                    </strong>

                </div>
            `;

            if (facture.peut_modifier) {

                html += `
                    <div class="actions-facture">

                        <button
                            class="modifier-facture"
                            onclick="modifierFacture(${facture.id})"
                        >
                            Modifier
                        </button>

                        <button
                            class="supprimer-facture"
                            onclick="supprimerFacture(event, ${facture.id})"
                        >
                            🗑️ Supprimer
                        </button>

                    </div>
                `;
            }

            infos.innerHTML = html;

        });

}


function modifierFacture(id) {

    const bouton = document.querySelector(
        ".modifier-facture"
    );

    if (bouton) {
        bouton.disabled = true;
    }

    fetch(
        `/factures/${id}/modifier/`,
        {
            method: "POST",

            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            }
        }
    )
        .then(response => response.json())
        .then(data => {

            if (!data.success) {

                afficherNotification(
                    data.message
                );

                if (bouton) {
                    bouton.disabled = false;
                }

                return;
            }

            window.location.href = data.redirect;

        })
        .catch(() => {

            afficherNotification(
                "Une erreur est survenue."
            );

            if (bouton) {
                bouton.disabled = false;
            }

        });

}


function fermerFacture() {

    document.getElementById(
        "popup-facture"
    ).style.display = "none";

}


function supprimerFacture(event, id) {

    event.stopPropagation();

    fetch(
        `/factures/${id}/supprimer/`,
        {
            method: "POST",

            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            }
        }
    )
        .then(response => response.json())
        .then(data => {

            if (!data.success) {

                afficherNotification(
                    data.message
                );

                return;
            }

            location.reload();

        });

}


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

    const notification =
        document.getElementById(
            "notification"
        );

    notification.textContent = message;

    notification.classList.add(
        "visible"
    );

    setTimeout(() => {

        notification.classList.remove(
            "visible"
        );

    }, 3000);

}


document.addEventListener(
    "click",
    function(event) {

        const popup =
            document.getElementById(
                "popup-facture"
            );

        if (
            event.target === popup
        ) {
            fermerFacture();
        }

    }
);