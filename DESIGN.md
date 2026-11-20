# EcoRutas: sistema de diseño

## Auditoría y alcance

Sitio estático HTML/CSS con TypeScript estricto, compilado a `js/`. Páginas: inicio, rutas, contacto, sobre nosotros y 404. Sin backend de contacto. Se conservan las seis rutas y sus datos publicados. Leaflet 1.9.4 y Open-Meteo son las integraciones existentes.

Problemas iniciales: referencias a `dist/js` obsoletas; scripts de mapa y clima eliminados; módulos cargados como scripts clásicos; filtros usan `data-type` mientras HTML publica `data-category`; detalle de rutas sin controlador; fotografías del equipo inexistentes; estilos globales contradictorios; menú sin nombre accesible ni estado; ausencia de temas.

El historial contiene un único marcador: Temuco (-38.7359, -72.5904). No hay coordenadas verificadas de los senderos. El mapa conserva esa referencia; el listado ofrece acceso a todas las rutas sin inventar posiciones. Contacto sigue siendo una validación local y lo comunica antes del envío.

## Dirección visual

Referencia observada: Airbnb Chile, escritorio y móvil. Se adoptan búsqueda visible, fotografías con información concisa, alineación consistente y navegación reducida. No se reutiliza su identidad.

EcoRutas se apoya en fotografía de paisaje y verde bosque. Hero dividido entre título y paisaje, búsqueda inmediatamente accesible, destinos destacados, mapa con alternativa textual y clima para preparar la salida. Alineación izquierda. No se añaden métricas, reseñas, destinos ni testimonios ficticios.

## Tokens

- Claro: fondo mineral `#f7f8f5`, superficie `#ffffff`, texto `#202c27`, secundario `#59665f`, acento bosque `#245c44`, borde de campo `#7a8780`.
- Oscuro: fondo `#171e1b`, superficie `#202a25`, texto `#edf2ee`, secundario `#b8c5bc`, acento `#a4d5b7`, borde de campo `#7b8f82`.
- Tipografía: sistema sans serif para lectura, Georgia para el título editorial del inicio. Escala 14/16/18/24/32/48/64 px; título fluido.
- Espaciado: 4/8/12/16/24/32/48/64/80 px. Ancho máximo 1200 px, márgenes móviles 20 px.
- Radios: controles 8 px; fotografías 12 px; hero 16 px. Sombra solo para superficies superpuestas.
- Breakpoints: 640 px (dos columnas), 960 px (navegación completa y tres columnas).

## Interacción y accesibilidad

Temas claro, oscuro y sistema; persistencia protegida ante almacenamiento bloqueado; aplicación antes de CSS. Foco visible, controles de 44 px, contraste medido por tema. Navegación móvil desplegable no modal con Escape y retorno al disparador. Detalles con `dialog` nativo. Carrusel manual por defecto; reproducción opcional, detenida con foco, hover y movimiento reducido. Resultados anunciados sin volver a leer todas las tarjetas. Formularios con errores asociados. Sin navegación interceptada.

## Mantenimiento

`css/global.css` contiene tokens y componentes universales. CSS por página contiene solo composición específica. `scripts/shell.mjs` sincroniza header y footer estáticos durante el build; funcionan sin JavaScript. TypeScript es la fuente de los scripts compilados en `js/`.
