// Filtres
function appliquerFiltres() {
    const formulaire = document.getElementById("form-filtres");
    formulaire.submit();
}

document
    .querySelectorAll("#form-filtres input")
    .forEach(input => {
        if (input.id === "recherche") {
            return;
        }

        input.addEventListener("change", appliquerFiltres);
    });


// Recherche dynamique
const champRecherche = document.getElementById("recherche");
let rechercheEnCours = null;

if (champRecherche) {
    champRecherche.addEventListener("input", function () {
        const texte = this.value;

        if (rechercheEnCours) {
            rechercheEnCours.abort();
        }

        rechercheEnCours = new AbortController();

        fetch(
            `/produits/rechercher/?recherche=${encodeURIComponent(texte)}`,
            {
                signal: rechercheEnCours.signal
            }
        )
            .then(response => response.json())
            .then(data => {
                afficherResultats(data.produits);
            })
            .catch(error => {
                if (error.name !== "AbortError") {
                    console.error(error);
                }
            });
    });
}


// Affichage des résultats
function afficherResultats(produits) {
    const conteneur = document.querySelector(".produits");

    if (produits.length === 0) {
        conteneur.innerHTML = `
            <p>Aucun produit trouvé.</p>
        `;

        return;
    }

    let html = "";

    produits.forEach(produit => {
        html += `
            <div
                class="produit"
                onclick="ouvrirProduit(${produit.id})"
            >
                ${produit.image ? `<img src="${produit.image}" alt="${produit.nom}">` : `<p>Aucune image</p>`}

                <h2>${produit.nom}</h2>

                <p> Marque : ${produit.marque} </p>

                <p> Prix : ${produit.prix} € </p>

                <button onclick="ajouterAuPanier(event, ${produit.id})">
                    Ajouter
                </button>
            </div>
        `;
    });

    conteneur.innerHTML = html;
}