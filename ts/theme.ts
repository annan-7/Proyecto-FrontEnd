(() => {
  type Theme = 'light' | 'dark' | 'system';
  const media = matchMedia('(prefers-color-scheme: dark)');
  const valid = (value: string | null): Theme => value === 'light' || value === 'dark' ? value : 'system';
  let preference: Theme = 'system';
  try { preference = valid(localStorage.getItem('ecorutas-theme')); } catch { /* System preference works without storage. */ }
  const apply = () => {
    const next = preference === 'system' ? (media.matches ? 'dark' : 'light') : preference;
    const changed = document.documentElement.dataset.theme !== next;
    document.documentElement.dataset.theme = next;
    document.documentElement.dataset.themePreference = preference;
    const select = document.querySelector<HTMLSelectElement>('#theme-select');
    if (select) select.value = preference;
    if (changed) document.dispatchEvent(new Event('themechange'));
  };
  apply();
  media.addEventListener('change', apply);
  window.addEventListener('storage', event => {
    if (event.key === 'ecorutas-theme' || event.key === null) { preference = valid(event.newValue); apply(); }
  });
  document.addEventListener('DOMContentLoaded', () => {
    apply();
    document.querySelector<HTMLSelectElement>('#theme-select')?.addEventListener('change', event => {
      preference = valid((event.target as HTMLSelectElement).value);
      try { localStorage.setItem('ecorutas-theme', preference); } catch { /* Keep the in-memory selection. */ }
      apply();
    });
  });
})();
