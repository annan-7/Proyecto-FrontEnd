(() => {
  const normalize = (value: string) => value
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const loadCatalog = async () => {
    const grid = document.querySelector<HTMLElement>('.routes-grid');
    const template = grid?.querySelector<HTMLElement>('.route-card')?.cloneNode(true) as HTMLElement | undefined;
    if (!grid || !template) return;
    grid.replaceChildren();
    const status = document.createElement('p');
    status.setAttribute('role', 'status');
    grid.before(status);
    const retry = document.createElement('button');
    retry.type = 'button'; retry.textContent = 'Reintentar carga'; retry.hidden = true;
    status.after(retry);
    const load = async () => {
      retry.hidden = true; status.textContent = 'Cargando rutas…';
      try {
        const routes = await EcoCatalog.load();
        const difficulty: Record<string, [string, string]> = { facil: ['easy', 'Fácil'], moderada: ['medium', 'Moderada'], dificil: ['hard', 'Difícil'], experto: ['expert', 'Experto'] };
        const cards = routes.map(route => {
          const card = template.cloneNode(true) as HTMLElement;
          const [level, label] = difficulty[route.difficulty] || ['', route.difficulty];
          Object.assign(card.dataset, { category: route.route_type === 'trekking' ? 'senderismo trekking' : route.route_type, difficulty: level, distance: String(route.distance_km), duration: String(route.duration_hours), description: route.description });
          card.querySelector('h3')!.textContent = route.name;
          card.querySelector('.route-card__location')!.textContent = route.location;
          const badge = card.querySelector<HTMLElement>('.route-card__badge')!;
          badge.textContent = label; badge.className = `route-card__badge route-card__badge--${level === 'expert' ? 'hard' : level}`;
          const meta = card.querySelectorAll('.route-card__meta-item');
          meta[0].textContent = `${route.distance_km} km`; meta[1].textContent = `${route.duration_hours} h`;
          const image = card.querySelector('img')!;
          image.removeAttribute('srcset'); image.removeAttribute('sizes');
          const fallback = () => { image.onerror = null; image.src = '../assets/imagenes/ruta-sin-foto.svg'; image.alt = 'Ilustración de montaña; no representa la ruta'; };
          fallback();
          try {
            const url = new URL(route.image_url || '');
            if (url.protocol === 'https:') { image.onerror = fallback; image.src = url.href; image.alt = `Paisaje de referencia de ${route.name}`; }
          } catch { /* Use the local illustration for missing images. */ }
          card.querySelector('button')!.setAttribute('aria-label', `Ver detalles de ${route.name}`);
          const planButton = document.createElement('button');
          planButton.type = 'button'; planButton.className = 'route-card__plan';
          planButton.textContent = 'Preparar mi salida';
          planButton.setAttribute('aria-label', `Preparar mi salida: ${route.name}`);
          planButton.addEventListener('click', () => document.dispatchEvent(new CustomEvent('ecoruta:plan-route', { detail: route.id })));
          card.querySelector('.route-card__content')!.append(planButton);
          return card;
        });
        grid.replaceChildren(...cards);
        const distance = document.querySelector<HTMLInputElement>('#filter-distance');
        if (distance) { distance.max = String(Math.max(50, ...routes.map(r => Math.ceil(r.distance_km)))); distance.value = distance.max; distance.setAttribute('aria-valuemax', distance.max); }
        status.textContent = routes.length ? '' : 'No hay rutas disponibles en este momento.';
        const count = document.querySelector('#results-number'); if (count) count.textContent = String(routes.length);
        initRoutes(); initDetails();
      } catch {
        status.textContent = 'No se pudieron cargar las rutas. Comprueba tu conexión y reintenta.';
        retry.hidden = false;
        const count = document.querySelector('#results-number'); if (count) count.textContent = '0';
      }
    };
    retry.addEventListener('click', load);
    await load();
  };

  const initRoutes = () => {
    const form = document.querySelector('.search-form') as HTMLFormElement | null;
    const input = document.querySelector('#search-input') as HTMLInputElement | null;
    const cards = [...document.querySelectorAll('.route-card')] as HTMLElement[];
    const chips = [...document.querySelectorAll('.chip')] as HTMLElement[];
    const difficulty = document.querySelector('#filter-difficulty') as HTMLSelectElement | null;;
    const distance = document.querySelector('#filter-distance') as HTMLInputElement | null;
    const duration = document.querySelector('#filter-duration') as HTMLSelectElement | null;
    const output = document.querySelector('.filter-group__output') as HTMLElement | null;
    const clearButton = document.querySelector('.filters__clear')as HTMLButtonElement | null;
    const count = document.querySelector('#results-number') as HTMLElement | null;
    const empty = document.querySelector('.results__empty') as HTMLElement | null;

    if (!form || !input || !cards.length || !count || !empty) return;

    let selectedType = 'all';
    const params = new URLSearchParams(location.search);
    input.value = params.get('search') || '';
    if (difficulty) difficulty.value = params.get('difficulty') || '';
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
        const isVisible = matchesQuery && matchesType && matchesDifficulty && matchesDistance && matchesDuration;

        card.hidden = !isVisible;
        if (isVisible) visible += 1;
      });

      count.textContent = String(visible);
      if (count.nextSibling) count.nextSibling.textContent = visible === 1 ? " ruta encontrada" : " rutas encontradas";
      empty.hidden = visible !== 0;
      if (output && distance) {
        output.textContent = `${distance.value} km`;
        distance.setAttribute('aria-valuenow', distance.value);
        distance.setAttribute('aria-valuetext', `${distance.value} kilómetros`);
      }
    };

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
        chips.forEach((item) => {
          const active = item === chip;
          item.classList.toggle('chip--active', active);
          item.setAttribute('aria-pressed', String(active));
        });
        update();
      });
    });

    clearButton?.addEventListener('click', () => {
      input.value = '';
      selectedType = 'all';
      if (difficulty) difficulty.value = '';
      if (distance) distance.value = distance.max;
      if (duration) duration.value = '';
      chips.forEach((chip) => {
        const active = chip.dataset.filter === 'all';
        chip.classList.toggle('chip--active', active);
        chip.setAttribute('aria-pressed', String(active));
      });
      update();
    });

    update();
  };

  const initContactForm = () => {
    const form = document.querySelector<HTMLFormElement>('.contacto-form');
    const status = document.querySelector<HTMLElement>('#form-status');
    if (!form || !status) return;
    form.noValidate = true;
    const fields = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea')];
    fields.forEach(field => {
      const error = document.createElement('p');
      error.id = `${field.id}-error`;
      error.className = 'field-error';
      error.hidden = true;
      field.after(error);
      field.setAttribute('aria-describedby', error.id);
      field.addEventListener('input', () => {
        field.removeAttribute('aria-invalid'); error.hidden = true; status.textContent = '';
      });
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      let firstInvalid: HTMLInputElement | HTMLTextAreaElement | undefined;
      fields.forEach(field => {
        const error = document.getElementById(`${field.id}-error`)!;
        const invalid = !field.value.trim() || !field.validity.valid;
        field.setAttribute('aria-invalid', String(invalid));
        error.hidden = !invalid;
        error.textContent = !field.value.trim() ? 'Completa este campo.' : 'Escribe un correo válido, por ejemplo nombre@dominio.cl.';
        if (invalid && !firstInvalid) firstInvalid = field;
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

  const initDetails = () => {
    const dialog = document.querySelector<HTMLDialogElement>('.route-dialog');
    if (!dialog) return;
    let trigger: HTMLButtonElement | null = null;
    document.querySelectorAll<HTMLButtonElement>('[data-route-details]').forEach(button => {
      button.addEventListener('click', () => {
        const card = button.closest<HTMLElement>('.route-card');
        const source = card?.querySelector<HTMLImageElement>('img');
        const image = dialog.querySelector<HTMLImageElement>('[data-dialog-image]');
        if (!card || !source || !image) return;
        trigger = button;
        image.src = source.currentSrc || source.src; image.alt = source.alt;
        const set = (selector: string, text: string) => { const el = dialog.querySelector(selector); if (el) el.textContent = text; };
        set('.route-dialog__text', card.dataset.description || '');
        set('[data-dialog-title]', card.querySelector('h3')?.textContent || 'Detalle de ruta');
        set('[data-dialog-location]', card.querySelector('.route-card__location')?.textContent?.trim() || '');
        set('[data-dialog-difficulty]', `Dificultad: ${card.querySelector('.route-card__badge')?.textContent || ''}`);
        set('[data-dialog-distance]', `${card.dataset.distance} km`);
        set('[data-dialog-duration]', `${card.dataset.duration} horas`);
        dialog.showModal();
      });
    });
    dialog.querySelector('[data-dialog-close]')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      const rect = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
    });
    dialog.addEventListener('close', () => trigger?.focus());
  };

  document.addEventListener('DOMContentLoaded', () => {
    void loadCatalog();
    initContactForm();
  });
})();
