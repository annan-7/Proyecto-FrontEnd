(() => {
  const normalize = (value: string) => value
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

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

    const update = () => {
      const query = normalize(input.value.trim());
      const maximumDistance = Number(distance?.value || 50);
      const selectedDifficulty = difficulty?.value || '';
      const maximumDuration = duration?.value || '';
      let visible = 0;

      cards.forEach((card) => {
        const searchableText = normalize(card.textContent);
        const cardTypes = card.dataset.type || '';
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
      empty.hidden = visible !== 0;
      if (output && distance) output.textContent = `${distance.value} km`;
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
    const form = document.querySelector('.contacto-form') as HTMLFormElement | null;
    const status = document.querySelector('#form-status') as HTMLFormElement | null;
    if (!form || !status) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = form.querySelector('#nombre') as HTMLInputElement;
      const email = form.querySelector('#email') as HTMLInputElement;
      const message = form.querySelector('#mensaje') as HTMLInputElement;

      if (!name.value.trim() || !email.validity.valid || !message.value.trim()) {
        status.textContent = 'Completa tu nombre, un correo válido y tu mensaje.';
        status.dataset.state = 'error';
        (form.querySelector(':invalid') as HTMLElement)?.focus();
        return;
      }

      status.textContent = 'Formulario validado. Esta demostración no envía ni almacena mensajes.';
      status.dataset.state = 'success';
      form.reset();
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    initRoutes();
    initContactForm();
  });
})();
