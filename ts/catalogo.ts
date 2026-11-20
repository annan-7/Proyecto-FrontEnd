interface EcoRoute {
  id: string; image_url?: string; name: string; description: string; location: string;
  distance_km: number; duration_hours: number; difficulty: string; route_type: string;
  latitude: number | null; longitude: number | null; is_active: boolean;
}
const EcoCatalog = (() => {
  let request: Promise<EcoRoute[]> | undefined;
  const load = async (): Promise<EcoRoute[]> => {
    const routes: EcoRoute[] = [];
    let total = 0;
    do {
      const response = await fetch(`https://ecorutas-api.vercel.app/api/v1/routes?limit=100&skip=${routes.length}`, { signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error(`API HTTP ${response.status}`);
      const page = await response.json();
      if (!Array.isArray(page.items) || !Number.isInteger(page.total) || page.total < 0) throw new Error('Catálogo inválido');
      if (page.items.some((r: EcoRoute) => !r || typeof r.id !== 'string' || typeof r.name !== 'string' || typeof r.location !== 'string' || !Number.isFinite(r.distance_km) || !Number.isFinite(r.duration_hours))) throw new Error('Ruta inválida');
      total = page.total;
      if (!page.items.length && routes.length < total) throw new Error('Catálogo incompleto');
      routes.push(...page.items);
    } while (routes.length < total);
    return routes.filter(route => route.is_active !== false);
  };
  return { load: () => request ??= load().catch(error => { request = undefined; throw error; }) };
})();
