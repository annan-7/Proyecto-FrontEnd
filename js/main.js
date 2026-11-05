"use strict";
(() => {
    const normalize = (value) => value
        .toLocaleLowerCase('es')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
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
        let selectedType = 'all';
        const params = new URLSearchParams(location.search);
        input.value = params.get('search') || '';
        if (difficulty)
            difficulty.value = params.get('difficulty') || '';
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
            if (difficulty)
                difficulty.value = '';
            if (distance)
                distance.value = distance.max;
            if (duration)
                duration.value = '';
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
    const initDetails = () => {
        const dialog = document.querySelector('.route-dialog');
        if (!dialog)
            return;
        let trigger = null;
        document.querySelectorAll('[data-route-details]').forEach(button => {
            button.addEventListener('click', () => {
                const card = button.closest('.route-card');
                const source = card?.querySelector('img');
                const image = dialog.querySelector('[data-dialog-image]');
                if (!card || !source || !image)
                    return;
                trigger = button;
                image.src = source.currentSrc || source.src;
                image.alt = source.alt;
                const set = (selector, text) => { const el = dialog.querySelector(selector); if (el)
                    el.textContent = text; };
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
            if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom))
                dialog.close();
        });
        dialog.addEventListener('close', () => trigger?.focus());
    };
    document.addEventListener('DOMContentLoaded', () => {
        initRoutes();
        initContactForm();
        initDetails();
    });
})();
