# EcoRuta Temuco

## Integrantes y roles (Sprint actual)

| Rol ágil | Sprint 0 | Sprint 1 | Sprint 2 | Sprint 3 (Actual) |
|---|---|---|---|---|
| Scrum Master | Matías Espinoza | Matías Espinoza | Annan John | Miguel Torres |
| Project Owner | Tomás Mardones | Tomás Mardones | Matías Espinoza | Catalina Ojeda |
| Developer | Annan John | Annan John | Tomás Mardones | Annan John |
| Developer | Miguel Torres | Miguel Torres | Miguel Torres | Matías Espinoza |
| QA/Tester | Catalina Ojeda | Catalina Ojeda | Catalina Ojeda | Tomás Mardones |

## Descripción breve

> Ecoruta Temuco, es un servicio de turismo basado en la región de la Araucanía, principalmente en la naturaleza, ecología y rutas que pueda ofrecer, mostrando la información a través de una página web la cual además está adaptada para ser accesible para ciertas discapacidades.

## Tecnologías utilizadas

- HTML5 / CSS3
- JavaScript / TypeScript
- Sitio estático sin framework
- Leaflet / OpenStreetMap / CARTO y Open-Meteo

## Cómo ejecutar el proyecto

```bash
# Instalar dependencias
npm ci
npm run build

# Ejecutar en modo desarrollo
npm run dev
```

## Estado del proyecto

- Sprint actual: Sprint 2
- Última actualización: 01/10/2026

## Tablero Kanban

Enlace al tablero: [(Tablero)](https://trello.com/invite/b/6a7d08bce56e803c8918e4ab/ATTIa3bdf285d48913cacab0ad8966e85a2e58DF93F4/mi-tablero-de-trello)

## Enlace de despliegue

+ [EcoRuta Web](https://scintillating-capybara-d515c7.netlify.app/)

## Build y validación

`npm run build` compila TypeScript a `js/` y sincroniza header/footer estáticos mediante `scripts/shell.mjs`. `npm test` verifica recursos locales, estructura HTML, contraste de ambos temas y comportamiento del selector. `npm run dev` sirve el sitio en http://localhost:5173 con Python 3.

El sistema visual y la auditoría están en [DESIGN.md](DESIGN.md). Los resultados de validación del rediseño están en [documentos/QA-test/rediseno.md](documentos/QA-test/rediseno.md).

El formulario de contacto valida localmente y no envía mensajes. El listado y el mapa consultan https://ecorutas-api.vercel.app/api/v1/routes con paginación. El mapa muestra las coordenadas del catálogo como puntos de referencia (no trazados de senderos) y agrupa rutas con las mismas coordenadas en un popup. El modo oscuro adapta únicamente las teselas de OpenStreetMap. Los servicios cartográficos y meteorológicos requieren conexión a Internet.

## Innovación: Mi salida EcoRuta

En [Rutas](paginas/rutas.html#salida) se añade un planificador con recomendaciones explicadas por región, tiempo y dificultad, favoritas persistentes, pronóstico por lugar y fecha, lista de preparación responsable, enlace compartible y ficha HTML que se puede abrir sin conexión e imprimir. El catálogo, sus filtros y detalles permanecen disponibles; cada tarjeta permite preparar una salida.

La mejora usa **Preact + TypeScript** como un componente independiente dentro del sitio. `planner/app.tsx` contiene la interfaz y estado; `planner/core.ts` separa recomendaciones, validación, fechas, clima y exportación. `tsconfig.planner.json` comprueba tipos y `scripts/planner-build.mjs` genera `js/planificador.js` con esbuild. `npm run build` ejecuta ambos pasos y conserva el build del sitio existente. No requiere claves de API ni un servidor de aplicación.

Las recomendaciones reflejan los datos publicados; no certifican seguridad o accesibilidad física. El pronóstico se obtiene de Open-Meteo para un máximo de siete días. Las preferencias quedan en este navegador; el enlace compartido no incluye la lista personal de preparativos. Solo la ficha descargada funciona sin conexión.

El [guion y relación con el brief](documentos/QA-test/mi-salida-ecoruta.md) explica la demostración, pruebas y límites, incluida la validación del framework con el docente. Ejecutar `npm run build` y `npm test` antes de publicar.

## API de rutas (servicio)

El servicio NestJS, Prisma y SQLite está en [backend/](backend/README.md). Incluye 62 recorridos reales de las 16 regiones, Swagger, CRUD administrativo y Docker.

```bash
cd backend
docker compose up --build -d
```

API: http://localhost:3000/api/v1/routes. Swagger: http://localhost:3000/api/docs. La autenticación administrativa y las fuentes del catálogo se explican en la documentación del backend.

El frontend se sirve y publica desde `dist/site`. Este directorio contiene solo recursos públicos; el backend, SQLite y los archivos de entorno quedan excluidos.
