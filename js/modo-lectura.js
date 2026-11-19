"use strict";
/**
 * Módulo de Modo Lectura para EcoRuta
 * Escala la fuente del sitio y persiste la preferencia con localStorage
 * Cumple con requisitos: const/let, arrow functions, localStorage, gestión de foco
 */
const CLAVE_STORAGE = 'ecoruta-modo-lectura';
const TAMANO_BASE = 100;
const TAMANO_LECTURA = 120;
const botonLectura = document.getElementById('btn-modo-lectura');
const htmlElement = document.documentElement;
/**
 * Verifica si el modo lectura está activo en localStorage
 */
const estaActivo = () => {
    return localStorage.getItem(CLAVE_STORAGE) === 'activo';
};
/**
 * Aplica el modo lectura: escala la fuente y actualiza la UI
 */
const aplicarModoLectura = () => {
    htmlElement.style.fontSize = `${TAMANO_LECTURA}%`;
    if (botonLectura) {
        botonLectura.textContent = 'Desactivar Modo Lectura';
        botonLectura.setAttribute('aria-pressed', 'true');
        botonLectura.setAttribute('aria-label', 'Desactivar modo de lectura');
    }
    localStorage.setItem(CLAVE_STORAGE, 'activo');
    console.log('Modo Lectura: Activado - Fuente al ' + TAMANO_LECTURA + '%');
};
/**
 * Desactiva el modo lectura: restaura tamaño original y actualiza la UI
 */
const desactivarModoLectura = () => {
    htmlElement.style.fontSize = `${TAMANO_BASE}%`;
    if (botonLectura) {
        botonLectura.textContent = 'Activar Modo Lectura';
        botonLectura.setAttribute('aria-pressed', 'false');
        botonLectura.setAttribute('aria-label', 'Activar modo de lectura');
    }
    localStorage.setItem(CLAVE_STORAGE, 'inactivo');
    console.log('Modo Lectura: Desactivado - Fuente al ' + TAMANO_BASE + '%');
};
/**
 * Alterna entre activado y desactivado
 */
const toggleModoLectura = () => {
    if (estaActivo()) {
        desactivarModoLectura();
    }
    else {
        aplicarModoLectura();
    }
};
/**
 * Inicializa el módulo al cargar la página
 */
const inicializar = () => {
    if (estaActivo()) {
        aplicarModoLectura();
    }
    else {
        desactivarModoLectura();
    }
    console.log('Modo Lectura: Módulo inicializado');
};
// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    inicializar();
    if (botonLectura) {
        // Click handler
        botonLectura.addEventListener('click', () => {
            toggleModoLectura();
            // Mantener el foco en el botón después de hacer clic
            botonLectura.focus();
        });
        // Soporte de teclado: Enter y Espacio
        botonLectura.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleModoLectura();
                botonLectura?.focus();
            }
        });
    }
});
