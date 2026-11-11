"use strict";
// Permite buscar sin distinguir mayúsculas ni tildes.
function normalizarTextoRuta(texto) {
    return texto
        .trim()
        .toLocaleLowerCase("es")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}
function buscarRutasPorNombre(rutas, termino) {
    const busqueda = normalizarTextoRuta(termino);
    return rutas.filter((ruta) => normalizarTextoRuta(ruta.nombre).includes(busqueda));
}
function ordenarRutasPorDificultad(rutas) {
    const niveles = {
        easy: 1,
        facil: 1,
        medium: 2,
        media: 2,
        moderada: 2,
        hard: 3,
        dificil: 3,
        alta: 3
    };
    const obtenerNivel = (dificultad) => niveles[normalizarTextoRuta(dificultad)] ?? 4;
    // Ordena una copia para conservar el array original.
    return [...rutas].sort((a, b) => obtenerNivel(a.dificultad) - obtenerNivel(b.dificultad));
}
