const lignesParPage = 4;
let pageActuelle = 1;


// Calcule le nombre de produits par ligne
function calculerProduitsParLigne() {
    const conteneur = document.querySelector(".produits");
    const largeur = conteneur.clientWidth;

    let largeurMinimum = 250;

    if (window.innerWidth <= 768) {
        largeurMinimum = 150;
    } else if (window.innerWidth <= 1024) {
        largeurMinimum = 200;
    } else if (window.innerWidth >= 1600) {
        largeurMinimum = 260;
    }

    const gap = 22;

    return Math.max(
        1,
        Math.floor((largeur + gap) / (largeurMinimum + gap))
    );
}


// Affiche les produits de la page actuelle
function afficherPage() {
    const cartes = document.querySelectorAll(".produit");
    const pagination = document.getElementById("pagination");

    const produitsParLigne = calculerProduitsParLigne();
    const produitsParPage = produitsParLigne * lignesParPage;

    const nombrePages = Math.ceil(cartes.length / produitsParPage);

    if (pageActuelle > nombrePages) {
        pageActuelle = nombrePages || 1;
    }

    const debut = (pageActuelle - 1) * produitsParPage;
    const fin = debut + produitsParPage;

    cartes.forEach((carte, index) => {
        carte.style.display =
            index >= debut && index < fin
                ? "flex"
                : "none";
    });

    afficherPagination(nombrePages);
}


// Affiche les boutons de pagination
function afficherPagination(nombrePages) {
    const pagination = document.getElementById("pagination");

    if (nombrePages <= 1) {
        pagination.innerHTML = "";
        return;
    }

    let html = "";

    if (pageActuelle > 1) {
        html += `
            <a href="#" onclick="changerPage(event, ${pageActuelle - 1})">
                ← Précédente
            </a>
        `;
    }

    for (let numero = 1; numero <= nombrePages; numero++) {

        if (
            numero === 1 ||
            numero === nombrePages ||
            Math.abs(numero - pageActuelle) <= 1
        ) {
            if (numero === pageActuelle) {
                html += `
                    <span class="page-actuelle">
                        ${numero}
                    </span>
                `;
            } else {
                html += `
                    <a href="#" onclick="changerPage(event, ${numero})">
                        ${numero}
                    </a>
                `;
            }
        } else if (
            numero === pageActuelle - 2 ||
            numero === pageActuelle + 2
        ) {
            html += `<span>...</span>`;
        }
    }

    if (pageActuelle < nombrePages) {
        html += `
            <a href="#" onclick="changerPage(event, ${pageActuelle + 1})">
                Suivante →
            </a>
        `;
    }

    pagination.innerHTML = html;
}


// Change de page
function changerPage(event, page) {
    event.preventDefault();

    pageActuelle = page;

    afficherPage();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// Recalcule quand la fenêtre change de taille
window.addEventListener("resize", function() {
    pageActuelle = 1;
    afficherPage();
});


document.addEventListener("DOMContentLoaded", function() {
    afficherPage();
});