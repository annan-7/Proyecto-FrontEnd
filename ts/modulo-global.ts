export interface IConfiguracionSitio {
    nombreSitio: string;
    version: string;
    ultimoDespliegue: string;
    tema: string;
    idioma: string;
}

export function generarMenuDinamico(items: {nombre: string, url: string}[]): string {
    let htmlMenu = "<ul>";
    for (let item of items) {
        htmlMenu += `<li><a href="${item.url}">${item.nombre}</a></li>`;
    }
    htmlMenu += "</ul>";
    return htmlMenu;
}

export function obtenerConfiguracionActual(): IConfiguracionSitio {
    return {
        nombreSitio: "EcoRutas",
        version: "1.0",
        ultimoDespliegue: "28-10-2026",
        tema: "light",
        idioma: "es"
    };
}