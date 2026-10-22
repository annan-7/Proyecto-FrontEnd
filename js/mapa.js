// mapa
document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.getElementById('mapa-ecoruta');
    
    // Si no estamos en la página del mapa, no hacemos nada
    if (!mapContainer) return; 

    console.log('Mapa: Iniciando');

    const map = L.map('mapa-ecoruta').setView([-39.28, -72.23], 9); // Centro en La Araucanía
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);
});