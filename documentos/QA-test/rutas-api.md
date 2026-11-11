# Ecorutas API: integración de rutas

## Archivos y alcance

`paginas/rutas.html` conserva el buscador, los filtros, las clases de tarjetas y el diálogo existentes. Las tarjetas se clonan desde un template del marcado anterior y se rellenan con datos reales de la API; no se usan las seis rutas estáticas como una respuesta simulada. Se retiró de esta página la sección y la carga del script anterior de Wikipedia.

`js/rutas.js` obtiene el catálogo de `https://ecorutas-api.vercel.app/api/v1/routes?limit=100`, valida `items` y `total` y usa UUIDs de la respuesta. Si el catálogo supera 100, descarga las páginas restantes con `skip` antes de habilitar el filtrado local del conjunto completo. No hay totales ni IDs de rutas fijados en el código de aplicación. GET ordinario HTTPS, sin credenciales, Authorization ni `no-cors`.

Busca por nombre/ubicación sin distinguir mayúsculas ni tildes y combina dificultad, ubicación, tipo, distancia y duración. Los valores internos de dificultad se conservan: `facil`, `moderada`, `dificil`, `experto`. Las etiquetas visibles son Fácil, Moderada, Difícil, Experto. Se añade Trekking a los tipos existentes, porque la fuente del catálogo incluye ese valor. Las ubicaciones y el máximo de distancia se obtienen de los datos; restablecer filtros muestra todo el catálogo.

El diálogo solicita `/api/v1/routes/{UUID}` al seleccionar una tarjeta. Cancela solicitudes anteriores al cerrar/cambiar ruta, evita respuestas obsoletas, muestra error específico de 404, reintento para otros fallos e información adicional disponible. Las coordenadas cero son válidas. Todo texto remoto se inserta mediante textContent; imágenes/enlaces solo admiten HTTPS. No se añaden operaciones de escritura.

## Fotografías

`assets/data/ecorutas-image-credits.json` es una copia íntegra del archivo del repositorio del proveedor, consultado el 11/11/2026:
https://github.com/annan-7/ecorutas-api/blob/main/src/data/image_credits.json

La copia es local: ese archivo de GitHub no se presenta como un endpoint de la API. Se buscan créditos por `route_id` y se comprueba además que la URL coincida con `image_url`. Cada foto muestra autor, licencia enlazada, fuente original, descripción y aclaración de que puede representar el parque/región y no el sendero exacto. Se indica el recorte visual de la presentación. Si la API cambia una fotografía, actualizar los créditos desde el repositorio y revisar su licencia antes de mostrarla. Nunca se atribuye una fotografía nueva a un autor anterior.

`assets/imagenes/ruta-sin-foto.svg` es una ilustración local de sustitución, no una foto del lugar. Se utiliza cuando falla la foto o faltan créditos verificables. El manejador de error se elimina antes de asignar el fallback para evitar bucles. Alt descriptivo, lazy loading y dimensiones reservadas en tarjetas/diálogo.

## Pruebas reproducibles

Desde la raíz del frontend:

```sh
python3 -m http.server 8003
# En otra terminal, con Python Playwright y Chromium disponibles:
python3 tests/rutas_api_smoke.py
node --check js/rutas.js
git diff --check
```

`tests/fixtures/ecorutas-routes.json` procede de `https://raw.githubusercontent.com/annan-7/ecorutas-api/main/src/data/routes.json`, consultado el 11/11/2026. Es una fixture de pruebas del repositorio, no una captura de la API de producción. Las pruebas controlan los HTTP de lista y detalle con la estructura indicada por el usuario.

Resultado: PASS para campos, títulos/descripciones sin interpretar HTML, atribución, filtros combinados/restablecimiento sin nuevas consultas, búsqueda sin tildes, modal por UUID, 404, reintento, coordenadas cero, fallback, respuestas vacías, HTTP/JSON/esquema/red fallidos, reintento sin duplicados, catálogo de varias páginas, teclado Enter/Escape y ausencia de desbordamiento a 390px. Sin errores JavaScript no controlados en estos escenarios.

La validación Python existente de `.github/workflows/deploy.yml` pasó; conserva advertencias anteriores por las rutas del fragmento footer y seis imágenes ausentes de Sobre nosotros. No hay package.json ni comando de build en este sitio estático.

## Comprobación real completada: 11/11/2026

Se repitieron las solicitudes reales después de que el entorno recuperara acceso a la red. `/health` y `/api/v1/routes?limit=100` respondieron HTTP 200, con `Access-Control-Allow-Origin: *`. La respuesta real incluyó `items` como array y 65 rutas, coincidentes con `total`; el frontend no fija ese número. Las 65 fotografías coincidieron con los créditos locales por UUID y URL.

La prueba en Chromium desde el servidor de desarrollo consumió directamente la API de producción, sin interceptar respuestas. PASS: catálogo completo, campos, foto real de Wikimedia, filtros combinados de ubicación/dificultad/búsqueda, detalles del UUID seleccionado, búsqueda vacía/restablecimiento y ancho móvil de 390px. Sin errores JavaScript no controlados ni solicitudes fallidas; no se observaron errores CORS. TLS permaneció verificado. La prueba requirió el almacén de confianza del navegador configurado con la CA proporcionada por el entorno para su proxy, y se ejecutó fuera del aislamiento que mantenía el almacén anterior.

Comando reproducible: `python3 tests/rutas_api_live.py`, con el servidor en puerto 8003. Requiere acceso a la API, Wikimedia y los recursos CSS/fuentes del sitio; cualquier bloqueo de red o CA debe resolverse en el entorno, sin desactivar TLS. El fallo HTTP, JSON inválido, 404 y fallback fotográfico se verifican con respuestas controladas en la suite de regresión, sin provocar fallos en el servicio público.

La comprobación corresponde al servidor de desarrollo y la API pública. El despliegue en GitHub Pages y su comprobación posterior quedan fuera de esta validación. Persisten las advertencias previas del validador sobre footer y fotografías de Sobre nosotros.
