# Integración y seguimiento

Responsables propuestos según roles del README; confirmar asignación con el equipo. Cada fila es una tarjeta independiente. No se ha creado un PR ni publicado estos cambios desde esta tarea; completar los enlaces reales al integrarlos.

| Tarjeta | Responsable propuesto | Cambio / aceptación | PR | Prueba integrada |
|---|---|---|---|---|
| Formulario redirige a 404 | Tomás | Conectar main.js y estado accesible; validar sin navegar; aclarar que no hay envío real | Pendiente | Contacto: inválido bloqueado; válido muestra confirmación local |
| Dependencia de mapa y dimensiones | Annan | Leaflet por jsDelivr, altura explícita y error si falta librería | Pendiente | Inicio: mapa con altura, controles y mosaicos visibles |
| Script relativo inexistente | Miguel | Corregir ruta de main.js en Sobre nosotros | Pendiente | Network: script HTTP 200 |
| Carrusel integrado | Matías | Mantener carrusel.js existente y comprobar botones | Pendiente | Inicio: siguiente, anterior y pausa |
| Consumo API de clima | Annan | Open-Meteo en Inicio; carga, éxito, error, reintento y timeout | Pendiente | Respuesta real 200 y casos controlados de fallo |
| Imágenes ausentes de Sobre nosotros | Miguel | Incorporar imágenes autorizadas o corregir referencias | Pendiente | Sin imágenes rotas; pendiente de resolver |
| QA versión común | Catalina | Ejecutar matriz inferior sobre el commit integrado y la URL publicada | Pendiente | Adjuntar fecha, SHA, navegador, resultado y evidencia |

## API implementada

GET https://api.open-meteo.com/v1/forecast con latitude=-38.7359, longitude=-72.5904, current=temperature_2m,precipitation,wind_speed_10m y timezone=America/Santiago. No necesita credenciales para el servicio gratuito no comercial; revisar condiciones antes de uso comercial. Vista consumidora: Inicio, sección Tiempo actual en Temuco. Campos: current.time (texto ISO local), temperature_2m (número °C), precipitation (número mm), wind_speed_10m (número km/h). No se envían datos del formulario a esta API.

## Recurso MockAPI solicitado por el taller

Open-Meteo satisface consumo remoto real, pero no sustituye un requisito explícito de MockAPI. Propuesta de recurso `rutas`: id (string), nombre (string), descripcion (string), localidad (string), dificultad (string: facil/media/alta), distanciaKm (number), duracionHoras (number), latitud (number), longitud (number), imagenUrl (string). Vista prevista: páginas/rutas, reemplazando tarjetas estáticas después de disponer del endpoint HTTPS real. Mostrar carga antes de GET, tarjetas y contador en éxito, vacío sin resultados, error con reintento ante HTTP/red/JSON inválido. Endpoint, cuenta y conexión de este recurso: pendientes; no inventar una URL ni afirmar que está implementado.

## Matriz QA de Catalina

Herramientas: Chromium/Firefox, DevTools Network y Console, Playwright para regresión, axe o WAVE para revisión accesible. Repetir en móvil 390px y escritorio 1280px, usando tanto servidor local como https://annan-7.github.io/Proyecto-FrontEnd/ después del despliegue.

1. Contacto: campos vacíos, correo inválido y espacios en nombre/mensaje no producen confirmación; datos válidos muestran demostración sin cambiar URL a 404 ni enviar información por query string.
2. Inicio: comprobar cada script HTTP 200, ausencia de errores JS, siguiente/anterior, pausa/reanudación y teclado del carrusel.
3. Mapa: contenedor visible, zoom, mosaicos y atribución OpenStreetMap; sin Leaflet se muestra mensaje comprensible. Verificar solicitudes de mosaicos reales, no solo existencia del contenedor.
4. Clima: red lenta muestra carga; respuesta real muestra temperatura, lluvia, viento y fecha; offline, HTTP 500, JSON inválido y timeout muestran error; reintentar tras recuperar red funciona y evita solicitudes simultáneas.
5. Rutas: búsqueda sin coincidencias, limpiar filtros (abrir avanzados), seis resultados y abrir/cerrar detalle.
6. Sobre nosotros: main.js debe cargar; registrar por separado imágenes ausentes. No cerrar esta tarjeta hasta corregirlas.

Registrar por caso: fecha, URL, commit, responsable, resultado esperado/obtenido, captura o traza y enlace al PR. Los ensayos con respuestas simuladas no acreditan disponibilidad real de API. No hay evidencia de validación publicada ni de cumplimiento antes del plazo original.

## Validación ejecutada el 26/10/2026

Servidor local, Chromium + Playwright: carrusel siguiente/anterior/pausa, búsqueda de rutas sin resultados, restauración de seis resultados, apertura/cierre de detalle, rechazo de nombre compuesto solo por espacios y confirmación local sin redirección: PASS. Sin errores JavaScript durante estos flujos.

Integración con servicios reales: Leaflet y mosaicos OpenStreetMap cargados, Open-Meteo respondió con temperatura, precipitación, viento y fecha: PASS. Chromium no logró cargar directamente los recursos a través del proxy de esta máquina; para la prueba se reenviaron las solicitudes HTTPS mediante urllib con verificación TLS, devolviendo las respuestas reales al navegador. Esto acredita el renderizado y consumo con datos reales mediante ese intermediario de pruebas; no acredita conectividad directa de Chromium ni validación de la página publicada. Las pruebas anteriores con respuestas controladas verificaron éxito/error de clima. La confirmación del formulario sigue siendo local, sin envío de correo. MockAPI y las fotografías ausentes de Sobre nosotros siguen pendientes.
