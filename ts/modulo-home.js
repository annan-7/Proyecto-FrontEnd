"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filtrarEventosPorTipo = filtrarEventosPorTipo;
exports.calcularCuposRestantes = calcularCuposRestantes;
// Paso 3: Función para filtrar eventos por tipo
function filtrarEventosPorTipo(eventos, tipo) {
    return eventos.filter(evento => evento.tipo.toLowerCase() === tipo.toLowerCase());
}
// Paso 4: Función para calcular y retornar el estado de los cupos
function calcularCuposRestantes(evento) {
    if (evento.cuposDisponibles <= 0) {
        return "Agotado";
    }
    return `Quedan ${evento.cuposDisponibles} cupos disponibles`;
}
//# sourceMappingURL=modulo-home.js.map