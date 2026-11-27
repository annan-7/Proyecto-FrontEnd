// Ficha de una ruta: paginas/ruta.html?id=<id>
(() => {
  const difficultyLabels: Record<string, [string, string]> = {
    facil: ['easy', 'Fácil'], moderada: ['medium', 'Moderada'], dificil: ['hard', 'Difícil'], experto: ['hard', 'Experto'],
  };
  const typeLabels: Record<string, string> = {
    trekking: 'Trekking / senderismo', senderismo: 'Senderismo', ciclismo: 'Ciclismo', montaña: 'Montaña', costa: 'Costa',
  };

  const init = () => {
    const $ = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector);
    const status = $<HTMLElement>('[data-ficha-status]');
    const retry = $<HTMLButtonElement>('[data-ficha-retry]');
    const article = $<HTMLElement>('[data-ficha]');
    const missing = $<HTMLElement>('[data-ficha-missing]');
    if (!status || !retry || !article || !missing) return;

    // Los enlaces "Volver" conservan los filtros del catálogo.
    document.querySelectorAll<HTMLAnchorElement>('[data-back-to-catalog]').forEach(link => { link.href = EcoFilters.catalogHref(); });

    const id = new URLSearchParams(location.search).get('id')?.trim() || '';
    const set = (selector: string, text: string) => { const el = $<HTMLElement>(selector); if (el) el.textContent = text; };

    const showMissing = () => {
      status.textContent = ''; article.hidden = true; missing.hidden = false;
      document.title = 'Ruta no encontrada | ECORUTAS';
    };

    const render = (route: EcoRoute) => {
      const [level, label] = difficultyLabels[route.difficulty] || ['', route.difficulty || 'Sin información'];
      document.title = `${route.name} | ECORUTAS`;
      set('[data-ficha-title]', route.name);
      set('[data-ficha-location]', route.location);
      set('[data-ficha-difficulty]', label);
      set('[data-ficha-distance]', `${route.distance_km} km`);
      set('[data-ficha-duration]', `${route.duration_hours} h`);
      set('[data-ficha-type]', typeLabels[route.route_type] || route.route_type || 'Sin información');
      set('[data-ficha-description]', route.description || 'Esta ruta aún no tiene una descripción publicada.');
      const badge = $<HTMLElement>('[data-ficha-badge]');
      if (badge) { badge.textContent = label; badge.className = `route-card__badge route-card__badge--${level || 'medium'}`; }

      const image = $<HTMLImageElement>('[data-ficha-image]')!;
      const fallback = () => { image.onerror = null; image.src = '../assets/imagenes/ruta-sin-foto.svg'; image.alt = 'Ilustración de montaña; no representa la ruta'; };
      fallback();
      try {
        const url = new URL(route.image_url || '');
        if (url.protocol === 'https:') { image.onerror = fallback; image.src = url.href; image.alt = `Paisaje de referencia de ${route.name}`; }
      } catch { /* Sin imagen: se usa la ilustración local. */ }

      const coords = $<HTMLElement>('[data-ficha-coords]');
      if (coords && typeof route.latitude === 'number' && typeof route.longitude === 'number') {
        const map = new URL('https://www.openstreetmap.org/');
        map.searchParams.set('mlat', String(route.latitude)); map.searchParams.set('mlon', String(route.longitude));
        map.hash = `map=13/${route.latitude}/${route.longitude}`;
        coords.innerHTML = '';
        const link = document.createElement('a');
        link.href = map.href; link.target = '_blank'; link.rel = 'noopener';
        link.textContent = 'Ver punto de referencia en OpenStreetMap (se abre en otra pestaña)';
        coords.append('Ubicación aproximada: ', link);
        coords.hidden = false;
      }

      const plan = $<HTMLAnchorElement>('[data-ficha-plan]');
      if (plan) plan.href = `rutas.html#salida?${new URLSearchParams({ ruta: route.id })}`;

      const favorite = $<HTMLButtonElement>('[data-ficha-favorite]')!;
      const notice = $<HTMLElement>('[data-ficha-notice]')!;
      EcoFavorites.paint(favorite, route.id, route.name);
      favorite.addEventListener('click', () => {
        const saved = EcoFavorites.toggle(route.id);
        notice.textContent = saved === null ? 'No fue posible guardar favoritas en este navegador.'
          : saved ? `${route.name} se guardó en tus favoritas.` : `${route.name} se quitó de tus favoritas.`;
      });
      document.addEventListener(EcoFavorites.eventName, () => EcoFavorites.paint(favorite, route.id, route.name));

      EcoFilters.rememberRoute(route.id);
      status.textContent = ''; missing.hidden = true; article.hidden = false;
    };

    const load = async () => {
      if (!id) { showMissing(); return; }
      retry.hidden = true; status.textContent = 'Cargando información de la ruta…';
      try {
        const route = (await EcoCatalog.load()).find(item => item.id === id);
        if (route) render(route); else showMissing();
      } catch {
        status.textContent = 'No fue posible obtener los datos de la ruta. Comprueba tu conexión y reintenta.';
        retry.hidden = false;
      }
    };
    retry.addEventListener('click', () => { void load(); });
    void load();
  };

  document.addEventListener('DOMContentLoaded', init);
})();
