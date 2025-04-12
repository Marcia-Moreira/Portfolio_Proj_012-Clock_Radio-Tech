// Clock_Radio
// PWA (Progressive Web App)

let timer;
let interval = localStorage.getItem("interval") || 5; // Recupera intervalo salvo

document.getElementById("interval").value = interval; // Define valor salvo

document.getElementById("interval").addEventListener("change", function() {
    interval = this.value;
    localStorage.setItem("interval", interval); // Salva no localStorage
});

document.getElementById("start").addEventListener("click", function() {
    requestWakeLock(); // Ativa a tela ligada ao iniciar
    speak(`Iniciando cronômetro, notificações a cada ${interval} minutos.`);
    timer = setInterval(() => {
        speak(`${interval} minutos se passaram.`);
    }, interval * 60000);
});

document.getElementById("stop").addEventListener("click", function() {
    clearInterval(timer);
    releaseWakeLock(); // Libera o wake lock se o cronômetro parar
    speak("Cronômetro parado.");
});

function speak(text) {
    let utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = 1; // Garante que seja audível
    utterance.rate = 1;   // Velocidade normal
    utterance.pitch = 1;  // Tom de voz normal
    utterance.onend = () => {
        console.log("Fala concluída.");
    };
    speechSynthesis.speak(utterance);
}

// Para registrar o service worker dentro do JavaScript principal:
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log("Service Worker registrado!"))
    .catch(err => console.log("Erro ao registrar Service Worker:", err));
}

// -------------------------
// WAKE LOCK (mantém a tela ligada)
// -------------------------

let wakeLock = null;

async function requestWakeLock() {
    try {
        wakeLock = await navigator.wakeLock.request("screen");
        console.log("🔒 Wake Lock ativado: tela não vai apagar.");
    } catch (err) {
        console.error(`❌ Erro ao ativar Wake Lock: ${err.name}, ${err.message}`);
    }
}

// Libera o wake lock (opcional)
function releaseWakeLock() {
    if (wakeLock !== null) {
        wakeLock.release().then(() => {
            console.log("🔓 Wake Lock liberado.");
            wakeLock = null;
        });
    }
}

// Reativa se for perdido (ex: gira a tela)
document.addEventListener("visibilitychange", () => {
    if (wakeLock !== null && document.visibilityState === "visible") {
        requestWakeLock();
    }
});
