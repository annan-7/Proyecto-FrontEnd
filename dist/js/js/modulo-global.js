function generarMenuDinamico(items) {
    let htmlMenu = "<ul>";
    for (let item of items) {
        htmlMenu += `<li><a href="${item.url}">${item.nombre}</a></li>`;
    }
    htmlMenu += "</ul>";
    return htmlMenu;
}
function obtenerConfiguracionActual() {
    return {
        nombreSitio: "EcoRutas",
        version: "1.0",
        ultimoDespliegue: "28-10-2026",
        tema: "light",
        idioma: "es"
    };
}
export {};
//# sourceMappingURL=modulo-global.js.map