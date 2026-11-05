(() => {
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('#search-input');
    const chips = document.querySelectorAll('.chip');
    const difficultyFilter = document.querySelector('#filter-difficulty');
    const distanceFilter = document.querySelector('#filter-distance');
    const durationFilter = document.querySelector('#filter-duration');
    const distanceOutput = document.querySelector('.filter-group__output');
    const clearFiltersButton = document.querySelector('.filters__clear');
    const routeCards = [...document.querySelectorAll('.route-card')];
    const resultsNumber = document.querySelector('#results-number');
    const emptyResults = document.querySelector('.results__empty');
    const detailButtons = document.querySelectorAll('[data-route-details]');
    const routeDialog = document.querySelector('.route-dialog');
    const dialogImage = document.querySelector('[data-dialog-image]');
    const dialogTitle = document.querySelector('[data-dialog-title]');
    const dialogLocation = document.querySelector('[data-dialog-location]');
    const dialogDifficulty = document.querySelector('[data-dialog-difficulty]');
    const dialogDistance = document.querySelector('[data-dialog-distance]');
    const dialogDuration = document.querySelector('[data-dialog-duration]');
    const closeDialogButton = document.querySelector('[data-dialog-close]');
    let activeCategory = 'all';
    function updateResults() {
        const searchTerm = searchInput?.value.trim().toLocaleLowerCase() || '';
        const maxDistance = distanceFilter ? Number(distanceFilter.value) : Infinity;
        const durationValue = durationFilter?.value || '';
        const maxDuration = durationValue && durationValue !== '24' ? Number(durationValue) : Infinity;
        const difficulty = difficultyFilter?.value || '';
        let visibleCount = 0;
        routeCards.forEach((card) => {
            const cardText = card.textContent?.toLocaleLowerCase() || '';
            const matchesSearch = !searchTerm || cardText.includes(searchTerm);
            const cardCategory = card.dataset.category || '';
            const matchesCategory = activeCategory === 'all' || cardCategory.split(' ').includes(activeCategory);
            const cardDifficulty = card.dataset.difficulty || '';
            const matchesDifficulty = !difficulty || cardDifficulty === difficulty;
            const cardDistance = Number(card.dataset.distance || 0);
            const matchesDistance = cardDistance <= maxDistance;
            const cardDuration = Number(card.dataset.duration || 0);
            const matchesDuration = durationValue === '24'
                ? cardDuration > 8
                : cardDuration <= maxDuration;
            const isVisible = matchesSearch && matchesCategory && matchesDifficulty && matchesDistance && matchesDuration;
            card.hidden = !isVisible;
            if (isVisible)
                visibleCount += 1;
        });
        if (resultsNumber)
            resultsNumber.textContent = String(visibleCount);
        if (emptyResults)
            emptyResults.hidden = visibleCount !== 0;
        if (distanceFilter && distanceOutput) {
            distanceOutput.textContent = `${distanceFilter.value} km`;
            distanceFilter.setAttribute('aria-valuenow', distanceFilter.value);
            distanceFilter.setAttribute('aria-valuetext', `${distanceFilter.value} kilómetros`);
        }
    }
    chips.forEach((chip) => {
        chip.addEventListener('click', () => {
            activeCategory = chip.dataset.filter || 'all';
            chips.forEach((currentChip) => {
                const isActive = currentChip === chip;
                currentChip.classList.toggle('chip--active', isActive);
                currentChip.setAttribute('aria-pressed', String(isActive));
            });
            updateResults();
        });
    });
    searchForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        updateResults();
    });
    searchInput?.addEventListener('input', updateResults);
    difficultyFilter?.addEventListener('change', updateResults);
    distanceFilter?.addEventListener('input', updateResults);
    durationFilter?.addEventListener('change', updateResults);
    detailButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const card = button.closest('.route-card');
            if (!card)
                return;
            const image = card.querySelector('.route-card__image');
            const title = card.querySelector('.route-card__title')?.textContent || '';
            const location = card.querySelector('.route-card__location')?.textContent?.trim() || '';
            const difficulty = card.querySelector('.route-card__badge')?.textContent?.trim() || '';
            if (dialogImage && image) {
                dialogImage.src = image.src;
                dialogImage.alt = image.alt;
            }
            if (dialogTitle)
                dialogTitle.textContent = title;
            if (dialogLocation)
                dialogLocation.textContent = location;
            if (dialogDifficulty)
                dialogDifficulty.textContent = `Dificultad: ${difficulty}`;
            if (dialogDistance)
                dialogDistance.textContent = `Distancia: ${card.dataset.distance || ''} km`;
            if (dialogDuration)
                dialogDuration.textContent = `Duración: ${card.dataset.duration || ''} h`;
            routeDialog?.showModal();
        });
    });
    closeDialogButton?.addEventListener('click', () => {
        routeDialog?.close();
    });
    routeDialog?.addEventListener('click', (event) => {
        if (event.target === routeDialog) {
            routeDialog.close();
        }
    });
    const handleClearFilters = () => {
        activeCategory = 'all';
        if (searchInput)
            searchInput.value = '';
        if (difficultyFilter)
            difficultyFilter.value = '';
        if (distanceFilter)
            distanceFilter.value = distanceFilter.max;
        if (durationFilter)
            durationFilter.value = '';
        chips.forEach((chip, index) => {
            const isAllChip = index === 0;
            chip.classList.toggle('chip--active', isAllChip);
            chip.setAttribute('aria-pressed', String(isAllChip));
        });
        updateResults();
    };
    clearFiltersButton?.addEventListener('click', handleClearFilters);
    const emptyClearBtn = emptyResults?.querySelector('.results__empty-clear');
    emptyClearBtn?.addEventListener('click', () => {
        clearFiltersButton?.click();
    });
    updateResults();
})();
export {};
//# sourceMappingURL=rutas.js.map