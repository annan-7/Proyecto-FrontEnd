"use strict";
(() => {
    const normalize = (value) => value
        .toLocaleLowerCase('es')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    const loadCatalog = async () => {
        const grid = document.querySelector('.routes-grid');
        const template = grid?.querySelector('.route-card')?.cloneNode(true);
        if (!grid || !template)
            return;
        grid.replaceChildren();
        const status = document.createElement('p');
        status.setAttribute('role', 'status');
        grid.before(status);
        const retry = document.createElement('button');
        retry.type = 'button';
        retry.textContent = 'Reintentar carga';
        retry.hidden = true;
        status.after(retry);
        const load = async () => {
            retry.hidden = true;
            status.textContent = 'Cargando rutas…';
            try {
                const routes = await EcoCatalog.load();
                const difficulty = { facil: ['easy', 'Fácil'], moderada: ['medium', 'Moderada'], dificil: ['hard', 'Difícil'], experto: ['expert', 'Experto'] };
                const cards = routes.map(route => {
                    const card = template.cloneNode(true);
                    const [level, label] = difficulty[route.difficulty] || ['', route.difficulty];
                    Object.assign(card.dataset, { category: route.route_type === 'trekking' ? 'senderismo trekking' : route.route_type, difficulty: level, distance: String(route.distance_km), duration: String(route.duration_hours), description: route.description });
                    card.querySelector('h3').textContent = route.name;
                    card.querySelector('.route-card__location').textContent = route.location;
                    const badge = card.querySelector('.route-card__badge');
                    badge.textContent = label;
                    badge.className = `route-card__badge route-card__badge--${level === 'expert' ? 'hard' : level}`;
                    const meta = card.querySelectorAll('.route-card__meta-item');
                    meta[0].textContent = `${route.distance_km} km`;
                    meta[1].textContent = `${route.duration_hours} h`;
                    const image = card.querySelector('img');
                    image.removeAttribute('srcset');
                    image.removeAttribute('sizes');
                    const fallback = () => { image.onerror = null; image.src = '../assets/imagenes/ruta-sin-foto.svg'; image.alt = 'Ilustración de montaña; no representa la ruta'; };
                    fallback();
                    try {
                        const url = new URL(route.image_url || '');
                        if (url.protocol === 'https:') {
                            image.onerror = fallback;
                            image.src = url.href;
                            image.alt = `Paisaje de referencia de ${route.name}`;
                        }
                    }
                    catch { /* Use the local illustration for missing images. */ }
                    card.dataset.routeId = route.id;
                    // "Ver detalles" pasa a ser un enlace real a la ficha (ruta.html?id=...).
                    const oldDetails = card.querySelector('[data-route-details]');
                    const details = document.createElement('a');
                    details.className = 'route-card__link';
                    details.href = `ruta.html?id=${encodeURIComponent(route.id)}`;
                    details.setAttribute('aria-label', `Ver ficha de ${route.name}`);
                    details.innerHTML = oldDetails?.innerHTML || 'Ver detalles';
                    details.addEventListener('click', () => EcoFilters.rememberRoute(route.id));
                    oldDetails?.replaceWith(details);
                    // Botón de favorito sobre la imagen.
                    const favorite = document.createElement('button');
                    favorite.type = 'button';
                    favorite.className = 'favorite-toggle route-card__favorite';
                    favorite.dataset.favoriteId = route.id;
                    EcoFavorites.paint(favorite, route.id, route.name);
                    favorite.addEventListener('click', () => {
                        if (EcoFavorites.toggle(route.id) === null)
                            favorite.setAttribute('title', 'No fue posible guardar en este navegador');
                    });
                    card.querySelector('.route-card__image-wrapper').append(favorite);
                    card.classList.toggle('route-card--favorite', EcoFavorites.has(route.id));
                    const planButton = document.createElement('button');
                    planButton.type = 'button';
                    planButton.className = 'route-card__plan';
                    planButton.textContent = 'Preparar mi salida';
                    planButton.setAttribute('aria-label', `Preparar mi salida: ${route.name}`);
                    planButton.addEventListener('click', () => document.dispatchEvent(new CustomEvent('ecoruta:plan-route', { detail: route.id })));
                    card.querySelector('.route-card__content').append(planButton);
                    return card;
                });
                grid.replaceChildren(...cards);
                const distance = document.querySelector('#filter-distance');
                if (distance) {
                    distance.max = String(Math.max(50, ...routes.map(r => Math.ceil(r.distance_km))));
                    distance.value = distance.max;
                    distance.setAttribute('aria-valuemax', distance.max);
                }
                status.textContent = routes.length ? '' : 'No hay rutas disponibles en este momento.';
                const count = document.querySelector('#results-number');
                if (count)
                    count.textContent = String(routes.length);
                initRoutes();
                // Al volver desde una ficha, devolver el foco a la tarjeta visitada.
                const lastId = EcoFilters.takeLastRoute();
                const lastCard = lastId ? cards.find(card => card.dataset.routeId === lastId && !card.hidden) : undefined;
                if (lastCard) {
                    lastCard.scrollIntoView({ block: 'center' });
                    lastCard.querySelector('.route-card__link')?.focus({ preventScroll: true });
                }
            }
            catch {
                status.textContent = 'No se pudieron cargar las rutas. Comprueba tu conexión y reintenta.';
                retry.hidden = false;
                const count = document.querySelector('#results-number');
                if (count)
                    count.textContent = '0';
            }
        };
        retry.addEventListener('click', load);
        await load();
    };
    const initRoutes = () => {
        const form = document.querySelector('.search-form');
        const input = document.querySelector('#search-input');
        const cards = [...document.querySelectorAll('.route-card')];
        const chips = [...document.querySelectorAll('.chip')];
        const difficulty = document.querySelector('#filter-difficulty');
        ;
        const distance = document.querySelector('#filter-distance');
        const duration = document.querySelector('#filter-duration');
        const output = document.querySelector('.filter-group__output');
        const clearButton = document.querySelector('.filters__clear');
        const count = document.querySelector('#results-number');
        const empty = document.querySelector('.results__empty');
        if (!form || !input || !cards.length || !count || !empty)
            return;
        // Restaurar filtros desde la URL o desde la sesión (al volver de una ficha u otra página).
        const restored = EcoFilters.initial();
        let selectedType = chips.some(chip => chip.dataset.filter === restored.tipo) ? restored.tipo : 'all';
        let favoritesOnly = restored.favoritas === '1';
        input.value = restored.buscar;
        if (difficulty && [...difficulty.options].some(option => option.value === restored.dificultad))
            difficulty.value = restored.dificultad;
        if (duration && [...duration.options].some(option => option.value === restored.duracion))
            duration.value = restored.duracion;
        if (distance && restored.distancia && Number(restored.distancia) >= Number(distance.min))
            distance.value = String(Math.min(Number(restored.distancia), Number(distance.max)));
        const paintChips = () => chips.forEach((item) => {
            const active = item.dataset.filter === selectedType;
            item.classList.toggle('chip--active', active);
            item.setAttribute('aria-pressed', String(active));
        });
        paintChips();
        // Abrir los filtros avanzados si alguno está en uso, para que se vean.
        if ((difficulty?.value || duration?.value || (distance && distance.value !== distance.max)))
            document.querySelector('.filters__advanced')?.setAttribute('open', '');
        // Interruptor "Solo favoritas".
        const favoritesButton = document.createElement('button');
        favoritesButton.type = 'button';
        favoritesButton.className = 'chip chip--favorites';
        favoritesButton.innerHTML = '<span aria-hidden="true">♥</span> Solo favoritas';
        document.querySelector('.filters__chips')?.append(favoritesButton);
        const paintFavoritesButton = () => {
            favoritesButton.classList.toggle('chip--active', favoritesOnly);
            favoritesButton.setAttribute('aria-pressed', String(favoritesOnly));
        };
        favoritesButton.addEventListener('click', () => { favoritesOnly = !favoritesOnly; paintFavoritesButton(); update(); });
        paintFavoritesButton();
        // Resumen visible de filtros activos.
        const summary = document.createElement('p');
        summary.className = 'filters__summary';
        summary.id = 'filters-summary';
        document.querySelector('.results__count')?.after(summary);
        const chipLabel = (value) => chips.find(chip => chip.dataset.filter === value)?.textContent?.trim() || value;
        const optionLabel = (select) => select?.selectedOptions[0]?.textContent?.trim() || '';
        document.querySelector('.results__empty-clear')?.addEventListener('click', () => { clearButton?.click(); input.focus(); });
        const update = () => {
            const query = normalize(input.value.trim());
            const maximumDistance = Number(distance?.value || 50);
            const selectedDifficulty = difficulty?.value || '';
            const maximumDuration = duration?.value || '';
            let visible = 0;
            cards.forEach((card) => {
                const searchableText = normalize(card.textContent || '');
                const cardTypes = card.dataset.category || '';
                const cardDuration = Number(card.dataset.duration || 0);
                const matchesQuery = !query || searchableText.includes(query);
                const matchesType = selectedType === 'all' || cardTypes.includes(selectedType);
                const matchesDifficulty = !selectedDifficulty || card.dataset.difficulty === selectedDifficulty;
                const matchesDistance = Number(card.dataset.distance || 0) <= maximumDistance;
                const matchesDuration = !maximumDuration
                    || (maximumDuration === '24' ? cardDuration > 8 : cardDuration <= Number(maximumDuration));
                const matchesFavorite = !favoritesOnly || EcoFavorites.has(card.dataset.routeId || '');
                const isVisible = matchesQuery && matchesType && matchesDifficulty && matchesDistance && matchesDuration && matchesFavorite;
                card.hidden = !isVisible;
                if (isVisible)
                    visible += 1;
            });
            count.textContent = String(visible);
            if (count.nextSibling)
                count.nextSibling.textContent = visible === 1 ? " ruta encontrada" : " rutas encontradas";
            empty.hidden = visible !== 0;
            if (output && distance) {
                output.textContent = `${distance.value} km`;
                distance.setAttribute('aria-valuenow', distance.value);
                distance.setAttribute('aria-valuetext', `${distance.value} kilómetros`);
            }
            const emptyText = document.querySelector('.results__empty-text');
            if (emptyText)
                emptyText.textContent = favoritesOnly && !EcoFavorites.list().length
                    ? 'Aún no guardas rutas favoritas. Usa el botón «Guardar» de cada tarjeta.'
                    : 'No se encontraron rutas con estos filtros. Intenta ajustarlos o buscar con otros términos.';
            const distanceLimited = !!distance && distance.value !== distance.max;
            const active = [
                input.value.trim() && `Búsqueda: «${input.value.trim()}»`,
                selectedType !== 'all' && `Tipo: ${chipLabel(selectedType)}`,
                selectedDifficulty && `Dificultad: ${optionLabel(difficulty)}`,
                distanceLimited && `Hasta ${distance.value} km`,
                maximumDuration && `Duración: ${optionLabel(duration)}`,
                favoritesOnly && 'Solo favoritas',
            ].filter(Boolean);
            summary.textContent = active.length ? `Filtros activos: ${active.join(' · ')}` : '';
            summary.hidden = !active.length;
            clearButton?.classList.toggle('filters__clear--active', active.length > 0);
            EcoFilters.save({
                buscar: input.value.trim(), tipo: selectedType, dificultad: selectedDifficulty,
                distancia: distanceLimited ? distance.value : '', duracion: maximumDuration, favoritas: favoritesOnly ? '1' : '',
            });
        };
        // Mantener marcadas las tarjetas cuando cambian los favoritos (catálogo, planificador u otra pestaña).
        document.addEventListener(EcoFavorites.eventName, () => {
            cards.forEach(card => {
                const id = card.dataset.routeId || '';
                const button = card.querySelector('[data-favorite-id]');
                if (button)
                    EcoFavorites.paint(button, id, card.querySelector('h3')?.textContent || '');
                card.classList.toggle('route-card--favorite', EcoFavorites.has(id));
            });
            update();
        });
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            update();
        });
        input.addEventListener('input', update);
        [difficulty, distance, duration].forEach((control) => control?.addEventListener('input', update));
        [difficulty, duration].forEach((control) => control?.addEventListener('change', update));
        chips.forEach((chip) => {
            chip.addEventListener('click', () => {
                selectedType = chip.dataset.filter || 'all';
                paintChips();
                update();
            });
        });
        clearButton?.addEventListener('click', () => {
            input.value = '';
            selectedType = 'all';
            if (difficulty)
                difficulty.value = '';
            if (distance)
                distance.value = distance.max;
            if (duration)
                duration.value = '';
            favoritesOnly = false;
            paintChips();
            paintFavoritesButton();
            update();
        });
        update();
    };
    const initContactForm = () => {
        const form = document.querySelector('.contacto-form');
        const status = document.querySelector('#form-status');
        if (!form || !status)
            return;
        form.noValidate = true;
        const fields = [...form.querySelectorAll('input, textarea')];
        fields.forEach(field => {
            const error = document.createElement('p');
            error.id = `${field.id}-error`;
            error.className = 'field-error';
            error.hidden = true;
            field.after(error);
            field.setAttribute('aria-describedby', error.id);
            field.addEventListener('input', () => {
                field.removeAttribute('aria-invalid');
                error.hidden = true;
                status.textContent = '';
            });
        });
        form.addEventListener('submit', event => {
            event.preventDefault();
            let firstInvalid;
            fields.forEach(field => {
                const error = document.getElementById(`${field.id}-error`);
                const invalid = !field.value.trim() || !field.validity.valid;
                field.setAttribute('aria-invalid', String(invalid));
                error.hidden = !invalid;
                error.textContent = !field.value.trim() ? 'Completa este campo.' : 'Escribe un correo válido, por ejemplo nombre@dominio.cl.';
                if (invalid && !firstInvalid)
                    firstInvalid = field;
            });
            if (firstInvalid) {
                status.textContent = 'Revisa los campos señalados.';
                status.dataset.state = 'error';
                firstInvalid.focus();
                return;
            }
            status.textContent = 'Mensaje validado. Esta demostración no envía ni almacena mensajes. Tu texto permanece aquí para que puedas copiarlo.';
            status.dataset.state = 'success';
        });
    };
    document.addEventListener('DOMContentLoaded', () => {
        void loadCatalog();
        initContactForm();
    });
})();
