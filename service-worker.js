// Criar um Service Worker (Mantém o Código Rodando em Segundo Plano)

self.addEventListener("install", (event) => {
    console.log("Service Worker instalado.");
    self.skipWaiting(); // Ativa imediatamente
});

self.addEventListener("activate", (event) => {
    console.log("Service Worker ativado.");
});

self.addEventListener("fetch", (event) => {
    // Intercepta requisições, útil para cache no futuro
});
