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

let activeCategory = 'all';

function updateResults() {
  const searchTerm = searchInput.value.trim().toLocaleLowerCase();
  const maxDistance = Number(distanceFilter.value);
  const maxDuration = durationFilter.value ? Number(durationFilter.value) : Infinity;
  const difficulty = difficultyFilter.value;
  let visibleCount = 0;

  routeCards.forEach((card) => {
    const cardText = card.textContent.toLocaleLowerCase();
    const matchesSearch = !searchTerm || cardText.includes(searchTerm);
    const matchesCategory = activeCategory === 'all' || card.dataset.category.split(' ').includes(activeCategory);
    const matchesDifficulty = !difficulty || card.dataset.difficulty === difficulty;
    const matchesDistance = Number(card.dataset.distance) <= maxDistance;
    const matchesDuration = Number(card.dataset.duration) <= maxDuration;
    const isVisible = matchesSearch && matchesCategory && matchesDifficulty && matchesDistance && matchesDuration;

    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  resultsNumber.textContent = visibleCount;
  emptyResults.hidden = visibleCount !== 0;
  distanceOutput.textContent = `${distanceFilter.value} km`;
  distanceFilter.setAttribute('aria-valuenow', distanceFilter.value);
}

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    activeCategory = chip.dataset.filter;
    chips.forEach((currentChip) => {
      const isActive = currentChip === chip;
      currentChip.classList.toggle('chip--active', isActive);
      currentChip.setAttribute('aria-pressed', String(isActive));
    });
    updateResults();
  });
});

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  updateResults();
});

searchInput.addEventListener('input', updateResults);
difficultyFilter.addEventListener('change', updateResults);
distanceFilter.addEventListener('input', updateResults);
durationFilter.addEventListener('change', updateResults);

clearFiltersButton.addEventListener('click', () => {
  activeCategory = 'all';
  searchInput.value = '';
  difficultyFilter.value = '';
  distanceFilter.value = distanceFilter.max;
  durationFilter.value = '';
  chips.forEach((chip, index) => {
    const isAllChip = index === 0;
    chip.classList.toggle('chip--active', isAllChip);
    chip.setAttribute('aria-pressed', String(isAllChip));
  });
  updateResults();
});

updateResults();
