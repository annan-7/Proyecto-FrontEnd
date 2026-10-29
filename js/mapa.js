// js/mapa.js
document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.getElementById('mapa-ecoruta');
    if (!mapContainer) return;

    if (!window.L) {
        mapContainer.textContent = 'No se pudo cargar el mapa. Comprueba tu conexión y recarga la página.';
        return;
    }
    console.log('Mapa: Iniciando...');

    // 1. Inicializar el mapa centrado en La Araucanía
    const map = L.map('mapa-ecoruta').setView([-38.7359, -72.5904], 13);

    L.marker([-38.7359, -72.5904]).addTo(map).bindPopup('Temuco: referencia para explorar La Araucanía');
    // 2. Cargar las baldosas de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
});
