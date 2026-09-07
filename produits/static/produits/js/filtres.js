function appliquerFiltres() {

    const recherche = document
        .getElementById("recherche")
        .value
        .toLowerCase();

    const prixMin = parseFloat(
        document.getElementById("prix-min").value
    );

    const prixMax = parseFloat(
        document.getElementById("prix-max").value
    );

    const categories = Array.from(
        document.querySelectorAll('input[name="categorie"]:checked')
    ).map(input => input.value);

    const nutriscores = Array.from(
        document.querySelectorAll('input[name="nutriscore"]:checked')
    ).map(input => input.value);

    const labels = Array.from(
        document.querySelectorAll('input[name="label"]:checked')
    ).map(input => input.value);

    const origines = Array.from(
        document.querySelectorAll('input[name="origine"]:checked')
    ).map(input => input.value);


    document.querySelectorAll(".produit").forEach(produit => {

        const nom = produit.dataset.nom;
        const marque = produit.dataset.marque;
        const categorie = produit.dataset.categorie;
        const prix = parseFloat(produit.dataset.prix);
        const nutriscore = produit.dataset.nutriscore;
        const origine = produit.dataset.origine;

        const bio = produit.dataset.bio === "true";
        const labelRouge = produit.dataset.labelRouge === "true";
        const aop = produit.dataset.aop === "true";
        const igp = produit.dataset.igp === "true";


        const correspondRecherche =
            nom.includes(recherche) ||
            marque.includes(recherche);


        const correspondCategorie =
            categories.length === 0 ||
            categories.includes(categorie);


        const correspondPrixMin =
            isNaN(prixMin) ||
            prix >= prixMin;


        const correspondPrixMax =
            isNaN(prixMax) ||
            prix <= prixMax;


        const correspondNutriscore =
            nutriscores.length === 0 ||
            nutriscores.includes(nutriscore);


        const correspondOrigine =
            origines.length === 0 ||
            origines.includes(origine);


        const correspondLabels =
            (!labels.includes("bio") || bio) &&
            (!labels.includes("label_rouge") || labelRouge) &&
            (!labels.includes("aop") || aop) &&
            (!labels.includes("igp") || igp);


        const afficher =
            correspondRecherche &&
            correspondCategorie &&
            correspondPrixMin &&
            correspondPrixMax &&
            correspondNutriscore &&
            correspondOrigine &&
            correspondLabels;


        produit.style.display = afficher ? "" : "none";

    });
}


document
    .querySelectorAll(".filtres input")
    .forEach(input => {

        input.addEventListener("input", appliquerFiltres);
        input.addEventListener("change", appliquerFiltres);

    });