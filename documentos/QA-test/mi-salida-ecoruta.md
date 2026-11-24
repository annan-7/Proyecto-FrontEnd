# Mi salida EcoRuta: innovación y demostración

## Problema y valor para el cliente

El brief de EcoRuta Temuco pide un lugar confiable y accesible donde descubrir rutas y consultar información antes de salir. El catálogo responde a «qué rutas hay»; esta mejora añade «cuál encaja con mi tiempo y cómo preparo mi salida».

Se agrega un planificador a `paginas/rutas.html`, sin reemplazar el catálogo, buscador, filtros, diálogo, mapa, temas ni contacto. Funciona con datos de la API real. No genera rutas ficticias ni puntuaciones de seguridad.

## Funciones demostrables

- Recomendaciones por región, tiempo y dificultad máxima, con criterios visibles. La región inicial es La Araucanía. Se priorizan menor dificultad y duración; se muestran hasta tres coincidencias. Si ninguna encaja, se explica cómo ampliar la búsqueda sin introducir resultados incompatibles.
- Favoritas, preferencias, ruta seleccionada y preparación persistidas en el navegador. Los datos dañados o fechas vencidas se recuperan con valores válidos. Si el almacenamiento está bloqueado, la sesión continúa y se ofrece la descarga.
- Cualquier ruta del catálogo se incorpora mediante «Preparar mi salida». Las favoritas pueden consultarse aunque no coincidan con las preferencias actuales.
- Pronóstico Open-Meteo para las coordenadas de la ruta y la fecha elegida, dentro de los próximos siete días. Temperaturas, probabilidad de lluvia, viento, fuente y hora de consulta. Hay error recuperable, cancelación de solicitudes obsoletas y espera máxima de 12 segundos.
- Lista de preparación y turismo responsable: permisos, equipamiento, contacto, residuos y consideración de compras locales. Las marcas se reinician al cambiar ruta o fecha.
- Ficha HTML descargable sin dependencias externas: ruta, fecha, coordenadas de referencia, pronóstico con fecha de consulta y preparativos. Se puede abrir sin conexión e imprimir. El sitio completo no se presenta como disponible offline.
- Enlace compartible que restaura ruta, fecha y preferencias. No comparte favoritas ni preparativos personales. El enlace necesita Internet para consultar datos actualizados.

## Relación con el brief

| Requisito | Evidencia aportada por esta mejora |
| --- | --- |
| Datos externos e información antes de salir | Catálogo real + pronóstico por ruta y fecha |
| Gestión de estado | Favoritas, preferencias y preparación con persistencia y recuperación |
| TypeScript y componentes modernos | Preact con `App`, `RouteOption`, `Weather`; lógica de dominio independiente y tipada |
| Diseño mobile-first | Una columna móvil; campos y paneles se adaptan en tablet y escritorio |
| Accesibilidad | Etiquetas nativas, regiones y encabezados, `aria-pressed`, avisos `role=status`, foco tras selección, temas existentes |
| Turismo sustentable | Preparación orientada a residuos, cuidado del territorio y economía local |
| Documentación y Demo Day | Este guion, README y pruebas reproducibles |

El brief indica que el framework debe definirse con el docente: esta implementación elige Preact para incorporarlo sin migrar ni retirar las páginas existentes. La aceptación de esa elección corresponde al curso. Esta mejora no acredita por sí sola todos los criterios del semestre: también deben revisarse el directorio de emprendimientos, la auditoría integral WCAG AA, el flujo de PR del equipo y el despliegue público. No se promete una calificación.

## Guion de Demo Day (3–4 minutos)

1. Abrir Rutas: mostrar el catálogo conservado y presentar «Mi salida EcoRuta».
2. Elegir La Araucanía, hasta 4 horas y dificultad moderada. Explicar el criterio de las coincidencias y que la clasificación proviene de la API.
3. Guardar una ruta favorita y pulsar «Planificar esta ruta». Revisar pronóstico y fecha; explicar que no representa una autorización de acceso.
4. Marcar preparativos, recargar y comprobar persistencia. Cambiar de fecha para mostrar el reinicio de preparación y la actualización meteorológica.
5. Descargar la ficha, abrirla sin conexión y compartir el enlace en otra pestaña.
6. Mostrar el mismo flujo en móvil y modo oscuro. Regresar al catálogo y abrir los detalles existentes.

## Validación automatizada

```sh
npm ci
npm run build
npm test
npm run dev
```

`tests/planificador.test.mjs` cubre restricciones y orden de recomendaciones, resultados vacíos, estado corrupto, favoritos duplicados, fechas y cambio de día en Chile, coordenadas cero, datos meteorológicos faltantes/inválidos, error HTTP, unidades de consulta y escape de contenido remoto en la ficha.

## Comprobación en navegador (24 de noviembre de 2026)

Se comprobó la API real del catálogo y Open-Meteo, la persistencia al recargar de ruta/favorita/preparativos, la descarga HTML con los datos consultados y el enlace compartible. Se inspeccionaron los anchos 390, 768 y 1280 px con temas claro y oscuro, sin desbordamiento horizontal en los anchos revisados. Se verificó activación de checkbox con Espacio y foco visible.

Con fallos controlados en la pestaña de pruebas se verificó: error meteorológico sin bloquear la preparación, reintento con recuperación, eliminación del pronóstico anterior al cambiar fecha, reinicio de preparativos y rechazo de una respuesta meteorológica tardía de otra ruta. Con almacenamiento bloqueado, el checkbox siguió funcionando y apareció el aviso de sesión sin persistencia. Esto es una revisión funcional focalizada, no una certificación WCAG de todo el sitio.

## Límites de datos y revisión del cliente

La API puede contener clasificaciones o duraciones que el operador de turismo debe verificar. Por ejemplo, el catálogo consultado clasifica «Volcán Villarrica» como fácil: el frontend reproduce el dato y lo atribuye, pero no lo certifica. Las recomendaciones no evalúan capacidad física, seguridad, permisos, costos ni accesibilidad del terreno. No se inventan pendientes, servicios locales o emisiones ahorradas.

Los umbrales meteorológicos son consejos generales, no alertas oficiales: tormenta según código WMO, lluvia desde 70 %, viento desde 40 km/h, calor desde 30 °C o mínima igual/inferior a 0 °C. La ficha indica que el pronóstico es una copia estática y debe revisarse de nuevo.
