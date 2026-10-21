
let xmlhttp = new XMLHttpRequest();
let nbPage = 0; // à calculer
let startIndex = 0;
let endIndex = 0;
let pageSize = 10; // Par défaut, on affiche 10 items par page
let page = 1; // Par défaut, on affiche les items de la page 1

function loadXMLDoc() {
    xmlhttp.onreadystatechange = loadData;
    xmlhttp.open("GET", "https://obiwan.univ-brest.fr/~e22400745/data/bdd.xml", true);
    xmlhttp.send();
}

function loadData() {

    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

        computeNbPage();
        showPageLinks();
        loadPage(page);
    }
}

function computeNbPage() {
    let xmlDoc = xmlhttp.responseXML;
    let x = xmlDoc.getElementsByTagName("question");


    nbPage = Math.ceil(x.length / pageSize);


}

function loadPage(pageNumber) {
    page = pageNumber;

    startIndex = (page - 1) * pageSize;
    endIndex = Math.min(startIndex + pageSize - 1, xmlhttp.responseXML.getElementsByTagName("question").length - 1);

    displayDataTable(startIndex, endIndex);
}

function displayDataTable(startIndex, endIndex) {

    let xmlDoc = xmlhttp.responseXML;
    let i;
    let table = `
    <tr>
        <th>ID</th>
        <th>Question</th>
        <th>Choix de réponses</th>
        <th>Bonne réponse</th>
        <th>Thémé</th>
        <th>Détail</th>
    </tr>
`;

    let x = xmlDoc.getElementsByTagName("question");

    for (i = startIndex; i <= endIndex; i++) {
        let choix = x[i].getElementsByTagName("reponse");
        let listeChoix = "";

        for (let j = 0; j < choix.length; j++) {
            listeChoix += choix[j].textContent + "<br>";
        }

        table += "<tr>"
            + "<td>" + x[i].getElementsByTagName("id")[0].textContent + "</td>"
            + "<td>" + x[i].getElementsByTagName("enonce")[0].textContent + "</td>"
            + "<td>" + listeChoix + "</td>"
            + "<td>" + x[i].getElementsByTagName("bonne_reponse")[0].textContent + "</td>"
            + "<td>" + x[i].getElementsByTagName("theme")[0].textContent + "</td>"
            + "<td>" + "<a href='detail.html?id="
            + x[i].getElementsByTagName("id")[0].textContent
            + "'>Details</a>" + "<td>"
            + "</tr>";
    }
    document.getElementById("data").innerHTML = table;
}


function filtrerData() {
    let slThematique = document.getElementById("thematique");
    let themeChoisi = slThematique.options[slThematique.selectedIndex].value;
    // alert(themeChoisi);
    let xmlDoc = xmlhttp.responseXML;
    if (!xmlDoc) {
        return;
    }

    let table = `
        <tr>
            <th>ID</th>
            <th>Question</th>
            <th>Choix de réponses</th>
            <th>Bonne réponse</th>
            <th>Thème</th>
            <th>Détail</th>
        </tr>
    `;

    let x = xmlDoc.getElementsByTagName("question");

    for (let i = 0; i < x.length; i++) {
        let theme = x[i].getElementsByTagName("theme")[0].textContent;

        if (themeChoisi === "Tout" || theme === themeChoisi) {
            let choix = x[i].getElementsByTagName("reponse");
            let listeChoix = "";

            for (let j = 0; j < choix.length; j++) {
                listeChoix += choix[j].textContent + "<br>";
            }

            table += "<tr>"
                + "<td>" + x[i].getElementsByTagName("id")[0].textContent + "</td>"
                + "<td>" + x[i].getElementsByTagName("enonce")[0].textContent + "</td>"
                + "<td>" + listeChoix + "</td>"
                + "<td>" + x[i].getElementsByTagName("bonne_reponse")[0].textContent + "</td>"
                + "<td>" + theme + "</td>"
                + "<td>" + "<a href='detail.html?id="
            + x[i].getElementsByTagName("id")[0].textContent
            + "'>Details</a>" + "<td>"
                + "</tr>";
        }
    }

    document.getElementById("data").innerHTML = table;
}

function showPageLinks() {
    let divpl = document.getElementById("pageLinks");
    let pageLinks = " ";

    for (let i = 1; i <= nbPage; i++) {
        pageLinks += "<input type='button' onclick='loadPage(" + i
            + ")' value='" + i + "'>";
    }

    divpl.innerHTML = pageLinks;
    divpl.style.display = "block";
}
// function clicthem() {

//     document.getElementById("next1").addEventListener("click", () => {
//         window.location.href = "jeu.html?theme=" +encodeURIComponent("Feu");
//     });
//     document.getElementById("next2").addEventListener("click", () => {
//         window.location.href = "jeu.html?theme=" +encodeURIComponent("Eau");
//     });
//     document.getElementById("next3").addEventListener("click", () => {
//         window.location.href = "jeu.html?theme=" +encodeURIComponent("Électricité");
//     });
//     document.getElementById("next4").addEventListener("click", () => {
//         window.location.href = "jeu.html?theme=" +encodeURIComponent("Plante");
//     });

//     document.getElementById("theme1").addEventListener("click", () => {
//         window.location.href = "pokemone.html?theme=" +encodeURIComponent("Feu");
//     });
//     document.getElementById("theme2").addEventListener("click", () => {
//         window.location.href = "pokemone.html?theme=" +encodeURIComponent("Eau");
//     });
//     document.getElementById("theme3").addEventListener("click", () => {
//         window.location.href = "pokemone.html?theme=" +encodeURIComponent("Électricité");
//     });
//     document.getElementById("theme4").addEventListener("click", () => {
//         window.location.href = "pokemone.html?theme=" +encodeURIComponent("Plante");
//     });

// }

// window.onload = function () {
//     clicthem();
// };
