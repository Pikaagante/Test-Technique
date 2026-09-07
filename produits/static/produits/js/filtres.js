function appliquerFiltres() {

    const formulaire = document.getElementById("form-filtres");

    formulaire.submit();

}


document
    .querySelectorAll("#form-filtres input")
    .forEach(input => {

        input.addEventListener("change", appliquerFiltres);

    });