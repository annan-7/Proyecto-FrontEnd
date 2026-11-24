export interface Route {
  id: string; name: string; location: string; description: string;
  difficulty: string; distance_km: number; duration_hours: number;
  latitude: number | null; longitude: number | null;
}
export interface Preferences { region: string; hours: number; level: string; date: string }
export interface PlanState {
  version: 1; preferences: Preferences; favorites: string[]; selected: string; checked: string[];
}
export interface Forecast {
  date: string; min: number; max: number; rain: number; wind: number; code: number; fetchedAt: string;
}
export const levels: Record<string, { rank: number; label: string }> = {
  facil: { rank: 1, label: 'Fácil' }, moderada: { rank: 2, label: 'Moderada' },
  dificil: { rank: 3, label: 'Difícil' }, experto: { rank: 4, label: 'Experto' },
};
export const checklist = [
  { id: 'access', label: 'Confirmé apertura, permisos y condiciones con la administración del lugar.' },
  { id: 'equipment', label: 'Preparé agua, abrigo, protección solar y calzado adecuado.' },
  { id: 'contact', label: 'Avisé mi ruta y hora estimada de regreso a una persona de confianza.' },
  { id: 'waste', label: 'Llevo botella reutilizable y una bolsa para traer todos mis residuos.' },
  { id: 'local', label: 'Consideré comprar provisiones a un emprendimiento local.' },
];
export const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export function todayInChile(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en', { timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  return ['year', 'month', 'day'].map(key => parts.find(p => p.type === key)!.value).join('-');
}
export function addDays(day: string, amount: number): string {
  const date = new Date(`${day}T12:00:00Z`); date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}
export function defaultState(today = todayInChile()): PlanState {
  return { version: 1, preferences: { region: 'Araucanía', hours: 4, level: 'moderada', date: today }, favorites: [], selected: '', checked: [] };
}
export function restoreState(raw: string | null, today = todayInChile()): PlanState {
  const fallback = defaultState(today);
  try {
    const value = JSON.parse(raw || 'null');
    if (!value || value.version !== 1) return fallback;
    const p = value.preferences || {};
    const validDate = typeof p.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(p.date) && p.date >= today && p.date <= addDays(today, 6)
      && new Date(`${p.date}T12:00:00Z`).toISOString().slice(0, 10) === p.date;
    const strings = (items: unknown): string[] => Array.isArray(items) ? [...new Set(items.filter((v): v is string => typeof v === 'string' && v.length < 200))].slice(0, 200) : [];
    return { version: 1, preferences: {
      region: typeof p.region === 'string' && p.region.length < 100 ? p.region : fallback.preferences.region,
      hours: [2, 4, 8, 24].includes(p.hours) ? p.hours : 4,
      level: Object.prototype.hasOwnProperty.call(levels, p.level) ? p.level : 'moderada', date: validDate ? p.date : today,
    }, favorites: strings(value.favorites), selected: typeof value.selected === 'string' ? value.selected.slice(0, 200) : '',
    checked: validDate ? strings(value.checked).filter(id => checklist.some(item => item.id === id)) : [] };
  } catch { return fallback; }
}
export function recommend(routes: Route[], p: Preferences): Route[] {
  return routes.filter(route => (!p.region || normalize(route.location) === normalize(p.region))
    && route.duration_hours > 0 && route.duration_hours <= p.hours && route.distance_km > 0
    && levels[route.difficulty]?.rank <= levels[p.level]?.rank)
    .sort((a, b) => levels[a.difficulty].rank - levels[b.difficulty].rank || a.duration_hours - b.duration_hours || a.name.localeCompare(b.name, 'es'));
}
export function hasCoordinates(route: Route): boolean {
  return typeof route.latitude === 'number' && Number.isFinite(route.latitude) && Math.abs(route.latitude) <= 90
    && typeof route.longitude === 'number' && Number.isFinite(route.longitude) && Math.abs(route.longitude) <= 180;
}
export function forecastAdvice(forecast: Forecast): string {
  if (forecast.code >= 95) return 'Se pronostican tormentas. Considera cambiar la fecha y consulta avisos oficiales.';
  if (forecast.wind >= 40 || forecast.rain >= 70) return 'Se prevé lluvia probable o viento fuerte. Revisa condiciones y considera otra fecha.';
  if (forecast.max >= 30) return 'Se prevé calor. Planifica hidratación, protección solar y evita las horas de mayor exposición.';
  if (forecast.min <= 0) return 'Se prevén temperaturas bajo cero. Revisa hielo y equipamiento antes de salir.';
  return 'Revisa el pronóstico nuevamente antes de salir y confirma el estado del sendero.';
}
export function parseForecast(body: any, date: string): Forecast {
  const daily = body?.daily;
  const index = Array.isArray(daily?.time) ? daily.time.indexOf(date) : -1;
  const read = (key: string) => daily?.[key]?.[index];
  const values = ['temperature_2m_min', 'temperature_2m_max', 'precipitation_probability_max', 'wind_speed_10m_max', 'weather_code'].map(read);
  if (index < 0 || !values.every(v => typeof v === 'number' && Number.isFinite(v))) throw new Error('Pronóstico incompleto');
  const [min, max, rain, wind, code] = values;
  if (rain < 0 || rain > 100 || wind < 0 || min > max) throw new Error('Pronóstico inválido');
  return { date, min, max, rain, wind, code, fetchedAt: new Date().toISOString() };
}
export async function fetchForecast(route: Route, date: string, signal: AbortSignal): Promise<Forecast> {
  if (!hasCoordinates(route)) throw new Error('Ubicación no disponible');
  const query = new URLSearchParams({ latitude: String(route.latitude), longitude: String(route.longitude),
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,weather_code',
    timezone: 'America/Santiago', forecast_days: '7', temperature_unit: 'celsius', wind_speed_unit: 'kmh' });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${query}`, { signal });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return parseForecast(await response.json(), date);
}
const escapeHTML = (value: unknown) => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!));
export function portablePlan(route: Route, state: PlanState, forecast: Forecast | null): string {
  const e = escapeHTML;
  return `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mi salida EcoRuta · ${e(route.name)}</title>
  <style>body{font:17px/1.6 system-ui,sans-serif;max-width:760px;margin:32px auto;padding:0 24px;color:#202c27;background:#fff}h1,h2{line-height:1.2}li{margin:12px 0}section{border-top:1px solid #ccd6cf;margin-top:24px;padding-top:16px}a{color:#245c44}small{display:block}</style>
  <body><p>ECORUTA · MI SALIDA</p><h1>${e(route.name)}</h1><p>${e(route.location)} · ${e(state.preferences.date)}</p>
  <p>${e(route.distance_km)} km · ${e(route.duration_hours)} h de recorrido · ${e(levels[route.difficulty]?.label || route.difficulty)}</p>
  <p>${e(route.description)}</p><p>La duración no incluye traslados ni pausas. Accesibilidad física del sendero: información no disponible; confirmar con su administración.</p>
  ${hasCoordinates(route) ? `<p>Punto de referencia: ${e(route.latitude)}, ${e(route.longitude)}. No corresponde al trazado completo.</p>` : '<p>Sin coordenadas disponibles.</p>'}
  <section><h2>Pronóstico para tu salida</h2>${forecast && forecast.date === state.preferences.date ? `<p>${e(forecast.min)} a ${e(forecast.max)} °C · lluvia ${e(forecast.rain)} % · viento máximo ${e(forecast.wind)} km/h</p><p>${e(forecastAdvice(forecast))}</p><small>Fuente: Open-Meteo. Consultado ${e(forecast.fetchedAt)} (UTC). Copia estática; puede cambiar.</small>` : '<p>Pronóstico no disponible. Consúltalo antes de salir.</p>'}
  <p>El pronóstico es orientativo y no certifica seguridad ni apertura de la ruta.</p></section>
  <section><h2>Preparación y cuidado del territorio</h2><ul>${checklist.map(item => `<li>${state.checked.includes(item.id) ? '✓ Listo' : '□ Pendiente'}: ${e(item.label)}</li>`).join('')}</ul></section>
  <section><h2>Antes de salir</h2><p>Respeta senderos habilitados, flora y fauna. Confirma transporte y servicios locales; esta ficha no es una reserva ni un mapa de navegación.</p><p>Fuente del recorrido: catálogo EcoRutas. Ficha creada ${e(new Date().toISOString())} (UTC).</p></section></body></html>`;
}
