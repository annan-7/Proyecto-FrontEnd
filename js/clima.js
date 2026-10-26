document.addEventListener('DOMContentLoaded', () => {
  const status = document.querySelector('#clima-status');
  const data = document.querySelector('#clima-data');
  const button = document.querySelector('#clima-retry');
  if (!status || !data || !button) return;
  async function load() {
    button.disabled = true;
    data.hidden = true;
    status.dataset.state = 'loading';
    status.textContent = 'Cargando condiciones actuales…';
    try {
      const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-38.7359&longitude=-72.5904&current=temperature_2m,precipitation,wind_speed_10m&timezone=America%2FSantiago', {signal: AbortSignal.timeout(12000)});
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const body = await response.json();
      const current = body.current;
      if (!current || !['temperature_2m', 'precipitation', 'wind_speed_10m'].every(key => Number.isFinite(current[key])) || typeof current.time !== 'string') throw new Error('Datos incompletos');
      data.textContent = `${current.temperature_2m} °C · Precipitación: ${current.precipitation} mm · Viento: ${current.wind_speed_10m} km/h · Actualizado: ${current.time.replace('T', ' ')} (hora de Chile)`;
      data.hidden = false;
      status.dataset.state = 'success';
      status.textContent = 'Condiciones actualizadas.';
    } catch (error) {
      status.dataset.state = 'error';
      status.textContent = 'No se pudo consultar el clima. Inténtalo nuevamente.';
    } finally { button.disabled = false; }
  }
  button.addEventListener('click', load);
  load();
});
