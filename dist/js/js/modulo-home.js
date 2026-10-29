// Paso 3: Función para filtrar eventos por tipo
export function filtrarEventosPorTipo(eventos, tipo) {
    return eventos.filter(evento => evento.tipo.toLowerCase() === tipo.toLowerCase());
}
// Paso 4: Función para calcular y retornar el estado de los cupos
export function calcularCuposRestantes(evento) {
    if (evento.cuposDisponibles <= 0) {
        return "Agotado";
    }
    return `Quedan ${evento.cuposDisponibles} cupos disponibles`;
}
//# sourceMappingURL=modulo-home.js.map