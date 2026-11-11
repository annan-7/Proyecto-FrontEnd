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

El formulario de contacto valida localmente y no envía mensajes. El mapa conserva el marcador regional de Temuco; no se publican posiciones de senderos sin coordenadas verificadas. Los servicios cartográficos y meteorológicos requieren conexión a Internet.
