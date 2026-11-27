// Persistencia de filtros del catálogo: se reflejan en la URL (?buscar=...&tipo=...)
// y se guardan en sessionStorage para recuperarlos al volver desde otra vista.
interface EcoFilterState { buscar: string; tipo: string; dificultad: string; distancia: string; duracion: string; favoritas: string; }

const EcoFilters = (() => {
  const storageKey = 'ecorutas-filtros-v1';
  const lastRouteKey = 'ecorutas-ultima-ruta';
  const keys: (keyof EcoFilterState)[] = ['buscar', 'tipo', 'dificultad', 'distancia', 'duracion', 'favoritas'];
  const empty = (): EcoFilterState => ({ buscar: '', tipo: 'all', dificultad: '', distancia: '', duracion: '', favoritas: '' });

  const fromParams = (params: URLSearchParams): EcoFilterState => {
    const state = empty();
    keys.forEach(key => { const value = params.get(key); if (value) state[key] = value.slice(0, 100); });
    // Compatibilidad con los parámetros antiguos (?search=, ?difficulty=) usados desde el inicio.
    if (!state.buscar && params.get('search')) state.buscar = params.get('search')!.slice(0, 100);
    if (!state.dificultad && params.get('difficulty')) state.dificultad = params.get('difficulty')!.slice(0, 20);
    return state;
  };

  const toQuery = (state: EcoFilterState): string => {
    const params = new URLSearchParams();
    keys.forEach(key => { const value = state[key]; if (value && !(key === 'tipo' && value === 'all')) params.set(key, value); });
    const query = params.toString();
    return query ? `?${query}` : '';
  };

  const saved = (): string => { try { return sessionStorage.getItem(storageKey) || ''; } catch { return ''; } };

  /** Filtros iniciales: los de la URL tienen prioridad; si no hay, los guardados en la sesión. */
  const initial = (): EcoFilterState => {
    const current = new URLSearchParams(location.search);
    const hasUrlFilters = [...keys, 'search', 'difficulty'].some(key => current.has(key));
    return fromParams(hasUrlFilters ? current : new URLSearchParams(saved()));
  };

  const save = (state: EcoFilterState) => {
    const query = toQuery(state);
    try { sessionStorage.setItem(storageKey, query); } catch { /* Solo URL. */ }
    history.replaceState(history.state, '', `${location.pathname}${query}${location.hash}`);
  };

  /** Enlace al catálogo conservando los filtros de la sesión. */
  const catalogHref = (base = 'rutas.html') => `${base}${saved()}`;

  const rememberRoute = (id: string) => { try { sessionStorage.setItem(lastRouteKey, id); } catch { /* Opcional. */ } };
  const takeLastRoute = (): string => {
    try { const id = sessionStorage.getItem(lastRouteKey) || ''; sessionStorage.removeItem(lastRouteKey); return id; } catch { return ''; }
  };

  return { initial, save, empty, catalogHref, rememberRoute, takeLastRoute };
})();
