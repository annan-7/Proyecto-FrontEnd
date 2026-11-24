import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
const built = await build({ entryPoints: ['planner/core.ts'], bundle: true, write: false, format: 'esm', platform: 'node' });
const core = await import(`data:text/javascript;base64,${Buffer.from(built.outputFiles[0].text).toString('base64')}`);
const route = (id, overrides = {}) => ({ id, name: `Ruta ${id}`, location: 'Araucanía', difficulty: 'facil', duration_hours: 2, distance_km: 5, latitude: -38, longitude: -72, description: 'Bosque nativo', ...overrides });
const prefs = { region: 'Araucania', hours: 4, level: 'moderada', date: '2026-11-24' };
test('Recomendaciones respetan región, tiempo y dificultad sin llenar con rutas incompatibles', () => {
  const result = core.recommend([
    route('moderada', { difficulty: 'moderada', duration_hours: 1 }),
    route('larga', { duration_hours: 5 }), route('otra-region', { location: 'Los Lagos' }),
    route('dificil', { difficulty: 'dificil' }), route('desconocida', { difficulty: 'sin verificar' }),
    route('sin-duracion', { duration_hours: 0 }), route('facil'),
  ], prefs);
  assert.deepEqual(result.map(r => r.id), ['facil', 'moderada']);
  assert.deepEqual(core.recommend([route('a')], { ...prefs, region: 'No existe' }), []);
  assert.equal(core.recommend([route('a')], { ...prefs, region: '' }).length, 1);
});
test('Estado recupera favoritos únicos, descarta corrupción y reinicia una fecha vencida', () => {
  const today = '2026-11-24';
  assert.deepEqual(core.restoreState('{broken', today), core.defaultState(today));
  const state = core.restoreState(JSON.stringify({ version: 1, preferences: { ...prefs, date: '2026-11-20', hours: -2, level: 'toString' }, favorites: ['a', 'a', 42], checked: ['waste', 'inventado'] }), today);
  assert.deepEqual(state.favorites, ['a']); assert.deepEqual(state.checked, []);
  assert.equal(state.preferences.date, today); assert.equal(state.preferences.hours, 4); assert.equal(state.preferences.level, 'moderada');
  const future = core.restoreState(JSON.stringify({ ...core.defaultState(today), preferences: {...prefs, date:'2026-11-26'}, checked:['waste','inventado'] }), today);
  assert.deepEqual(future.checked, ['waste']);
  const impossible = core.restoreState(JSON.stringify({ version: 1, preferences: { ...prefs, date: '2026-02-30' } }), '2026-02-27');
  assert.equal(impossible.preferences.date, '2026-02-27');
});
test('Fechas usan el día chileno, incluso al cambiar mes o año', () => {
  assert.equal(core.todayInChile(new Date('2026-11-24T01:00:00Z')), '2026-11-23');
  assert.equal(core.addDays('2026-12-29', 6), '2027-01-04');
});
test('Coordenadas cero válidas, null y rangos imposibles no consultables', () => {
  assert.equal(core.hasCoordinates(route('a', { latitude: 0, longitude: 0 })), true);
  for (const latitude of [null, NaN, 91, '0']) assert.equal(core.hasCoordinates(route('a', { latitude })), false);
});
const body = { daily: { time: ['2026-11-24'], temperature_2m_min: [8], temperature_2m_max: [18], precipitation_probability_max: [80], wind_speed_10m_max: [15], weather_code: [61] } };
test('Pronóstico corresponde al día solicitado y rechaza datos ausentes o incoherentes', () => {
  const parsed = core.parseForecast(body, prefs.date);
  assert.equal(parsed.rain, 80); assert.match(core.forecastAdvice(parsed), /lluvia probable/);
  assert.throws(() => core.parseForecast(body, '2026-11-25'));
  assert.throws(() => core.parseForecast({ daily: { ...body.daily, precipitation_probability_max: [null] } }, prefs.date));
  assert.throws(() => core.parseForecast({ daily: { ...body.daily, precipitation_probability_max: [101] } }, prefs.date));
  assert.match(core.forecastAdvice({ ...parsed, code: 95 }), /tormentas/);
});
test('Ficha portable escapa contenido remoto y diferencia pronóstico válido de fecha ajena', () => {
  const state = { ...core.defaultState(prefs.date), checked: ['waste'] };
  const html = core.portablePlan(route('a', { name: '<script>alert(1)</script>', description: '<img onerror="x">' }), state, core.parseForecast(body, prefs.date));
  assert.ok(html.includes('&lt;script&gt;')); assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('✓ Listo')); assert.ok(html.includes('80 %'));
  assert.ok(!/<(?:script|link|img)\b/.test(html));
  assert.match(core.portablePlan(route('a'), state, { ...core.parseForecast(body, prefs.date), date: '2026-11-25' }), /Pronóstico no disponible/);
});
test('Cliente meteorológico usa coordenadas de la ruta, unidades explícitas y propaga errores', async () => {
  const originalFetch = globalThis.fetch;
  const controller = new AbortController();
  let request;
  try {
    globalThis.fetch = async (url, options) => {
      request = { url: new URL(url), options };
      return { ok: true, json: async () => body };
    };
    const forecast = await core.fetchForecast(route('a', {latitude:0,longitude:0}), prefs.date, controller.signal);
    assert.equal(forecast.max,18);
    assert.equal(request.url.searchParams.get('latitude'), '0');
    assert.equal(request.url.searchParams.get('wind_speed_unit'), 'kmh');
    assert.equal(request.options.signal, controller.signal);
    globalThis.fetch = async () => ({ok:false,status:503});
    await assert.rejects(core.fetchForecast(route('a'), prefs.date, controller.signal), /503/);
    await assert.rejects(core.fetchForecast(route('a', {latitude:null}), prefs.date, controller.signal), /Ubicación/);
  } finally { globalThis.fetch = originalFetch; }
});
