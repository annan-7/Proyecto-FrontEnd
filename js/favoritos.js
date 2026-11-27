"use strict";
// Favoritos compartidos entre el catálogo, la ficha y el planificador "Mi salida".
// Se guardan en la misma clave que usa el planificador para que todo quede sincronizado.
const EcoFavorites = (() => {
    const storageKey = 'ecorutas-salida-v1';
    const eventName = 'ecoruta:favorites-changed';
    const readState = () => {
        try {
            const value = JSON.parse(localStorage.getItem(storageKey) || 'null');
            return value && typeof value === 'object' && value.version === 1 ? value : { version: 1 };
        }
        catch {
            return { version: 1 };
        }
    };
    const list = () => {
        const favorites = readState().favorites;
        return Array.isArray(favorites) ? favorites.filter((id) => typeof id === 'string') : [];
    };
    const has = (id) => list().includes(id);
    /** Marca o desmarca una ruta. Devuelve el nuevo estado, o null si no se pudo guardar. */
    const toggle = (id) => {
        const state = readState();
        const current = list();
        const saved = !current.includes(id);
        state.favorites = saved ? [...current, id] : current.filter(item => item !== id);
        try {
            localStorage.setItem(storageKey, JSON.stringify(state));
        }
        catch {
            return null;
        }
        document.dispatchEvent(new CustomEvent(eventName, { detail: state.favorites }));
        return saved;
    };
    // Otra pestaña modificó los favoritos.
    window.addEventListener('storage', event => {
        if (event.key === storageKey)
            document.dispatchEvent(new CustomEvent(eventName, { detail: list() }));
    });
    /** Pinta un botón de favorito (estado, texto e icono accesibles). */
    const paint = (button, id, name) => {
        const saved = has(id);
        button.setAttribute('aria-pressed', String(saved));
        button.setAttribute('aria-label', `${saved ? 'Quitar de' : 'Guardar en'} favoritas: ${name}`);
        button.classList.toggle('favorite-toggle--active', saved);
        button.innerHTML = `<span aria-hidden="true">${saved ? '♥' : '♡'}</span><span>${saved ? 'Favorita' : 'Guardar'}</span>`;
    };
    return { list, has, toggle, paint, eventName };
})();
