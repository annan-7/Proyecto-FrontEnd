(() => {
  const carousel = document.querySelector<HTMLElement>('.carousel');
  const track = carousel?.querySelector<HTMLElement>('.carousel__track');
  const play = carousel?.querySelector<HTMLButtonElement>('.carousel__pause-btn');
  if (!carousel || !track || !play) return;
  const slides = [...track.querySelectorAll<HTMLElement>('.carousel__slide')];
  const dots = [...carousel.querySelectorAll<HTMLButtonElement>('.carousel__dot')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let timer: ReturnType<typeof setInterval> | undefined;
  let playing = false;
  const update = () => dots.forEach((dot, index) => dot.setAttribute('aria-pressed', String(index === current)));
  const go = (index: number) => {
    current = (index + slides.length) % slides.length;
    track.scrollTo({ left: slides[current].offsetLeft - slides[0].offsetLeft, behavior: reduced.matches ? 'instant' : 'smooth' });
    update();
  };
  const pause = () => {
    playing = false; clearInterval(timer);
    play.textContent = 'Reproducir'; play.setAttribute('aria-label', 'Reproducir carrusel'); play.setAttribute('aria-pressed', 'false');
  };
  play.addEventListener('click', () => {
    if (playing || reduced.matches) { pause(); return; }
    playing = true;
    play.textContent = 'Pausar'; play.setAttribute('aria-label', 'Pausar carrusel'); play.setAttribute('aria-pressed', 'true');
    timer = setInterval(() => go(current + 1), 5000);
  });
  carousel.querySelector('.carousel__btn--prev')?.addEventListener('click', () => { pause(); go(current - 1); });
  carousel.querySelector('.carousel__btn--next')?.addEventListener('click', () => { pause(); go(current + 1); });
  dots.forEach((dot, index) => dot.addEventListener('click', () => { pause(); go(index); }));
  carousel.addEventListener('focusin', event => { if (event.target !== play) pause(); });
  carousel.addEventListener('mouseenter', pause);
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  reduced.addEventListener('change', () => { pause(); resize(); });
  new IntersectionObserver(entries => { if (!entries[0].isIntersecting) pause(); }).observe(carousel);
  // At wide sizes all featured routes are visible; carousel controls would have no effect.
  const resize = () => {
    const overflow = track.scrollWidth > track.clientWidth + 4;
    carousel.querySelectorAll<HTMLElement>('.carousel__btn, .carousel__dots, .carousel__pause-btn').forEach(el => el.hidden = !overflow);
    play.hidden = !overflow || reduced.matches;
    if (!overflow) pause();
  };
  new ResizeObserver(resize).observe(track);
  track.addEventListener('scroll', () => {
    const width = slides[1].offsetLeft - slides[0].offsetLeft;
    current = Math.min(slides.length - 1, Math.round(track.scrollLeft / width)); update();
  }, { passive: true });
  resize(); update();
})();
