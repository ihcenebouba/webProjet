let QuestionIndex = 0;
let questions = [];
let score = 0;
let timer;
let timeLeft = 20;

document.getElementById("start").addEventListener("click", startGame);
document.getElementById("next").addEventListener("click", showNextQuestion);

function startGame() {
    const urlParams = new URLSearchParams(window.location.search);
    const themeChoisi = urlParams.get("theme"); // peut être null

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const xmlDoc = xhr.responseXML;
                questions = getThemeQuestions(xmlDoc, themeChoisi);
               
            } else {
                alert("Impossible de charger la base de questions.");
            }
        }
    };
    xhr.open("GET", "https://obiwan.univ-brest.fr/~e22400745/data/bdd.xml", true);
    xhr.send();
}

function getThemeQuestions(xmlDoc, themeChoisi) {
    const nodes = Array.from(xmlDoc.getElementsByTagName("question"));
    const tab = [];

    for (const q of nodes) {
        const theme = q.getElementsByTagName("theme")[0].textContent.trim();

        // Si un thème est demandé, on filtre ; sinon on garde tout
        if (themeChoisi && theme !== themeChoisi) continue;

        const text = q.getElementsByTagName("enonce")[0].textContent.trim();
        const bonneLettre = q.getElementsByTagName("bonne_reponse")[0].textContent.trim();

        const answers = Array.from(q.getElementsByTagName("reponse")).map(a => {
            const full = a.textContent.trim();            // ex: "B. Bulbizarre"
            return {
                text: full,
                correct: full.charAt(0) === bonneLettre   // compare la lettre
            };
        });

        tab.push({ text, answers });
    }
    return tab;
}

function showQuestion() {
    resetState();
    if (QuestionIndex >= questions.length) {
        endGame();
        return;
    }

    const q = questions[QuestionIndex];
    document.getElementById("questionText").innerText = q.text;

    const answersContainer = document.getElementById("answersContainer");
    q.answers.forEach(answer => {
        const btn = document.createElement("button");
        btn.classList.add("answerBtn");
        btn.innerText = answer.text;
        btn.onclick = () => selectAnswer(answer.correct, btn);
        answersContainer.appendChild(btn);
    });

    timeLeft = 20;
    document.getElementById("timer").innerText = `Temps : ${timeLeft}s`;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = `Temps : ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            selectAnswer(false, null); // temps écoulé
        }
    }, 1000);
}

function resetState() {
    clearInterval(timer);
    document.getElementById("next").style.display = "none";
    document.getElementById("answersContainer").innerHTML = "";
}

function selectAnswer(isCorrect, clickedBtn) {
    clearInterval(timer);
    const q = questions[QuestionIndex];
    const bonneReponse = q.answers.find(a => a.correct).text;

    for (const btn of document.getElementsByClassName("answerBtn")) {
        btn.disabled = true;
        if (btn.innerText === bonneReponse) {
            btn.style.backgroundColor = "green";
        } else if (btn === clickedBtn) {
            btn.style.backgroundColor = "red";
        }
    }

    if (isCorrect) score++;
    document.getElementById("next").style.display = "block";
}

function showNextQuestion() {
    QuestionIndex++;
    showQuestion();
}

function endGame() {
    document.getElementById("questionContainer").style.display = "none";
    const resultContainer = document.getElementById("resultContainer");
    resultContainer.style.display = "block";
    resultContainer.innerHTML = `
        <h2>Résultat</h2>
        <p>Score : ${score} / ${questions.length}</p>
        <button onclick="window.location.reload()">Rejouer</button>
    `;
}