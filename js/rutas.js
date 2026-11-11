(() => {
  'use strict';
  const grid = document.querySelector('#routes-grid');
  if (!grid || grid.dataset.initialized) return;
  grid.dataset.initialized = 'true';
  const API = 'https://ecorutas-api.vercel.app';
  const FALLBACK = new URL('../assets/imagenes/ruta-sin-foto.svg', document.baseURI).href;
  const CREDIT_FILE = new URL('../assets/data/ecorutas-image-credits.json', document.baseURI);
  const $ = selector => document.querySelector(selector);
  const form = $('.search-form');
  const search = $('#search-input');
  const difficulty = $('#filter-difficulty');
  const location = $('#filter-location');
  const distance = $('#filter-distance');
  const duration = $('#filter-duration');
  const chips = [...document.querySelectorAll('.chip')];
  const empty = $('.results__empty');
  const status = $('#routes-status');
  const retry = $('#routes-retry');
  const dialog = $('.route-dialog');
  const detailStatus = $('#route-detail-status');
  const detailRetry = $('#route-detail-retry');
  const labels = { facil: 'Fácil', moderada: 'Moderada', dificil: 'Difícil', experto: 'Experto' };
  const badgeClasses = { facil: 'easy', moderada: 'medium', dificil: 'hard', experto: 'expert' };
  const uuid = value => typeof value === 'string' && /^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(value);
  const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');
  const number = value => typeof value === 'number' && Number.isFinite(value);
  const format = value => number(value) ? value.toLocaleString('es-CL', { maximumFractionDigits: 2 }) : 'No informada';
  let routes = [];
  let credits = new Map();
  let category = 'all';
  let loaded = false;
  let loading = false;
  let detailController;
  let detailID;
  let detailGeneration = 0;

  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }
  function https(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' ? url.href : null;
    } catch { return null; }
  }
  function link(text, url) {
    const element = node('a', '', text);
    element.href = url;
    element.target = '_blank';
    element.rel = 'noopener noreferrer';
    return element;
  }
  async function fetchJSON(url, signal) {
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (signal?.aborted) controller.abort();
    signal?.addEventListener('abort', abort, { once: true });
    const timeout = setTimeout(abort, 15000);
    try {
      const response = await fetch(url, { signal: controller.signal, credentials: 'omit' });
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}`);
        error.status = response.status;
        throw error;
      }
      return await response.json();
    } finally {
      clearTimeout(timeout);
      signal?.removeEventListener('abort', abort);
    }
  }
  function validateRoute(route) {
    if (!route || !uuid(route.id) || !['name', 'description', 'location', 'difficulty', 'route_type'].every(key => typeof route[key] === 'string') || !route.name.trim()) {
      throw new Error('La API devolvió una ruta con formato inválido.');
    }
    return route; // Keep UUIDs, difficulty and all other API values unchanged.
  }
  let creditsPromise;
  function loadCredits() {
    if (!creditsPromise) creditsPromise = fetchJSON(CREDIT_FILE).then(data => {
      if (!Array.isArray(data)) throw new Error('Créditos inválidos');
      return new Map(data.filter(item => uuid(item?.route_id)).map(item => [item.route_id, item]));
    }).catch(() => new Map());
    return creditsPromise;
  }
  function creditFor(route) {
    const credit = credits.get(route.id);
    // Do not misattribute a photo if the API has changed its image since this snapshot.
    return credit && credit.image_url === route.image_url && typeof credit.author === 'string' &&
      typeof credit.license === 'string' && https(credit.source_url) && https(credit.license_url) ? credit : null;
  }
  function setPhoto(img, creditContainer, route) {
    const credit = creditFor(route);
    creditContainer.replaceChildren();
    creditContainer.hidden = !credit;
    img.hidden = false;
    img.loading = 'lazy';
    const fallback = () => {
      img.onerror = null; // Prevent a missing fallback from causing an error loop.
      img.src = FALLBACK;
      img.alt = `Fotografía no disponible de ${route.name}`;
      creditContainer.hidden = true;
    };
    if (!credit || !https(route.image_url)) { fallback(); return; }
    img.alt = `Foto de referencia del entorno de ${route.name}: ${credit.description || credit.title || ''}`;
    img.onerror = fallback;
    img.src = route.image_url;
    creditContainer.append(
      node('p', '', 'Fotografía de referencia del parque o región; puede no mostrar el sendero exacto.'),
      node('p', '', credit.description || credit.title || '')
    );
    const attribution = node('p');
    attribution.append(document.createTextNode(`Foto: ${credit.author} · `),
      link(credit.license, https(credit.license_url)), document.createTextNode(' · '),
      link('Fuente original', https(credit.source_url)));
    creditContainer.append(attribution, node('p', '', 'Presentación recortada para la tarjeta; original en el enlace de fuente.'));
  }
  function makeCard(route) {
    const card = $('#route-card-template').content.firstElementChild.cloneNode(true);
    card.dataset.routeId = route.id;
    card.dataset.difficulty = route.difficulty;
    card.dataset.category = route.route_type;
    card.querySelector('.route-card__title').textContent = route.name;
    card.querySelector('[data-card-description]').textContent = route.description;
    card.querySelector('.route-card__location').textContent = route.location || 'Ubicación no informada';
    const badge = card.querySelector('.route-card__badge');
    badge.textContent = labels[route.difficulty] || route.difficulty;
    badge.className = `route-card__badge route-card__badge--${badgeClasses[route.difficulty] || 'hard'}`;
    const metadata = card.querySelectorAll('.route-card__meta-item');
    // Keep the existing SVG icons; replace just their label text.
    const setMetric = (element, text) => {
      const icon = element.querySelector('svg');
      element.replaceChildren();
      if (icon) element.append(icon);
      element.append(document.createTextNode(` ${text}`));
    };
    setMetric(metadata[0], number(route.distance_km) ? `${format(route.distance_km)} km` : 'Distancia no informada');
    setMetric(metadata[1], number(route.duration_hours) ? `${format(route.duration_hours)} h` : 'Duración no informada');
    const button = card.querySelector('[data-route-details]');
    button.dataset.routeId = route.id;
    button.setAttribute('aria-label', `Ver detalles de ${route.name}`);
    setPhoto(card.querySelector('img'), card.querySelector('[data-card-credit]'), route);
    return card;
  }
  function filterRoutes() {
    const term = normalize(search.value.trim());
    const maxDistance = Number(distance.value);
    const distanceRestricted = maxDistance < Number(distance.max);
    const filtered = routes.filter(route => {
      const matchesSearch = normalize(`${route.name} ${route.location}`).includes(term);
      const matchesType = category === 'all' || normalize(route.route_type) === normalize(category);
      const matchesDifficulty = !difficulty.value || route.difficulty === difficulty.value;
      const matchesLocation = !location.value || route.location === location.value;
      const matchesDistance = !distanceRestricted || (number(route.distance_km) && route.distance_km <= maxDistance);
      const matchesDuration = !duration.value || (number(route.duration_hours) &&
        (duration.value === '24' ? route.duration_hours > 8 : route.duration_hours <= Number(duration.value)));
      return matchesSearch && matchesType && matchesDifficulty && matchesLocation && matchesDistance && matchesDuration;
    });
    grid.replaceChildren(...filtered.map(makeCard));
    $('#results-number').textContent = filtered.length;
    empty.hidden = !loaded || filtered.length !== 0;
    const allDistances = Number(distance.value) === Number(distance.max);
    $('.filter-group__output').textContent = allDistances ? `Todas (hasta ${distance.max} km)` : `${distance.value} km`;
    distance.setAttribute('aria-valuenow', distance.value);
    distance.setAttribute('aria-valuetext', allDistances ? 'Todas las distancias' : `${distance.value} kilómetros`);
  }
  function resetFilters() {
    search.value = '';
    category = 'all';
    difficulty.value = '';
    location.value = '';
    duration.value = '';
    distance.value = distance.max;
    chips.forEach(chip => {
      chip.classList.toggle('chip--active', chip.dataset.filter === 'all');
      chip.setAttribute('aria-pressed', String(chip.dataset.filter === 'all'));
    });
    filterRoutes();
  }
  async function loadRoutes() {
    if (loading) return;
    loading = true;
    retry.hidden = true;
    retry.disabled = true;
    grid.setAttribute('aria-busy', 'true');
    status.dataset.state = 'loading';
    status.textContent = 'Cargando rutas de Ecorutas…';
    empty.hidden = true;
    try {
      const next = [];
      const ids = new Set();
      let total;
      do {
        const params = new URLSearchParams({ limit: '100' });
        if (next.length) params.set('skip', String(next.length));
        const data = await fetchJSON(`${API}/api/v1/routes?${params}`);
        if (!data || !Array.isArray(data.items) || !Number.isInteger(data.total) || data.total < 0) {
          throw new Error('Formato de catálogo inválido');
        }
        if (total !== undefined && total !== data.total) throw new Error('El catálogo cambió durante la carga');
        total = data.total;
        if (!data.items.length && next.length < total) throw new Error('Catálogo incompleto');
        for (const item of data.items) {
          validateRoute(item);
          if (ids.has(item.id)) throw new Error('Rutas duplicadas en la respuesta');
          ids.add(item.id);
          next.push(item);
        }
        if (next.length > total) throw new Error('Total de rutas inválido');
      } while (next.length < total);
      // Local filtering only starts after the entire catalog has loaded, including future pages.
      credits = await loadCredits();
      routes = next;
      const previousLocation = location.value;
      location.replaceChildren(new Option('Todas las ubicaciones', ''));
      [...new Set(routes.map(route => route.location).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'))
        .forEach(value => location.append(new Option(value, value)));
      if ([...location.options].some(option => option.value === previousLocation)) location.value = previousLocation;
      const allDistances = distance.value === distance.max;
      distance.max = Math.ceil(Math.max(50, ...routes.map(route => number(route.distance_km) ? route.distance_km : 0)));
      distance.setAttribute('aria-valuemax', distance.max);
      if (allDistances) distance.value = distance.max;
      loaded = true;
      status.dataset.state = 'success';
      status.textContent = `${routes.length} rutas cargadas de Ecorutas.`;
      $('#routes-photo-status').textContent = routes.some(route => !creditFor(route))
        ? 'Algunas fotos se muestran como imagen local porque no tienen créditos verificados disponibles.' : '';
      filterRoutes();
    } catch (error) {
      status.dataset.state = 'error';
      status.textContent = (error.name === 'AbortError' ? 'La consulta tardó demasiado.' : 'No se pudieron cargar las rutas. Revisa tu conexión y vuelve a intentarlo.') +
        (loaded ? ' Se conserva el catálogo anterior.' : '');
      retry.hidden = false;
    } finally {
      loading = false;
      retry.disabled = false;
      grid.setAttribute('aria-busy', 'false');
    }
  }

  function clearDetails() {
    dialog.setAttribute('aria-busy', 'false');
    $('[data-dialog-image]').hidden = true;
    $('[data-dialog-title]').textContent = 'Detalle de la ruta';
    for (const selector of ['location', 'difficulty', 'distance', 'duration', 'description', 'extra', 'credit']) {
      $(`[data-dialog-${selector}]`).replaceChildren();
    }
    detailRetry.hidden = true;
  }
  function showDetails(route) {
    $('[data-dialog-title]').textContent = route.name;
    $('[data-dialog-location]').textContent = route.location;
    $('[data-dialog-difficulty]').textContent = `Dificultad: ${labels[route.difficulty] || route.difficulty}`;
    $('[data-dialog-distance]').textContent = `Distancia: ${format(route.distance_km)}${number(route.distance_km) ? ' km' : ''}`;
    $('[data-dialog-duration]').textContent = `Duración: ${format(route.duration_hours)}${number(route.duration_hours) ? ' h' : ''}`;
    $('[data-dialog-description]').textContent = route.description;
    const extra = $('[data-dialog-extra]');
    const values = [
      ['Dato interesante', route.interesting_fact], ['Tipo de ruta', route.route_type],
      ['Altitud', number(route.altitude_meters) ? `${format(route.altitude_meters)} m` : null],
      ['Calorías estimadas', number(route.estimated_calories) ? `${format(route.estimated_calories)} kcal` : null],
      ['Ruta larga', typeof route.is_long_route === 'boolean' ? (route.is_long_route ? 'Sí' : 'No') : null],
      ['Estado', typeof route.is_active === 'boolean' ? (route.is_active ? 'Activa' : 'No disponible') : null],
      ['Creada', route.created_at], ['Actualizada', route.updated_at]
    ];
    for (const [label, value] of values) {
      if (value !== null && value !== undefined && value !== '') extra.append(node('p', '', `${label}: ${value}`));
    }
    if (route.latitude !== null && route.longitude !== null && number(route.latitude) && number(route.longitude) &&
      Math.abs(route.latitude) <= 90 && Math.abs(route.longitude) <= 180) {
      const params = new URLSearchParams({ mlat: String(route.latitude), mlon: String(route.longitude) });
      extra.append(node('p', '', `Coordenadas: ${route.latitude}, ${route.longitude}`),
        link('Ver ubicación en el mapa', `https://www.openstreetmap.org/?${params}#map=13/${route.latitude}/${route.longitude}`));
    }
    setPhoto($('[data-dialog-image]'), $('[data-dialog-credit]'), route);
  }
  async function openDetails(id) {
    if (detailID === id && detailController && dialog.open) return;
    detailController?.abort();
    detailController = undefined;
    const generation = ++detailGeneration;
    detailID = id;
    clearDetails();
    if (!dialog.open) dialog.showModal();
    if (!uuid(id)) {
      detailStatus.dataset.state = 'error';
      detailStatus.textContent = 'El identificador de la ruta no es válido. Cierra los detalles y selecciona otra ruta.';
      return;
    }
    const controller = new AbortController();
    detailController = controller;
    dialog.setAttribute('aria-busy', 'true');
    detailStatus.dataset.state = 'loading';
    detailStatus.textContent = 'Cargando detalles de la ruta…';
    try {
      const route = validateRoute(await fetchJSON(`${API}/api/v1/routes/${encodeURIComponent(id)}`, controller.signal));
      if (generation !== detailGeneration || !dialog.open) return;
      if (route.id !== id) throw new Error('La respuesta no corresponde a esta ruta');
      showDetails(route);
      detailStatus.dataset.state = 'success';
      detailStatus.textContent = '';
    } catch (error) {
      if (generation !== detailGeneration || !dialog.open) return;
      detailStatus.dataset.state = 'error';
      detailStatus.textContent = error.status === 404
        ? 'Esta ruta ya no está disponible (404). Cierra los detalles y elige otra ruta.'
        : error.name === 'AbortError' ? 'La consulta de detalles tardó demasiado. Inténtalo nuevamente.'
          : 'No se pudieron cargar los detalles de esta ruta. Puedes reintentar.';
      detailRetry.hidden = error.status === 404;
    } finally {
      if (generation === detailGeneration) {
        detailController = undefined;
        dialog.setAttribute('aria-busy', 'false');
      }
    }
  }
  form.addEventListener('submit', event => { event.preventDefault(); filterRoutes(); });
  search.addEventListener('input', filterRoutes);
  for (const control of [difficulty, location, duration]) control.addEventListener('change', filterRoutes);
  distance.addEventListener('input', filterRoutes);
  chips.forEach(chip => chip.addEventListener('click', () => {
    category = chip.dataset.filter;
    chips.forEach(item => {
      item.classList.toggle('chip--active', item === chip);
      item.setAttribute('aria-pressed', String(item === chip));
    });
    filterRoutes();
  }));
  $('.filters__clear').addEventListener('click', resetFilters);
  $('.results__empty-clear').addEventListener('click', resetFilters);
  grid.addEventListener('click', event => {
    const button = event.target.closest('[data-route-details]');
    if (button && grid.contains(button)) openDetails(button.dataset.routeId);
  });
  $('[data-dialog-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    detailGeneration++;
    detailController?.abort();
    detailController = undefined;
    dialog.setAttribute('aria-busy', 'false');
  });
  detailRetry.addEventListener('click', () => openDetails(detailID));
  retry.addEventListener('click', loadRoutes);
  loadRoutes();
})();
