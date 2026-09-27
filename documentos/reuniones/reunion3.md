## Acta de Reunión N.° 3 - MogulEnd (Eco Ruta Temuco)

**Fecha:** 04/09/2026

**Hora:** 19:00 PM - 20:30 PM

**Registrado por:** Matías Espinoza

**Tipo de reunión:** En línea / Discord

### Asistencia

**Presentes:**
- Matías Espinoza (Scrum Master)
- Tomás Mardones (Project Owner)
- Annan John (Developer)
- Catalina Ojeda (QA/Tester)
- Miguel Torres (Developer)



### Descripción de Avances por Integrante del Equipo

**Matías Espinoza (Scrum Master):**
- Revisó el avance general del Sprint 1 y confirmó que vamos en buen ritmo.
- Actualizó las actas de reunión en el repositorio.
- Coordinó la revisión cruzada de código entre integrantes.

**Tomás Mardones (Project Owner):**
- Validó que `contacto.html` cumple con las historias de usuario.
- Ajustó el texto del formulario para que sea más claro y accesible.
- Agregó información de contacto real (correo, teléfono, dirección de Temuco).

**Annan John (Developer):**
- Completó los filtros de rutas (dificultad, distancia, duración).
- Implementó las tarjetas de resultados con grid responsive.
- Agregó `aria-live="polite"` en la sección de resultados para lectores de pantalla.

**Catalina Ojeda (QA/Tester):**
- Realizó pruebas de navegación con teclado en `home.html` y `rutas.html`.
- Detectó que el foco no es visible en algunos botones del carrusel.
- Ejecutó axe DevTools y encontró 3 errores de accesibilidad en `index.html`.
- Compartió el checklist de accesibilidad completo con el equipo.

- **Miguel :** Reviso la integración del `global.css` con las páginas.

### Problemas Identificados (Bloqueos que Afectan el Progreso del Equipo)


- **Foco no visible:** Los botones del carrusel no tienen estilos `:focus` definidos.
- **Errores de axe:** 3 errores críticos en `index.html` relacionados con ARIA.

### Resoluciones y Acuerdos

- Catalina enviará el reporte de axe DevTools a Miguel por Discord para que lo revise.
- Cada integrante agregará estilos `:focus` visibles en todos los elementos interactivos.
- Se acordó hacer una sesión de pairing entre Miguel y Annan el viernes 05/09 para resolver dudas de integración.
- Catalina preparará una guía rápida de accesibilidad para compartir con el equipo.


---

