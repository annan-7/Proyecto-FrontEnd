ECORUTAS - Product Backlog

## Sprint 1 - Cierre (Semana 7)

###  Objetivo del Sprint 1
HTML semántico, accesibilidad, CSS responsivo

---

##  Tareas Críticas - Cierre Sprint 1 (Semana 7)

### Presentación y Defensa
-  **Preparar presentación de 15 minutos** para el cliente
  - Responsable: Todo el equipo
  - Prioridad: Alta
  - Deadline: Semana 7 (Despues de paro)
  - Descripción: Presentación de resultados del Sprint 1 siguiendo documento tipo y rúbrica



-  **Subir reporte Bug Bounty a GitHub**
  - Responsable: QA del equipo
  - Prioridad: Alta
  - Ubicación: `documentos/reportes/`
  - Formato: PDF
  - Descripción: Reporte completo de hallazgos de accesibilidad

-  **Actualizar Trello con tareas de corrección**
  - Responsable: Scrum Master
  - Prioridad: Alta
  - Descripción: Registrar issues de accesibilidad como tareas activas

-  **Completar coevaluación individual**
  - Responsable: Cada integrante
  - Prioridad: Alta
  - Descripción: Calificar performance de compañeros (escala 1-7, solo enteros)

-  **Control de conocimientos**
  - Responsable: Cada integrante
  - Prioridad: Alta
  - Descripción: Preparación de HTML y CSS principalmente

---

##  Correcciones de Accesibilidad (Bug Bounty)

### Navegación con Teclado
-  **Verificar foco visible en todos los elementos interactivos**
  - Severidad: Alta
  - Responsable: Matias (Home), Annan (Rutas), Tomas (Contacto), Catalina (Nosotros)
  - Descripción: Asegurar que `:focus` tenga estilos visibles en botones, links y formularios

-  **Implementar skip link en todas las páginas**
  - Severidad: Media
  - Responsable: Miguel
  - Descripción: Agregar enlace "Saltar al contenido principal" al inicio de cada página

-  **Verificar orden de tabulación lógico**
  - Severidad: Media
  - Responsable: QA
  - Descripción: Revisar que Tab siga flujo visual y semántico

### Lectores de Pantalla
-  **Verificar único `<h1>` por página**
  - Severidad: Alta
  - Responsable: Cada integrante en su página
  - Descripción: Asegurar jerarquía correcta de encabezados

-  **Agregar `aria-label` a navegación**
  - Severidad: Alta
  - Responsable: Miguel
  - Descripción: `<nav aria-label="Navegación principal">`

-  **Verificar `alt` descriptivo en imágenes**
  - Severidad: Alta
  - Responsable: Cada integrante
  - Descripción: Todas las imágenes deben tener texto alternativo significativo

-  **Implementar landmarks semánticos**
  - Severidad: Media
  - Responsable: Cada integrante
  - Descripción: Usar `<header>`, `<nav>`, `<main>`, `<footer>` correctamente

### Contraste y Baja Visión
-  **Verificar contraste WCAG AA (4.5:1 mínimo)**
  - Severidad: Alta
  - Responsable: QA con herramientas automáticas
  - Descripción: Usar axe DevTools y Color Contrast Analyzer

-  **Asegurar escalabilidad de fuentes al 200%**
  - Severidad: Media
  - Responsable: Cada integrante
  - Descripción: Usar `rem` en lugar de `px` para tamaños de fuente

-  **Verificar legibilidad con simuladores de daltonismo**
  - Severidad: Media
  - Responsable: QA
  - Descripción: Usar NoCoffee Vision Simulator

### Pruebas Automáticas
- **Ejecutar axe DevTools en todas las páginas**
  - Severidad: Alta
  - Responsable: QA
  - Descripción: Documentar todos los issues encontrados

-  **Ejecutar Lighthouse y guardar reporte**
  - Severidad: Alta
  - Responsable: QA
  - Descripción: Captura de score de accesibilidad y lista de issues

-  **Revisar resultados de WAVE**
  - Severidad: Media
  - Responsable: QA
  - Descripción: Verificar redundancia de hallazgos

---

##  Mejoras de Código - Sprint 1

### Consistencia Visual
-  **Unificar paleta de colores en todas las páginas**
  - Responsable: Miguel
  - Descripción: Usar variables CSS de `global.css` en todos los archivos

-  **Estandarizar tipografía (Inter)**
  - Responsable: Cada integrante
  - Descripción: Reemplazar fuentes inconsistentes por Inter/Arial

-  **Unificar estilos de botones**
  - Responsable: Miguel
  - Descripción: Crear clase `.btn` reutilizable en `global.css`

-  **Unificar navbar y footer**
  - Responsable: Miguel
  - Descripción: Asegurar que todas las páginas usen los mismos componentes

### Responsive Design
-  **Verificar mobile first en todas las páginas**
  - Responsable: Cada integrante
  - Descripción: Usar `min-width` en media queries, no `max-width`

-  **Probar en 3 breakpoints**
  - Responsable: QA
  - Descripción: Móvil (<768px), Tablet (768-1024px), Desktop (>1024px)

-  **Corregir `height` fijos por `min-height`**
  - Responsable: Cada integrante
  - Descripción: Evitar contenedores con altura fija que rompan responsive

### HTML Semántico
-  **Reemplazar `<div>` por etiquetas semánticas**
  - Responsable: Cada integrante
  - Descripción: Usar `<section>`, `<article>`, `<aside>` cuando corresponda

-  **Agregar `aria-current="page"` en navegación activa**
  - Responsable: Cada integrante
  - Descripción: Indicar página actual en el menú

-  **Verificar estructura de formularios**
  - Responsable: Tomas
  - Descripción: Labels asociados correctamente, `aria-describedby` para hints

---

