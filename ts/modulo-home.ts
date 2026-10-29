// Paso 2: Definición de la interfaz IEvento
export interface IEvento {
    id: number;
    nombre: string;
    fecha: string;
    ubicacion: string;
    descripcion: string;
    imagen: string;
    cuposDisponibles: number;
    tipo: string;
}

// Paso 3: Función para filtrar eventos por tipo
export function filtrarEventosPorTipo(eventos: IEvento[], tipo: string): IEvento[] {
    return eventos.filter(evento => evento.tipo.toLowerCase() === tipo.toLowerCase());
}

// Paso 4: Función para calcular y retornar el estado de los cupos
export function calcularCuposRestantes(evento: IEvento): string {
    if (evento.cuposDisponibles <= 0) {
        return "Agotado";
    }
    return `Quedan ${evento.cuposDisponibles} cupos disponibles`;
}