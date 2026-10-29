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
export declare function filtrarEventosPorTipo(eventos: IEvento[], tipo: string): IEvento[];
export declare function calcularCuposRestantes(evento: IEvento): string;
//# sourceMappingURL=modulo-home.d.ts.map