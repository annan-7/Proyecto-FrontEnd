export interface IConfiguracionSitio {
    nombreSitio: string;
    version: string;
    ultimoDespliegue: string;
    tema: string;
    idioma: string;
}
export declare function generarMenuDinamico(items: {
    nombre: string;
    url: string;
}[]): string;
export declare function obtenerConfiguracionActual(): IConfiguracionSitio;
//# sourceMappingURL=modulo-global.d.ts.map