/**
 * Modulo de Carrusel Accesible para EcoRuta
 * Version TypeScript con interfaz IEvento, funciones tipadas
 * y accesibilidad dinamica.
 */
// Datos actuales del carrusel mapeados a la interfaz
const datosCarrusel = [
    {
        id: 1,
        nombre: "Sendero del Bosque Nativo",
        descripcion: "Una caminata amable entre arboles y sonidos del bosque.",
        imagen: "./assets/imagenes/BosqueNativo.webp",
        link: "./paginas/rutas.html",
        tipo: "Sendero"
    },
    {
        id: 2,
        nombre: "Lago Escondido",
        descripcion: "Un recorrido breve para conectar con el paisaje del sur.",
        imagen: "./assets/imagenes/ruta-lago.webp",
        link: "./paginas/rutas.html",
        tipo: "Sendero"
    },
    {
        id: 3,
        nombre: "Cumbre Andina",
        descripcion: "Desafios de montana para quienes buscan nuevos horizontes.",
        imagen: "./assets/imagenes/Cumbre.jpg",
        link: "./paginas/rutas.html",
        tipo: "Sendero"
    }
];
// ==========================================
// 2. LOGICA PRINCIPAL Y TIPIFICACION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Carrusel: Iniciando...');
    // Seleccion de elementos del DOM
    const carousel = document.querySelector('.carousel');
    if (!carousel) {
        console.log('Carrusel: No se encontro el elemento .carousel');
        return;
    }
    const track = carousel.querySelector('.carousel__track');
    const slides = carousel.querySelectorAll('.carousel__slide');
    const prevBtn = carousel.querySelector('.carousel__btn--prev');
    const nextBtn = carousel.querySelector('.carousel__btn--next');
    const dots = carousel.querySelectorAll('.carousel__dot');
    const pauseBtn = carousel.querySelector('.carousel__pause-btn');
    if (!track || slides.length === 0 || !prevBtn || !nextBtn || !pauseBtn) {
        console.error('Carrusel: Faltan elementos criticos en el DOM');
        return;
    }
    // Estado
    let currentIndex = 0;
    const totalSlides = slides.length;
    let isPlaying = true;
    let autoPlayInterval = null;
    const AUTO_PLAY_DELAY = 5000;
    console.log(`Carrusel: ${totalSlides} slides cargados desde IEvento`);
    // ==========================================
    // 3. ACCESIBILIDAD DINAMICA
    // ==========================================
    function gestionarAccesibilidad(slide, isActive) {
        slide.setAttribute('aria-hidden', String(!isActive));
        slide.setAttribute('aria-roledescription', 'diapositiva');
        const focusableElements = slide.querySelectorAll('a, button, [tabindex]');
        focusableElements.forEach((el) => {
            el.setAttribute('tabindex', isActive ? '0' : '-1');
        });
    }
    function actualizarIndicadores(indiceActivo) {
        if (dots.length === 0)
            return;
        dots.forEach((dot, index) => {
            const isActive = index === indiceActivo;
            dot.setAttribute('aria-selected', String(isActive));
            dot.classList.toggle('active', isActive);
        });
    }
    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        slides.forEach((slide, index) => {
            const isActive = index === currentIndex;
            gestionarAccesibilidad(slide, isActive);
        });
        actualizarIndicadores(currentIndex);
    }
    // ==========================================
    // 4. FUNCIONES DE NAVEGACION TIPADAS
    // ==========================================
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
    // ==========================================
    // 5. CONTROL DEL AUTO-PLAY
    // ==========================================
    function clearAllIntervals() {
        if (autoPlayInterval !== null) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }
    function startAutoPlay() {
        clearAllIntervals();
        if (isPlaying) {
            autoPlayInterval = window.setInterval(nextSlide, AUTO_PLAY_DELAY);
        }
    }
    function stopAutoPlay() {
        clearAllIntervals();
    }
    function resetAutoPlay() {
        clearAllIntervals();
        if (isPlaying)
            startAutoPlay();
    }
    function togglePause() {
        isPlaying = !isPlaying;
        pauseBtn.textContent = isPlaying ? 'Pausar' : 'Reanudar';
        pauseBtn.setAttribute('aria-pressed', String(!isPlaying));
        isPlaying ? startAutoPlay() : stopAutoPlay();
    }
    // ==========================================
    // 6. EVENT LISTENERS
    // ==========================================
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
    });
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    pauseBtn.addEventListener('click', togglePause);
    carousel.addEventListener('mouseenter', () => {
        if (isPlaying)
            stopAutoPlay();
    });
    carousel.addEventListener('mouseleave', () => {
        if (isPlaying)
            startAutoPlay();
    });
    carousel.addEventListener('focusin', () => {
        if (isPlaying)
            stopAutoPlay();
    });
    carousel.addEventListener('focusout', () => {
        if (isPlaying)
            startAutoPlay();
    });
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
            resetAutoPlay();
            prevBtn.focus();
        }
        else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
            resetAutoPlay();
            nextBtn.focus();
        }
    });
    // ==========================================
    // 7. INICIALIZACION
    // ==========================================
    console.log('Carrusel: Inicializando primera vista');
    updateCarousel();
    setTimeout(() => {
        startAutoPlay();
        console.log('Carrusel: Auto-play iniciado');
    }, 100);
    console.log('Carrusel: Completado');
});
