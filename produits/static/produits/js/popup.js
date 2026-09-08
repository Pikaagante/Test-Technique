function ouvrirProduit(id) {

    const produit = produits[id];

    let html = `
        <h2>${produit.nom}</h2>

        ${
            produit.image
                ? `<img src="${produit.image}" width="250">`
                : ""
        }

        <p><strong>Catégorie :</strong> ${produit.categorie}</p>
        <p><strong>Marque :</strong> ${produit.marque}</p>
        <p><strong>Description :</strong> ${produit.description}</p>
        <p><strong>Prix :</strong> ${produit.prix} €</p>
    `;

    if (produit.gramme) {

        html += `
            <p><strong>Poids :</strong> ${produit.gramme} g</p>
            <p><strong>Prix au kg :</strong> ${produit.prixkg} €/kg</p>
        `;

    }

    if (produit.litre) {

        html += `
            <p><strong>Volume :</strong> ${produit.litre} L</p>
            <p><strong>Prix au litre :</strong> ${produit.prixlitre} €/L</p>
        `;

    }

    html += `
        <p><strong>Date de péremption :</strong> ${produit.date_peremption}</p>
        <p><strong>Origine :</strong> ${produit.origine}</p>
        <p><strong>Nutri-Score :</strong> ${produit.nutriscore}</p>
        <p><strong>Bio :</strong> ${produit.bio ? "Oui" : "Non"}</p>
        <p><strong>Label Rouge :</strong> ${produit.label_rouge ? "Oui" : "Non"}</p>
        <p><strong>AOP :</strong> ${produit.aop ? "Oui" : "Non"}</p>
        <p><strong>IGP :</strong> ${produit.igp ? "Oui" : "Non"}</p>
    `;

    if (estAdmin) {

        html += `
            <div class="actions-produit">

                <button onclick="modifierProduit(${id})">
                    Modifier
                </button>

                <button onclick="supprimerProduit(${id})">
                    Supprimer
                </button>

            </div>
        `;

    }

    document.getElementById("popup-infos").innerHTML = html;

    document.getElementById("popup").style.display = "flex";
}


function fermerPopup() {

    document.getElementById("popup").style.display = "none";

}


document.getElementById("popup").addEventListener("click", function(event) {

    if (event.target === this) {
        fermerPopup();
    }

});


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


function modifierProduit(id) {

    window.location.href = `/produits/${id}/modifier/`;

}