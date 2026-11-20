interface EcoMap { setView(center: [number, number], zoom: number): EcoMap; removeLayer(layer: EcoTiles): void; fitBounds(points: [number, number][], options: { padding: [number, number]; maxZoom: number }): void; }
interface EcoTiles { addTo(map: EcoMap): EcoTiles; on(event: string, handler: () => void): EcoTiles; }
interface EcoMarker { addTo(map: EcoMap): EcoMarker; bindPopup(text: string | HTMLElement): EcoMarker; }
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
  // Keep one provider in both themes: changing theme must not discard loaded tiles.
  const layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 19
  });
  let tileFailed = false;
  const tileStatus = document.createElement('p');
  tileStatus.className = 'map-status'; tileStatus.setAttribute('role', 'status');
  container.before(tileStatus);
  layer.on('tileerror', () => { tileFailed = true; tileStatus.textContent = 'Algunas zonas del mapa no cargaron. Revisa tu conexión.'; });
  layer.on('load', () => { if (!tileFailed) tileStatus.textContent = ''; });
  layer.addTo(map);
  const retry = document.createElement('button');
  retry.type = 'button'; retry.textContent = 'Reintentar rutas'; retry.hidden = true;
  status.after(retry);
  const loadRoutes = async () => {
    status.textContent = 'Cargando rutas del mapa…'; retry.hidden = true;
    try {
      const routes = await EcoCatalog.load();
      const points: [number, number][] = [];
      // Several routes can share a location; keep all names in its popup.
      const locations = new Map<string, { point: [number, number]; routes: EcoRoute[] }>();
      for (const route of routes) {
        const { latitude: lat, longitude: lng } = route;
        if (typeof lat !== 'number' || typeof lng !== 'number' || !Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) continue;
        const key = `${lat},${lng}`;
        const entry = locations.get(key) || { point: [lat, lng] as [number, number], routes: [] };
        entry.routes.push(route); locations.set(key, entry);
      }
      for (const { point, routes: nearby } of locations.values()) {
        const popup = document.createElement('div');
        for (const route of nearby) {
          const title = document.createElement('strong'); title.textContent = route.name;
          const detail = document.createElement('p'); detail.textContent = `${route.location} · ${route.distance_km} km · ${route.duration_hours} h`;
          const link = document.createElement('a'); link.textContent = 'Consultar ruta';
          link.href = `./paginas/rutas.html?search=${encodeURIComponent(route.name)}`;
          popup.append(title, detail, link, document.createElement('hr'));
        }
        L.marker(point, { title: nearby.map(r => r.name).join(', '), alt: 'Ubicación de rutas', keyboard: true }).addTo(map).bindPopup(popup);
        points.push(point);
      }
      if (points.length) map.fitBounds(points, { padding: [24, 24], maxZoom: 12 });
      const located = [...locations.values()].reduce((sum, entry) => sum + entry.routes.length, 0);
      status.textContent = `${located} de ${routes.length} rutas con ubicación. Los marcadores indican puntos de referencia, no el trazado del sendero.`;
    } catch {
      status.textContent = 'No se pudieron cargar las rutas del mapa. Comprueba tu conexión y reintenta.';
      retry.hidden = false;
    }
  };
  retry.addEventListener('click', loadRoutes);
  void loadRoutes();
  reset.addEventListener('click', () => { map.setView(center, 10); container.focus(); });
  container.tabIndex = 0;
  const zoomIn = container.querySelector('.leaflet-control-zoom-in');
  const zoomOut = container.querySelector('.leaflet-control-zoom-out');
  zoomIn?.setAttribute('aria-label', 'Acercar mapa');
  zoomIn?.setAttribute('title', 'Acercar mapa');
  zoomOut?.setAttribute('aria-label', 'Alejar mapa');
  zoomOut?.setAttribute('title', 'Alejar mapa');
})();
