interface EcoMap { setView(center: [number, number], zoom: number): EcoMap; removeLayer(layer: EcoTiles): void; }
interface EcoTiles { addTo(map: EcoMap): EcoTiles; on(event: string, handler: () => void): EcoTiles; }
interface EcoMarker { addTo(map: EcoMap): EcoMarker; bindPopup(text: string): EcoMarker; }
declare const L: {
  map(id: string, options: { scrollWheelZoom: boolean }): EcoMap;
  tileLayer(url: string, options: { attribution: string; maxZoom: number }): EcoTiles;
  marker(center: [number, number], options: { title: string; alt: string; keyboard: boolean }): EcoMarker;
};
(() => {
  const container = document.querySelector<HTMLElement>('#mapa-ecoruta');
  const status = document.querySelector<HTMLElement>('#map-status');
  const reset = document.querySelector<HTMLButtonElement>('#map-reset');
  if (!container || !status || !reset) return;
  if (typeof L === 'undefined') {
    status.textContent = 'No se pudo cargar el mapa. Comprueba tu conexión y recarga la página. Puedes explorar las rutas en el listado.';
    reset.disabled = true;
    return;
  }
  const center: [number, number] = [-38.7359, -72.5904];
  const map = L.map('mapa-ecoruta', { scrollWheelZoom: false }).setView(center, 10);
  L.marker(center, { title: 'Temuco: referencia regional', alt: 'Temuco, punto de referencia', keyboard: true })
    .addTo(map).bindPopup('Temuco: referencia para explorar La Araucanía. No indica el inicio de un sendero.');
  let layer: EcoTiles | undefined;
  const tiles = () => {
    if (layer) map.removeLayer(layer);
    const dark = document.documentElement.dataset.theme === 'dark';
    status.textContent = 'Cargando mapa…';
    layer = L.tileLayer(dark ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png' : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' + (dark ? ' © <a href="https://carto.com/attributions">CARTO</a>' : ''),
      maxZoom: 19
    });
    let failed = false;
    layer.on('tileerror', () => { failed = true; status.textContent = 'Algunas zonas del mapa no cargaron. Revisa tu conexión; el listado de rutas sigue disponible.'; });
    layer.on('load', () => { if (!failed) status.textContent = ''; });
    layer.addTo(map);
  };
  tiles();
  document.addEventListener('themechange', tiles);
  reset.addEventListener('click', () => { map.setView(center, 10); container.focus(); });
  container.tabIndex = 0;
  const zoomIn = container.querySelector('.leaflet-control-zoom-in');
  const zoomOut = container.querySelector('.leaflet-control-zoom-out');
  zoomIn?.setAttribute('aria-label', 'Acercar mapa');
  zoomIn?.setAttribute('title', 'Acercar mapa');
  zoomOut?.setAttribute('aria-label', 'Alejar mapa');
  zoomOut?.setAttribute('title', 'Alejar mapa');
})();
