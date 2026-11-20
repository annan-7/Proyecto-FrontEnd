
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


export function filtrarEventosPorTipo(eventos: IEvento[], tipo: string): IEvento[] {
    return eventos.filter(evento => evento.tipo.toLowerCase() === tipo.toLowerCase());
}


export function calcularCuposRestantes(evento: IEvento): string {
    if (evento.cuposDisponibles <= 0) {
        return "Agotado";
    }
    return `Quedan ${evento.cuposDisponibles} cupos disponibles`;
}