# EcoRuta Temuco

## Integrantes y roles (Sprint actual)

| Rol ágil | Sprint 0 | Sprint 1 | Sprint 2 (actual)| Sprint 3 |
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

+ [EcoRuta Web](https://annan-7.github.io/Proyecto-FrontEnd/index.html)

## Build y validación

`npm run build` compila TypeScript a `js/` y sincroniza header/footer estáticos mediante `scripts/shell.mjs`. `npm test` verifica recursos locales, estructura HTML, contraste de ambos temas y comportamiento del selector. `npm run dev` sirve el sitio en http://localhost:5173 con Python 3.

El sistema visual y la auditoría están en [DESIGN.md](DESIGN.md). Los resultados de validación del rediseño están en [documentos/QA-test/rediseno.md](documentos/QA-test/rediseno.md).

El formulario de contacto valida localmente y no envía mensajes. El listado y el mapa consultan https://ecorutas-api.vercel.app/api/v1/routes con paginación. El mapa muestra las coordenadas del catálogo como puntos de referencia (no trazados de senderos) y agrupa rutas con las mismas coordenadas en un popup. El modo oscuro adapta únicamente las teselas de OpenStreetMap. Los servicios cartográficos y meteorológicos requieren conexión a Internet.

## API de rutas

El servicio NestJS, Prisma y SQLite está en [backend/](backend/README.md). Incluye 62 recorridos reales de las 16 regiones, Swagger, CRUD administrativo y Docker.

```bash
cd backend
docker compose up --build -d
```

API: http://localhost:3000/api/v1/routes. Swagger: http://localhost:3000/api/docs. La autenticación administrativa y las fuentes del catálogo se explican en la documentación del backend.

El frontend se sirve y publica desde `dist/site`. Este directorio contiene solo recursos públicos; el backend, SQLite y los archivos de entorno quedan excluidos.
