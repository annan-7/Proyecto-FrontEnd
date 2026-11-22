# Validación del rediseño EcoRutas

Validación realizada el 4 de noviembre de 2026 en el navegador colaborativo de T3 Code.

- Cinco páginas: inicio, rutas, contacto, sobre nosotros y 404.
- Anchos 320, 768 y 1440 px; temas claro y oscuro: 30 combinaciones sin overflow horizontal ni infracciones detectadas por axe-core 4.10.3 para WCAG A/AA 2.0, 2.1 y 2.2.
- Ninguna imagen visible rota. La imagen sin `src` del diálogo cerrado se rellena al abrir detalles.
- Verificados filtros por categoría, dificultad, duración, búsqueda sin tildes, ausencia de resultados y limpieza de filtros.
- Verificados apertura/cierre de detalles y retorno del foco al disparador; menú móvil con Escape y retorno de foco.
- Formulario: errores por campo, foco en primer error y conservación del mensaje validado. No hay envío remoto.
- Temas: cambio inmediato, persistencia entre páginas y reacción a la preferencia de sistema claro/oscuro.
- Leaflet: mosaicos OpenStreetMap claros y CARTO oscuros cargados; se conserva la referencia geográfica original de Temuco.
- Open-Meteo: respuesta real, fallo simulado y botón de reintento comprobados. La sustitución temporal de fetch se retiró al finalizar la prueba.
- Diez pruebas locales de estructura, referencias, contraste de tokens y comportamiento del tema aprobadas con `npm test`. Build TypeScript aprobado.

No se ejecutó una evaluación manual con lector de pantalla ni una matriz de navegadores Safari/Firefox. Los resultados automáticos no constituyen una certificación completa de conformidad WCAG.
