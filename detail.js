
let xmlhttp = new XMLHttpRequest();

function loadXMLDocAndDisplayBook(){       
    xmlhttp.onreadystatechange = loadData;
    xmlhttp.open("GET", "https://obiwan.univ-brest.fr/~e22400745/data/bdd.xml", true);
    xmlhttp.send();    
}

function loadData(){
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            displayBookById();
    }
}

function displayBookById() {
    let enonce = document.getElementById("enonce");
    let choix = document.getElementById("choix");
    let reponse = document.getElementById("reponse");
    let point = document.getElementById("point");

    // Récupérer l'identifiant dans la chaîne de requête
    let params = new URLSearchParams(window.location.search);
    let enonceid = params.get("id");

    let xmlDoc = xmlhttp.responseXML;
    let x = xmlDoc.getElementsByTagName("question");              // CORRIGÉ : "questions" -> "question"

    for (let i = 0; i < x.length; i++) {
        if (x[i].getElementsByTagName("id")[0].textContent.trim() == enonceid) {  // id est une balise : OK
            let reponses = x[i].getElementsByTagName("reponse");  // CORRIGÉ : plus de shadowing
            let listeChoix = "";

            for (let j = 0; j < reponses.length; j++) {
                listeChoix += reponses[j].textContent + "\n";
            }

            enonce.value = x[i].getElementsByTagName("enonce")[0].textContent;
            choix.value = listeChoix;                              // CORRIGÉ : on utilise listeChoix
            reponse.value = x[i].getElementsByTagName("bonne_reponse")[0].textContent;
            point.value = x[i].getElementsByTagName("point")[0].textContent;

            break;
        }
    }
}