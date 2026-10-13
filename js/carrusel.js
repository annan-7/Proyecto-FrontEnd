// Módulo de Carrusel Accesible para EcoRuta
document.addEventListener('DOMContentLoaded', () => {
    console.log(' Carrusel: Iniciando...');
    
    const carousel = document.querySelector('.carousel');
    if (!carousel) {
        console.log('️Carrusel: No se encontró el elemento .carousel');
        return;
    }

    const track = carousel.querySelector('.carousel__track');
    const slides = Array.from(carousel.querySelectorAll('.carousel__slide'));
    const prevBtn = carousel.querySelector('.carousel__btn--prev');
    const nextBtn = carousel.querySelector('.carousel__btn--next');
    const dots = Array.from(carousel.querySelectorAll('.carousel__dot'));
    const pauseBtn = carousel.querySelector('.carousel__pause-btn');

    if (!track || slides.length === 0 || !prevBtn || !nextBtn || !pauseBtn) {
        console.error(' Carrusel: Faltan elementos críticos');
        return;
    }

    // Estado
    let currentIndex = 0;
    const totalSlides = slides.length;
    let isPlaying = true;
    let autoPlayInterval = null;
    const AUTO_PLAY_DELAY = 5000;

    console.log(`Carrusel: ${totalSlides} slides encontrados`);

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        slides.forEach((slide, index) => {
            const isActive = index === currentIndex;
            slide.setAttribute('aria-hidden', !isActive);
            
            const focusableElements = slide.querySelectorAll('a, button, [tabindex]');
            focusableElements.forEach(el => {
                el.setAttribute('tabindex', isActive ? '0' : '-1');
            });
        });

        if (dots.length > 0) {
            dots.forEach((dot, index) => {
                const isActive = index === currentIndex;
                dot.setAttribute('aria-selected', isActive);
                dot.classList.toggle('active', isActive);
            });
        }
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    function goToSlide(index) {
        if (index >= 0 && index < totalSlides) {
            currentIndex = index;
            updateCarousel();
            resetAutoPlay();
        }
    }

    // CORREGIDO: Limpieza robusta de intervalos
    function clearAllIntervals() {
        if (autoPlayInterval !== null) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
            console.log('Intervalo limpiado');
        }
    }

    function startAutoPlay() {
        // PRIMERO limpiar cualquier intervalo existente
        clearAllIntervals();
        
        if (isPlaying) {
            autoPlayInterval = setInterval(() => {
                console.log('Auto-play disparado');
                nextSlide();
            }, AUTO_PLAY_DELAY);
            console.log('Auto-play iniciado');
        }
    }

    function stopAutoPlay() {
        clearAllIntervals();
        console.log('️Auto-play detenido');
    }

    function resetAutoPlay() {
        console.log('Reiniciando auto-play');
        clearAllIntervals();
        if (isPlaying) {
            startAutoPlay();
        }
    }

    function togglePause() {
        isPlaying = !isPlaying;
        
        if (isPlaying) {
            pauseBtn.textContent = 'Pausar';
            pauseBtn.setAttribute('aria-pressed', 'false');
            startAutoPlay();
        } else {
            pauseBtn.textContent = 'Reanudar';
            pauseBtn.setAttribute('aria-pressed', 'true');
            stopAutoPlay();
        }
        console.log(`️Pausa ${isPlaying ? 'desactivada' : 'activada'}`);
    }

    // Event Listeners
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });

    pauseBtn.addEventListener('click', togglePause);

    // Pausa en hover/mouseleave
    carousel.addEventListener('mouseenter', () => {
        if (isPlaying) {
            clearAllIntervals();
        }
    });

    carousel.addEventListener('mouseleave', () => {
        if (isPlaying && autoPlayInterval === null) {
            startAutoPlay();
        }
    });

    // Pausa en focus/focusout
    carousel.addEventListener('focusin', () => {
        if (isPlaying) {
            clearAllIntervals();
        }
    });

    carousel.addEventListener('focusout', () => {
        if (isPlaying && autoPlayInterval === null) {
            startAutoPlay();
        }
    });

    // Controles de teclado
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
            resetAutoPlay();
            if (prevBtn) prevBtn.focus();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
            resetAutoPlay();
            if (nextBtn) nextBtn.focus();
        }
    });

    // Inicialización ÚNICA
    console.log(' Inicializando...');
    updateCarousel();
    startAutoPlay();
    console.log('Carrusel listo');
});