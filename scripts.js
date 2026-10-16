
    let xmlhttp = new XMLHttpRequest();

    function loadXMLDoc() {
        xmlhttp.onreadystatechange = loadData;
        xmlhttp.open("GET", "https://obiwan.univ-brest.fr/~e22400745/data/bdd.xml", true);
        xmlhttp.send();
    }

    function loadData() {
        let xmlDoc = xmlhttp.responseXML;    
        
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {   
            displayDataTable();     
        }
    }

        function displayDataTable() {
        let i;
        let xmlDoc = xmlhttp.responseXML;    
        
let table = `
    <tr>
        <th>ID</th>
        <th>Question</th>
        <th>Choix de réponses</th>
        <th>Bonne réponse</th>
    </tr>
`;

let x = xmlDoc.getElementsByTagName("question");

for (let i = 0; i < x.length; i++) {
    let choix = x[i].getElementsByTagName("reponse");
    let listeChoix = "";

    for (let j = 0; j < choix.length; j++) {
        listeChoix += choix[j].textContent + "<br>";
    }

    table += "<tr>"
        + "<td>" + x[i].getAttribute("id") + "</td>"
        + "<td>" + x[i].getElementsByTagName("enonce")[0].textContent + "</td>"
        + "<td>" + listeChoix + "</td>"
        + "<td>" + x[i].getElementsByTagName("bonne_reponse")[0].textContent + "</td>"
        + "</tr>";
}

document.getElementById("data").innerHTML = table;
        }