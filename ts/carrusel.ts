/**
 * Modulo de Carrusel Accesible para EcoRuta
 * Version TypeScript con interfaz IEvento, funciones tipadas
 * y accesibilidad dinamica.
 */

// ==========================================
// 1. INTERFAZ IEVENTO PARA LOS DATOS DEL CARRUSEL
// ==========================================
export interface IEvento {
    id: number;
    nombre: string;
    descripcion: string;
    imagen: string;
    link: string;
    tipo?: string;
}

// Datos actuales del carrusel mapeados a la interfaz
const datosCarrusel: IEvento[] = [
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
    const carousel: HTMLElement | null = document.querySelector('.carousel');
    if (!carousel) {
        console.log('Carrusel: No se encontro el elemento .carousel');
        return;
    }

    const track: HTMLElement | null = carousel.querySelector('.carousel__track');
    const slides: NodeListOf<HTMLElement> = carousel.querySelectorAll('.carousel__slide');
    const prevBtn: HTMLButtonElement | null = carousel.querySelector('.carousel__btn--prev');
    const nextBtn: HTMLButtonElement | null = carousel.querySelector('.carousel__btn--next');
    const dots: NodeListOf<HTMLButtonElement> = carousel.querySelectorAll('.carousel__dot');
    const pauseBtn: HTMLButtonElement | null = carousel.querySelector('.carousel__pause-btn');

    if (!track || slides.length === 0 || !prevBtn || !nextBtn || !pauseBtn) {
        console.error('Carrusel: Faltan elementos criticos en el DOM');
        return;
    }

    // Estado
    let currentIndex: number = 0;
    const totalSlides: number = slides.length;
    let isPlaying: boolean = true;
    let autoPlayInterval: number | null = null;
    const AUTO_PLAY_DELAY: number = 5000;

    console.log(`Carrusel: ${totalSlides} slides cargados desde IEvento`);

    // ==========================================
    // 3. ACCESIBILIDAD DINAMICA
    // ==========================================
    function gestionarAccesibilidad(slide: HTMLElement, isActive: boolean): void {
        slide.setAttribute('aria-hidden', String(!isActive));
        slide.setAttribute('aria-roledescription', 'diapositiva');

        const focusableElements: NodeListOf<HTMLElement> = slide.querySelectorAll('a, button, [tabindex]');
        focusableElements.forEach((el: HTMLElement) => {
            el.setAttribute('tabindex', isActive ? '0' : '-1');
        });
    }

    function actualizarIndicadores(indiceActivo: number): void {
        if (dots.length === 0) return;

        dots.forEach((dot: HTMLButtonElement, index: number) => {
            const isActive: boolean = index === indiceActivo;
            dot.setAttribute('aria-selected', String(isActive));
            dot.classList.toggle('active', isActive);
        });
    }

    function updateCarousel(): void {
        track!.style.transform = `translateX(-${currentIndex * 100}%)`;

        slides.forEach((slide: HTMLElement, index: number) => {
            const isActive: boolean = index === currentIndex;
            gestionarAccesibilidad(slide, isActive);
        });

        actualizarIndicadores(currentIndex);
    }

    // ==========================================
    // 4. FUNCIONES DE NAVEGACION TIPADAS
    // ==========================================
    function nextSlide(): void {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    }

    function prevSlide(): void {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    function goToSlide(index: number): void {
        if (index >= 0 && index < totalSlides) {
            currentIndex = index;
            updateCarousel();
            resetAutoPlay();
        }
    }

    // ==========================================
    // 5. CONTROL DEL AUTO-PLAY
    // ==========================================
    function clearAllIntervals(): void {
        if (autoPlayInterval !== null) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    function startAutoPlay(): void {
        clearAllIntervals();
        if (isPlaying) {
            autoPlayInterval = window.setInterval(nextSlide, AUTO_PLAY_DELAY);
        }
    }

    function stopAutoPlay(): void {
        clearAllIntervals();
    }

    function resetAutoPlay(): void {
        clearAllIntervals();
        if (isPlaying) startAutoPlay();
    }

    function togglePause(): void {
        isPlaying = !isPlaying;
        pauseBtn!.textContent = isPlaying ? 'Pausar' : 'Reanudar';
        pauseBtn!.setAttribute('aria-pressed', String(!isPlaying));

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

    dots.forEach((dot: HTMLButtonElement, index: number) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    pauseBtn.addEventListener('click', togglePause);

    carousel.addEventListener('mouseenter', () => {
        if (isPlaying) stopAutoPlay();
    });

    carousel.addEventListener('mouseleave', () => {
        if (isPlaying) startAutoPlay();
    });

    carousel.addEventListener('focusin', () => {
        if (isPlaying) stopAutoPlay();
    });

    carousel.addEventListener('focusout', () => {
        if (isPlaying) startAutoPlay();
    });

    carousel.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
            resetAutoPlay();
            prevBtn.focus();
        } else if (e.key === 'ArrowRight') {
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