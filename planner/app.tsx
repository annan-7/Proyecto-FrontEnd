import { render } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { addDays, checklist, defaultState, fetchForecast, forecastAdvice, hasCoordinates, levels, normalize, portablePlan, recommend, restoreState, todayInChile } from './core';
import type { Forecast, PlanState, Preferences, Route } from './core';

declare const EcoCatalog: { load(): Promise<Route[]> };
const storageKey = 'ecorutas-salida-v1';
function initialState(): PlanState {
  let state = defaultState();
  try { state = restoreState(localStorage.getItem(storageKey)); } catch { /* Session-only mode. */ }
  const hash = new URLSearchParams(location.hash.split('?')[1] || '');
  if (location.hash.startsWith('#salida?')) {
    state = restoreState(JSON.stringify({ ...state, selected: hash.get('ruta') || state.selected, checked: [], preferences: {
      region: hash.get('region') ?? state.preferences.region, hours: Number(hash.get('horas') || state.preferences.hours),
      level: hash.get('nivel') || state.preferences.level, date: hash.get('fecha') || state.preferences.date,
    } }));
  }
  return state;
}
function RouteOption({ route, selected, favorite, onSelect, onFavorite, reason }: {
  route: Route; selected: boolean; favorite: boolean; onSelect(): void; onFavorite(): void; reason?: string;
}) {
  return <li class={`outing-route${selected ? ' outing-route--selected' : ''}`}>
    <div class="outing-route__top"><span class="outing-tag">{levels[route.difficulty]?.label || route.difficulty}</span>
      <button class="outing-favorite" type="button" aria-pressed={favorite} aria-label={`${favorite ? 'Quitar de' : 'Guardar en'} favoritas: ${route.name}`} onClick={onFavorite}>
        <span aria-hidden="true">{favorite ? '♥' : '♡'}</span><span>{favorite ? 'Guardada' : 'Guardar'}</span>
      </button></div>
    <h4>{route.name}</h4><p class="outing-muted">{route.location}</p>
    <p class="outing-route__numbers"><strong>{route.distance_km} km</strong><span>{route.duration_hours} h de recorrido</span></p>
    {reason && <p class="outing-reason">{reason}</p>}
    <button type="button" class={selected ? 'btn--primary' : ''} aria-pressed={selected} onClick={onSelect}>{selected ? 'En tu salida' : 'Planificar esta ruta'}</button>
  </li>;
}
function Weather({ route, date, onForecast }: { route: Route; date: string; onForecast(value: Forecast | null): void }) {
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [status, setStatus] = useState('loading');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setForecast(null); onForecast(null);
    if (!hasCoordinates(route)) { setStatus('missing'); return () => { active = false; }; }
    setStatus('loading');
    const timeout = setTimeout(() => controller.abort(), 12000);
    fetchForecast(route, date, controller.signal).then(value => {
      if (active) { setForecast(value); onForecast(value); setStatus('ready'); }
    }).catch(() => { if (active) setStatus('error'); }).finally(() => clearTimeout(timeout));
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [route.id, date, attempt]);
  return <section class="outing-weather" aria-labelledby="outing-weather-title">
    <h4 id="outing-weather-title">El tiempo en tu destino</h4>
    <p class="outing-muted">Pronóstico diario · {date} · hora de Chile</p>
    <div role="status">
      {status === 'loading' && <p>Consultando el pronóstico de esta ubicación…</p>}
      {status === 'missing' && <p>La ruta no tiene coordenadas disponibles para consultar el clima.</p>}
      {status === 'error' && <p>No pudimos obtener el pronóstico. Puedes seguir preparando tu salida.</p>}
      {status === 'ready' && forecast && <><dl class="outing-weather__metrics">
        <div><dt>Temperatura</dt><dd>{forecast.min}–{forecast.max} °C</dd></div>
        <div><dt>Prob. de lluvia</dt><dd>{forecast.rain} %</dd></div>
        <div><dt>Viento máximo</dt><dd>{forecast.wind} km/h</dd></div>
      </dl><p class="outing-advice">{forecastAdvice(forecast)}</p></>}
    </div>
    {status === 'error' && <button type="button" onClick={() => setAttempt(attempt + 1)}>Reintentar pronóstico</button>}
    <p class="outing-fine">Fuente: <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a>.
      {forecast && ` Consultado a las ${new Date(forecast.fetchedAt).toLocaleTimeString('es-CL', { timeZone: 'America/Santiago', hour: '2-digit', minute: '2-digit' })}.`}
      {' '}No confirma seguridad ni apertura del sendero.</p>
  </section>;
}
function App() {
  const [state, setState] = useState(initialState);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [catalogStatus, setCatalogStatus] = useState('loading');
  const [attempt, setAttempt] = useState(0);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [notice, setNotice] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [shareURL, setShareURL] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const planHeading = useRef<HTMLHeadingElement>(null);
  const today = todayInChile();
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(state)); setStorageAvailable(true); }
    catch { setStorageAvailable(false); }
  }, [state]);
  useEffect(() => {
    const restoreShared = () => {
      if (!location.hash.startsWith('#salida?')) return;
      setState(initialState()); setForecast(null); setShareURL('');
      heading.current?.focus();
    };
    window.addEventListener('hashchange', restoreShared);
    return () => window.removeEventListener('hashchange', restoreShared);
  }, []);
  useEffect(() => {
    let active = true;
    setCatalogStatus('loading');
    EcoCatalog.load().then(items => {
      if (!active) return;
      setRoutes(items); setCatalogStatus('ready');
      setState(previous => {
        // The API may use "La Araucanía" or "Araucanía". Select its actual label.
        const region = items.find(item => normalize(item.location).includes('araucania'))?.location;
        return region && normalize(previous.preferences.region) === 'araucania'
          ? { ...previous, preferences: { ...previous.preferences, region } } : previous;
      });
    }).catch(() => { if (active) setCatalogStatus('error'); });
    return () => { active = false; };
  }, [attempt]);
  useEffect(() => {
    const selectFromCatalog = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      if (!routes.some(route => route.id === id)) return;
      if (id !== state.selected) {
        setForecast(null); setShareURL('');
        setState(previous => ({ ...previous, selected: id, checked: [] }));
      }
      requestAnimationFrame(() => { planHeading.current?.focus(); planHeading.current?.scrollIntoView({ block: 'start' }); });
    };
    document.addEventListener('ecoruta:plan-route', selectFromCatalog);
    return () => document.removeEventListener('ecoruta:plan-route', selectFromCatalog);
  }, [routes, state.selected]);
  const preferences = state.preferences;
  const selected = routes.find(route => route.id === state.selected);
  const matching = recommend(routes, preferences);
  const saved = routes.filter(route => state.favorites.includes(route.id));
  const shown = favoritesOnly ? saved : matching.slice(0, 3);
  const regions = [...new Set(routes.map(route => route.location))].sort((a, b) => a.localeCompare(b, 'es'));
  const setPreference = <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    setShareURL('');
    if (key === 'date') setForecast(null);
    setState(previous => ({ ...previous, preferences: { ...previous.preferences, [key]: value }, checked: key === 'date' ? [] : previous.checked }));
  };
  const selectRoute = (route: Route) => {
    if (route.id !== state.selected) {
      setForecast(null); setShareURL('');
      setState(previous => ({ ...previous, selected: route.id, checked: [] }));
    }
    setNotice(`${route.name} añadida a tu salida.`);
    requestAnimationFrame(() => { planHeading.current?.focus(); planHeading.current?.scrollIntoView({ block: 'start' }); });
  };
  const toggleFavorite = (route: Route) => {
    const exists = state.favorites.includes(route.id);
    setState(previous => ({ ...previous, favorites: exists ? previous.favorites.filter(id => id !== route.id) : [...previous.favorites, route.id] }));
    setNotice(`${route.name}: ${exists ? 'quitada de' : 'guardada en'} favoritas.`);
  };
  const download = () => {
    if (!selected) return;
    const blob = new Blob([portablePlan(selected, state, forecast)], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob); const anchor = document.createElement('a');
    anchor.href = url; anchor.download = `ecoruta-salida-${preferences.date}.html`; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice('Ficha descargada. Ábrela sin conexión o imprímela desde tu navegador.');
  };
  const share = async () => {
    if (!selected) return;
    const url = new URL(location.href); url.search = '';
    url.hash = `salida?${new URLSearchParams({ ruta: selected.id, region: preferences.region, horas: String(preferences.hours), nivel: preferences.level, fecha: preferences.date })}`;
    setShareURL(url.href);
    try { await navigator.clipboard.writeText(url.href); setNotice('Enlace copiado. Comparte la ruta y la fecha con tu grupo.'); }
    catch { setNotice('Copia el enlace que aparece debajo para compartir tu salida.'); }
  };
  return <section class="outing" aria-labelledby="outing-title">
    <header class="outing-header"><div><p class="eyebrow">DESCUBRE · PREPARA · CUIDA</p>
      <h2 id="outing-title" tabIndex={-1} ref={heading}>Mi salida EcoRuta</h2>
      <p>De encontrar una ruta a salir con un plan. Elige tu ritmo, revisa el tiempo y lleva lo necesario.</p></div>
      <a href="#search-title" class="outing-catalog-link">Ir al catálogo completo ↓</a>
    </header>
    <div class="outing-layout"><div class="outing-discover">
      <h3><span class="outing-step" aria-hidden="true">01</span> Encuentra una ruta para ti</h3>
      <div class="outing-fields">
        <label>Región<select value={preferences.region} onChange={e => setPreference('region', e.currentTarget.value)}>
          <option value="">Todo Chile</option>{!regions.includes(preferences.region) && preferences.region && <option value={preferences.region}>{preferences.region}</option>}
          {regions.map(region => <option key={region} value={region}>{region}</option>)}
        </select></label>
        <label>Tiempo para caminar<select value={preferences.hours} onChange={e => setPreference('hours', Number(e.currentTarget.value))}>
          <option value="2">Hasta 2 horas</option><option value="4">Hasta 4 horas</option><option value="8">Hasta 8 horas</option><option value="24">Hasta 24 horas</option>
        </select></label>
        <label>Dificultad máxima<select value={preferences.level} onChange={e => setPreference('level', e.currentTarget.value)}>
          {Object.entries(levels).map(([value, info]) => <option value={value} key={value}>{info.label}</option>)}
        </select></label>
      </div>
      <p class="outing-fine">Dificultad y duración según el catálogo EcoRutas. Reserva tiempo extra para pausas y traslados; confirma las condiciones con la administración del lugar.</p>
      <div class="outing-switch" role="group" aria-label="Rutas del planificador">
        <button type="button" aria-pressed={!favoritesOnly} onClick={() => setFavoritesOnly(false)}>Para ti</button>
        <button type="button" aria-pressed={favoritesOnly} onClick={() => setFavoritesOnly(true)}>Favoritas ({saved.length})</button>
      </div>
      <p class="outing-results" role="status">{catalogStatus === 'loading' ? 'Buscando rutas del catálogo…' : catalogStatus === 'error' ? 'No pudimos cargar las rutas del planificador.' : favoritesOnly ? `${saved.length} favoritas guardadas. Se muestran aunque no coincidan con tus preferencias.` : `${matching.length} rutas encajan. ${matching.length ? 'Te mostramos hasta 3, priorizando menor dificultad y duración.' : 'Prueba otra región, más tiempo o una dificultad distinta.'}`}</p>
      {catalogStatus === 'error' && <button type="button" onClick={() => setAttempt(attempt + 1)}>Reintentar planificador</button>}
      {catalogStatus === 'ready' && <ul class="outing-options">{shown.map(route => <RouteOption key={route.id} route={route}
        selected={route.id === state.selected} favorite={state.favorites.includes(route.id)} onSelect={() => selectRoute(route)} onFavorite={() => toggleFavorite(route)}
        reason={favoritesOnly ? undefined : `Encaja: ${route.duration_hours} h dentro de tus ${preferences.hours} h y dificultad ${levels[route.difficulty].label.toLowerCase()}.`} />)}</ul>}
      {favoritesOnly && !saved.length && catalogStatus === 'ready' && <p class="outing-empty">Guarda una ruta con el corazón para volver a encontrarla aquí.</p>}
      <p class="outing-fine">{storageAvailable ? 'Tu selección y favoritas se guardan en este navegador, sin crear una cuenta.' : 'El navegador no permite guardar datos. Tu plan funciona durante esta visita; descarga la ficha para conservarlo.'}</p>
    </div>
    <aside class="outing-plan" aria-labelledby="outing-plan-title">
      <h3 id="outing-plan-title" tabIndex={-1} ref={planHeading}><span class="outing-step" aria-hidden="true">02</span> Prepara tu salida</h3>
      {!selected ? <div class="outing-empty"><span class="outing-empty__icon" aria-hidden="true">↗</span>
        <h4>{state.selected && catalogStatus === 'ready' ? 'Esta ruta ya no está en el catálogo' : 'Tu próxima salida empieza aquí'}</h4>
        <p>Elige «Planificar esta ruta» para consultar el pronóstico, preparar tu mochila y llevar una ficha contigo.</p></div> : <>
        <div class="outing-selected"><p class="eyebrow">TU RUTA ELEGIDA</p><h4>{selected.name}</h4><p>{selected.location} · {selected.distance_km} km · {selected.duration_hours} h</p>
          <a href={`?search=${encodeURIComponent(selected.name)}#search-title`}>Ver ficha en el catálogo</a>
          <button type="button" class="outing-favorite" aria-pressed={state.favorites.includes(selected.id)} onClick={() => toggleFavorite(selected)}>{state.favorites.includes(selected.id) ? '♥ Quitar de favoritas' : '♡ Guardar esta ruta'}</button>
          {!matching.some(route => route.id === selected.id) && <p class="outing-fine">Esta ruta no coincide con tus preferencias actuales. Puedes conservarla o elegir otra recomendación.</p>}
        </div>
        <label class="outing-date">Fecha de salida<input type="date" value={preferences.date} min={today} max={addDays(today, 6)} onChange={e => {
          const value = e.currentTarget.value;
          if (value >= today && value <= addDays(today, 6)) setPreference('date', value);
          else { e.currentTarget.value = preferences.date; setNotice('Elige una fecha entre hoy y los próximos 6 días.'); }
        }} /><span class="outing-fine">Próximos 7 días, según la cobertura del pronóstico.</span></label>
        <Weather key={`${selected.id}-${preferences.date}`} route={selected} date={preferences.date} onForecast={setForecast} />
        <fieldset class="outing-checklist"><legend>Tu mochila responsable</legend>
          <p class="outing-fine">{state.checked.length} de {checklist.length} preparativos listos</p>
          {checklist.map(item => <label key={item.id}><input type="checkbox" checked={state.checked.includes(item.id)} onChange={e => {
            const checked = e.currentTarget.checked;
            setState(previous => ({ ...previous, checked: checked ? [...previous.checked, item.id] : previous.checked.filter(id => id !== item.id) }));
          }} /><span>{item.label}</span></label>)}
        </fieldset>
        <details class="outing-access"><summary>Accesibilidad y condiciones del lugar</summary><p>El catálogo no informa pendiente, superficie ni acceso para sillas de ruedas. Una ruta «fácil» no garantiza accesibilidad física. Confirma estos datos con la administración antes de viajar.</p></details>
        <div class="outing-actions"><button class="btn--primary" type="button" onClick={download}>Descargar mi ficha</button><button type="button" onClick={share}>Compartir salida</button></div>
        <p class="outing-fine">La ficha HTML se puede abrir sin conexión e imprimir. El enlace compartido requiere Internet y no incluye tus favoritas ni preparativos personales.</p>
        {shareURL && <label class="outing-share">Enlace de tu salida<input readOnly value={shareURL} onFocus={e => e.currentTarget.select()} /></label>}
      </>}
    </aside></div>
    <p class="outing-notice" role="status" aria-atomic="true">{notice}</p>
  </section>;
}
const root = document.getElementById('outing-root');
if (root) render(<App />, root);
