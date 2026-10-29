# Reporte de Avance - Sprint 1
**Proyecto:** ECORUTAS (MogulEnd)  
**Curso:** Desarrollo de Frontend (ICINF1107)  
**Fecha de reporte:** 15/09/2026  
**Sprint:** Sprint 1 (HTML Semántico, Accesibilidad y CSS Responsivo)

---

##  Equipo y Roles (Sprint 1)

| Integrante | Rol Ágil | Módulo Asignado |
|------------|----------|-----------------|
| **Matías Espinoza** | Scrum Master | Home (`index.html`, `home.css`) |
| **Tomás Mardones** | Project Owner | Contacto (`contacto.html`, `contacto.css`) |
| **Annan John** | Developer | Rutas (`rutas.html`, `rutas.css`) |
| **Miguel Torres** | Developer | Integración / 404 (`global.css`, `404.html`) |
| **Catalina Ojeda** | QA / Tester | Nosotros (`nosotros.html`, `nosotros.css`) + QA General |

---

##  Objetivo del Sprint 1
Construir la estructura base del sitio web ECORUTAS utilizando **HTML semántico**, aplicar **CSS responsivo** con enfoque *Mobile First*, y garantizar un nivel básico de **accesibilidad web** (WCAG AA) antes del cierre del sprint.

---

## Estado General del Sprint

| Indicador | Estado | Porcentaje |
|-----------|--------|------------|
| Estructura HTML |  Completado | 100% |
| Estilos CSS y Responsive | Completado | 100% |
| Despliegue en GitHub Pages | Completado | 100% |
| Auditoría de Accesibilidad (Bug Bounty) |  Completado | 100% |
| Corrección de Issues de Accesibilidad |  En Progreso | 85% |
| Documentación y Actas |  Completado | 100% |

**Avance total del Sprint 1:**  **95%**

---

##  Avance Detallado por Módulo

### 1. Home / Inicio (Matías Espinoza)
- [x] Estructura semántica (`<header>`, `<main>`, `<section>`, `<footer>`).
- [x] Hero section con imagen de fondo y CTA.
- [x] Sección de "Senderos destacados" con grid de tarjetas.
- [x] Carrusel de "Próximos Eventos" (estructura visual).
- [x] Adaptación responsive (Móvil, Tablet, Desktop).
- [ ] *Pendiente:* Agregar JavaScript básico para el carrusel (Sprint 2).

### 2. Buscar Rutas (Annan John)
- [x] Formulario de búsqueda con campos semánticos.
- [x] Filtros rápidos (chips) y avanzados (`<details>`).
- [x] Grid de tarjetas de rutas con badges de dificultad.
- [x] Uso de `aria-live="polite"` para resultados dinámicos.
- [x] Diseño responsive (1 col → 2 col → 3 col).
- [ ] *Pendiente:* Lógica de filtrado con JavaScript (Sprint 2).

### 3. Contacto (Tomás Mardones)
- [x] Sección de información de contacto.
- [x] Formulario accesible con `<label>` vinculados y `aria-describedby`.
- [x] Validación HTML5 nativa (`required`, `type="email"`).
- [x] Estilos de foco (`:focus`) visibles para navegación por teclado.
- [x] Layout responsive (apilado en móvil, lado a lado en desktop).

### 4. Sobre Nosotros (Catalina Ojeda)
- [x] Secciones de Historia, Misión, Visión y Valores.
- [x] Grid de equipo con fotos y roles.
- [x] Jerarquía de encabezados correcta (único `<h1>`).
- [x] Imágenes con textos `alt` descriptivos.
- [x] Tipografía y paleta de colores consistente.

### 5. Integración y Global (Miguel Torres)
- [x] Archivo `global.css` con variables CSS y reset.
- [x] Navbar y Footer unificados y reutilizables.
- [x] Página de error `404.html` con diseño consistente.
- [x] Configuración de GitHub Actions para despliegue automático.
- [x] Menú hamburguesa funcional en móvil (CSS/JS básico).

---

##  Resumen de Auditoría de Accesibilidad (Bug Bounty)

Durante la Semana 6, el equipo realizó una auditoría completa utilizando pruebas manuales y automáticas.

**Herramientas utilizadas:**
- Manuales: Teclado, NVDA (Lector de pantalla), NoCoffee (Simulador de baja visión).
- Automáticas: axe DevTools, Lighthouse, WAVE.

**Hallazgos principales:**
- **Total de issues detectados:** 18
- **Severidad Alta:** 6 (Corregidos: 5)
- **Severidad Media:** 8 (Corregidos: 6)
- **Severidad Baja:** 4 (Corregidos: 2)

**Score actual en Lighthouse (Accesibilidad):**  **92/100**

*Nota: El reporte completo en PDF se encuentra en `documentos/reportes/reporte-bug-bounty.pdf`.*

---

## Bloqueos y Riesgos Actuales

| Bloqueo / Riesgo | Impacto | Acción de Mitigación |
|------------------|---------|----------------------|
| Falta de interactividad real (JS) | Medio | Planificado para Sprint 2. El sitio es navegable pero estático. |
| Imágenes de equipo genéricas | Bajo | Se reemplazarán por fotos reales en la siguiente iteración. |
| Tiempo para correcciones finales | Medio | Se priorizaron los issues de severidad Alta y Media en Trello. |

---

##  Plan para la Semana 7 (Cierre de Sprint)

1. **Lunes a Miércoles:**
   - Finalizar correcciones de accesibilidad pendientes (issues de severidad Baja).
   - Revisión cruzada de código y merge de ramas a `main`.
2. **Jueves:**
   - Ensayo de la presentación final (15 minutos).
   





---

**Registrado por:** Catalina Ojeda

**Revisado por:** Tomás Mardones (Product Owner)