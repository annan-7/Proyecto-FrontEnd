// Módulo de Carrusel Accesible para EcoRuta
document.addEventListener('DOMContentLoaded', () => {
    console.log(' Carrusel: Iniciando...');
    
    // 1. Selección de elementos del DOM con validación
    const carousel = document.querySelector('.carousel');
    if (!carousel) {
        console.log('Carrusel: No se encontró el elemento .carousel en esta página');
        return;
    }

    const track = carousel.querySelector('.carousel__track');
    const slides = Array.from(carousel.querySelectorAll('.carousel__slide'));
    const prevBtn = carousel.querySelector('.carousel__btn--prev');
    const nextBtn = carousel.querySelector('.carousel__btn--next');
    const dots = Array.from(carousel.querySelectorAll('.carousel__dot'));
    const pauseBtn = carousel.querySelector('.carousel__pause-btn');

    // Validación de elementos críticos
    if (!track || slides.length === 0) {
        console.error('Carrusel: Faltan elementos críticos (track o slides)');
        return;
    }

    if (!prevBtn || !nextBtn) {
        console.error('Carrusel: Faltan botones de navegación');
        return;
    }

    if (!pauseBtn) {
        console.error('Carrusel: No se encontró el botón de pausa');
        return;
    }

    // 2. Estado inicial del carrusel
    let currentIndex = 0;
    const totalSlides = slides.length;
    let isPlaying = true;
    let autoPlayInterval = null;
    const AUTO_PLAY_DELAY = 5000;

    console.log(`Carrusel: ${totalSlides} slides encontrados`);

    // 3. Función principal para actualizar la vista
    function updateCarousel() {
        console.log(`    Carrusel: Actualizando a slide ${currentIndex}`);
    
        // Mueve el track
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Actualiza slides y maneja el foco
        slides.forEach((slide, index) => {
            const isActive = index === currentIndex;
            slide.setAttribute('aria-hidden', !isActive);
        
            // CRÍTICO: Desactiva el foco en slides ocultos
            const focusableElements = slide.querySelectorAll('a, button, [tabindex]');
            focusableElements.forEach(el => {
                el.setAttribute('tabindex', isActive ? '0' : '-1');
            });
        });

        // Actualiza dots
        if (dots.length > 0) {
            dots.forEach((dot, index) => {
                const isActive = index === currentIndex;
                dot.setAttribute('aria-selected', isActive);
                dot.classList.toggle('active', isActive);
            });
        }
    }

    // 4. Funciones de navegación
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

    // 5. Control del Auto-play (CORREGIDO)
    function startAutoPlay() {
        // Limpiar intervalo existente ANTES de crear uno nuevo
        if (autoPlayInterval !== null) {
            clearInterval(autoPlayInterval);
        }
        
        if (isPlaying) {
            console.log('Carrusel: Auto-play iniciado');
            autoPlayInterval = setInterval(() => {
                console.log('Carrusel: Auto-play disparado');
                nextSlide();
            }, AUTO_PLAY_DELAY);
        }
    }

    function stopAutoPlay() {
        if (autoPlayInterval !== null) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
            console.log('Carrusel: Auto-play detenido');
        }
    }

    function resetAutoPlay() {
        console.log('Carrusel: Reiniciando auto-play');
        stopAutoPlay();
        if (isPlaying) {
            startAutoPlay();
        }
    }

    function togglePause() {
        isPlaying = !isPlaying;
        console.log(`Carrusel: Pausa ${isPlaying ? 'desactivada' : 'activada'}`);
        
        if (isPlaying) {
            pauseBtn.textContent = 'Pausar';
            pauseBtn.setAttribute('aria-pressed', 'false');
            startAutoPlay();
        } else {
            pauseBtn.textContent = 'Reanudar';
            pauseBtn.setAttribute('aria-pressed', 'true');
            stopAutoPlay();
        }
    }

    // 6. Event Listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            console.log('Carrusel: Botón anterior clickeado');
            prevSlide();
            resetAutoPlay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            console.log('Carrusel: Botón siguiente clickeado');
            nextSlide();
            resetAutoPlay();
        });
    }

    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                console.log(`Carrusel: Dot ${index} clickeado`);
                goToSlide(index);
            });
        });
    }

    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            console.log('️Carrusel: Botón pausa clickeado');
            togglePause();
        });
    }

    // Pausa en hover
    carousel.addEventListener('mouseenter', () => {
        if (isPlaying) {
            console.log('Carrusel: Mouse enter - pausando');
            stopAutoPlay();
        }
    });

    carousel.addEventListener('mouseleave', () => {
        if (isPlaying) {
            console.log('️Carrusel: Mouse leave - reanudando');
            startAutoPlay();
        }
    });

    // Pausa en focus (accesibilidad)
    carousel.addEventListener('focusin', () => {
        if (isPlaying) {
            console.log('Carrusel: Focus in - pausando');
            stopAutoPlay();
        }
    });

    carousel.addEventListener('focusout', () => {
        if (isPlaying) {
            console.log('Carrusel: Focus out - reanudando');
            startAutoPlay();
        }
    });

    // 7. Controles de teclado
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            console.log('Carrusel: Tecla flecha izquierda');
            prevSlide();
            resetAutoPlay();
            if (prevBtn) prevBtn.focus();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            console.log('Carrusel: Tecla flecha derecha');
            nextSlide();
            resetAutoPlay();
            if (nextBtn) nextBtn.focus();
        }
    });

    // 8. Inicialización
    console.log('Carrusel: Inicializando primera vista');
    updateCarousel();
    startAutoPlay();
    
    console.log('Carrusel: Completado');
});