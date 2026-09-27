```markdown
# ECORUTAS - AGENT.md
## Guía de Desarrollo para Agentes AI y Desarrolladores

---

##  Descripción del Proyecto

**ECORUTAS** es un sitio web frontend enfocado en presentar y facilitar la búsqueda de rutas de senderismo, con identidad visual relacionada con naturaleza, movilidad y sostenibilidad. El proyecto es colaborativo, construido con HTML, CSS y JavaScript vanilla, siguiendo principios de **Mobile First**, **accesibilidad (ARIA)** y **diseño consistente**.

---






## 🎨 Sistema de Diseño

### Paleta de Colores

| Uso | Nombre | HEX | Aplicación |
|-----|--------|-----|------------|
| Verde principal | Green | `#2E7D32` | Botones, enlaces, elementos principales |
| Verde oscuro | Dark Green | `#1B5E20` | Navbar, títulos importantes, hover |
| Verde claro | Light Green | `#A5D6A7` | Fondos suaves, estados secundarios |
| Blanco | White | `#FFFFFF` | Fondo principal, contraste |
| Gris texto | Dark Gray | `#263238` | Texto principal |
| Gris suave | Light Gray | `#ECEFF1` | Bordes, fondos secundarios |

### Variables CSS (global.css)

```css
:root {
  --green-primary: #2E7D32;
  --green-dark: #1B5E20;
  --green-light: #A5D6A7;
  --white: #FFFFFF;
  --text: #263238;
  --gray-light: #ECEFF1;
  --border-radius: 10px;
  --container-width: 1200px;
}
```

### Tipografía

- **Fuente principal**: `Inter` (Google Fonts)
- **Fallback**: `Arial, sans-serif`
- **Tamaños**:
  - `h1`: 36–48 px, `font-weight: 700`
  - `h2`: 28–32 px, `font-weight: 700`
  - `h3`: 20–24 px, `font-weight: 600`
  - `body`: 16 px, `line-height: 1.6`
  - `small`: 14 px

### Espaciado y Bordes

- **Border-radius**: `10px` (variable `--border-radius`)
- **Padding base**: `1rem` (móvil) → `2rem` (desktop)
- **Gap entre elementos**: `1rem` → `1.5rem`
- **Box-shadow**: `0 4px 12px rgba(0, 0, 0, 0.08)` (suave)

---

## 📐 Convenciones de Código

### HTML

#### Estructura Base

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Descripción de la página">
  <title>ECORUTAS - [Nombre de la página]</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/global.css">
  <link rel="stylesheet" href="css/[pagina].css">
</head>
<body>
  <a href="#main-content" class="skip-link">Saltar al contenido principal</a>
  
  <header class="site-header" role="banner">
    <!-- Navbar -->
  </header>
  
  <main id="main-content">
    <!-- Contenido específico -->
  </main>
  
  <footer class="site-footer" role="contentinfo">
    <!-- Footer -->
  </footer>
  
  <script src="js/main.js"></script>
</body>
</html>
```

#### Reglas HTML

1. **Siempre** incluir `lang="es"` en el `<html>`
2. **Siempre** incluir skip link para accesibilidad
3. **Siempre** usar `aria-label` en navegación y secciones
4. **Siempre** usar `alt` descriptivo en imágenes
5. **Siempre** usar `loading="lazy"` en imágenes no críticas
6. **Siempre** usar `role` cuando sea necesario (`role="list"`, `role="listitem"`)
7. **Siempre** usar `aria-current="page"` en el enlace activo del navbar
8. **Siempre** usar `aria-labelledby` para vincular secciones a sus títulos
9. **Nunca** usar `<div>` cuando exista una etiqueta semántica apropiada
10. **Nunca** dejar `href="#"` sin propósito (usar `#` solo como placeholder temporal)

### CSS

#### Nomenclatura BEM

```css
/* Bloque */
.componente { }

/* Elemento */
.componente__elemento { }

/* Modificador */
.componente--modificador { }

/* Ejemplo real */
.navbar { }
.navbar__logo { }
.navbar__links { }
.navbar__links a:hover { }
.btn--primary { }
.card--destacada { }
```

#### Mobile First (OBLIGATORIO)

```css
/* Estilos base (móvil < 768px) */
.componente {
  /* Estilos para móvil */
}

/* Tablet (≥ 768px) */
@media (min-width: 768px) {
  .componente {
    /* Ajustes para tablet */
  }
}

/* Desktop (≥ 1024px) */
@media (min-width: 1024px) {
  .componente {
    /* Ajustes para desktop */
  }
}
```

**Reglas CSS**:

1. **Siempre** usar variables CSS de `global.css`, nunca colores hardcoded
2. **Siempre** empezar con estilos móviles y escalar hacia desktop
3. **Siempre** usar `rem` para tamaños de fuente y espaciado
4. **Siempre** usar `px` solo para bordes y sombras pequeñas
5. **Nunca** usar `!important` a menos que sea absolutamente necesario
6. **Nunca** crear colores nuevos sin consultar al equipo
7. **Nunca** usar `max-width` en media queries (usar `min-width`)
8. **Nunca** usar unidades fijas como `height: 600px` (usar `min-height`)
9. **Nunca** dejar bordes de debugging (`border: 1px solid black`)
10. **Siempre** mantener consistencia en espaciado y tipografía

---

## 📱 Responsive Design

### Breakpoints

| Dispositivo | Ancho | Prioridad |
|-------------|-------|-----------|
| **Móvil** | `< 768px` | Alta (base) |
| **Tablet** | `768px – 1024px` | Media |
| **Desktop** | `> 1024px` | Alta |

### Patrones Responsive Comunes

#### Grid de Cards

```css
.cards-grid {
  display: grid;
  grid-template-columns: 1fr;        /* Móvil: 1 columna */
  gap: 1rem;
}

@media (min-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);  /* Tablet: 2 columnas */
  }
}

@media (min-width: 1024px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);  /* Desktop: 3 columnas */
  }
}
```

#### Hero Section

```css
.hero {
  display: flex;
  flex-direction: column;  /* Móvil: apilado */
  min-height: 400px;
}

@media (min-width: 768px) {
  .hero {
    flex-direction: row;   /* Tablet+: lado a lado */
    min-height: 500px;
  }
}
```

#### Navbar

```css
.navbar {
  display: flex;
  flex-direction: column;  /* Móvil: vertical */
  gap: 1rem;
}

@media (min-width: 768px) {
  .navbar {
    flex-direction: row;   /* Tablet+: horizontal */
    justify-content: space-between;
  }
}
```

---

## ♿ Accesibilidad (ARIA)

### Checklist de Accesibilidad

- [ ] Skip link presente y funcional
- [ ] `lang="es"` en el `<html>`
- [ ] `aria-label` en navegación (`<nav>`)
- [ ] `aria-current="page"` en enlace activo
- [ ] `aria-labelledby` en secciones
- [ ] `alt` descriptivo en todas las imágenes
- [ ] `role="list"` y `role="listitem"` en listas semánticas
- [ ] `aria-pressed` en botones toggle (chips/filtros)
- [ ] `aria-live="polite"` en regiones dinámicas
- [ ] `aria-expanded` en menús desplegables
- [ ] `aria-hidden="true"` en iconos decorativos
- [ ] Contraste de colores suficiente (WCAG AA)
- [ ] Navegación completa por teclado
- [ ] Focus visible en elementos interactivos

### Ejemplos ARIA

```html
<!-- Navegación -->
<nav class="navbar" aria-label="Navegación principal">
  <a href="index.html" aria-current="page">Inicio</a>
</nav>

<!-- Sección con título -->
<section class="section" aria-labelledby="senderos-title">
  <h2 id="senderos-title">Senderos destacados</h2>
</section>

<!-- Lista de cards -->
<ul class="cards-grid" role="list" aria-label="Lista de senderos">
  <li class="card" role="listitem">...</li>
</ul>

<!-- Carrusel -->
<div class="carousel" role="region" aria-label="Carrusel de eventos" aria-roledescription="carousel">
  <button class="carousel__btn" aria-label="Evento anterior">‹</button>
  <div class="carousel__track" role="group" aria-roledescription="slide">...</div>
  <button class="carousel__btn" aria-label="Evento siguiente">›</button>
</div>

<!-- Filtros -->
<button class="chip" aria-pressed="true">Todas</button>
<button class="chip" aria-pressed="false">Senderismo</button>

<!-- Formulario -->
<label for="nombre">Nombre</label>
<input type="text" id="nombre" required aria-describedby="nombre-hint">
<p id="nombre-hint" class="visually-hidden">Ingresa tu nombre completo</p>
```

---

## 🔀 Flujo de Trabajo con Git

### Ramas

```
main (producción)
── feat/home (Matias)
├── feat/rutas (Annan)
├── feat/contacto (Tomas)
├── feat/nosotros (Catalina)
└── feat/integracion (Miguel)
```

### Convención de Commits

```
feat: agregar nueva funcionalidad
fix: corregir bug
style: ajustar estilos
docs: actualizar documentación
refactor: reorganizar código
test: agregar pruebas
chore: tareas de mantenimiento
```

**Ejemplos**:

```bash
feat: agregar sección hero de homepage
feat: crear buscador de rutas con filtros
style: ajustar colores de botones según guía
fix: corregir formulario responsive en móvil
docs: actualizar README con instrucciones
refactor: reorganizar variables CSS en global.css
chore: actualizar dependencias
```

### Proceso de Integración

1. Trabajar en rama feature propia
2. Hacer commits claros y atómicos
3. Probar localmente antes de pushear
4. Crear Pull Request a `main`
5. Revisión de código por otro integrante
6. Merge solo si pasa checklist de calidad

---

## ✅ Checklist de Calidad

### Antes de hacer commit:

- [ ] HTML válido y semántico
- [ ] CSS usa variables de `global.css`
- [ ] Responsive en móvil (< 768px)
- [ ] Responsive en tablet (768-1024px)
- [ ] Responsive en desktop (> 1024px)
- [ ] Imágenes tienen `alt` descriptivo
- [ ] Enlaces funcionan correctamente
- [ ] Navegación entre páginas funciona
- [ ] Colores siguen paleta ECORUTAS
- [ ] Tipografía es consistente
- [ ] No hay errores en consola
- [ ] No hay bordes de debugging
- [ ] No hay colores hardcoded

### Checklist de integración:

- [ ] Todas las páginas usan misma navbar
- [ ] Todas las páginas usan mismo footer
- [ ] Botones tienen estilo consistente
- [ ] Espaciado es uniforme
- [ ] Sitio funciona sin JavaScript
- [ ] Accesibilidad básica implementada
- [ ] Estructura de carpetas coincide con documentación

---

## 🚫 Reglas Estrictas

1. **NO** trabajar directamente en `main`
2. **NO** crear colores nuevos sin avisar al equipo
3. **NO** modificar archivos de otros módulos sin coordinación
4. **NO** usar `!important` a menos que sea absolutamente necesario
5. **NO** hardcoded de colores (usar variables)
6. **NO** ignorar el responsive design
7. **NO** commits sin descripción clara
8. **NO** usar `max-width` en media queries (usar `min-width`)
9. **NO** dejar `height` fijo en contenedores (usar `min-height`)
10. **NO** usar `border: 1px solid black` (bordes de debugging)
11. **NO** usar `font-family` que no sea Inter o Arial
12. **NO** olvidar el skip link en HTML
13. **NO** dejar imágenes sin `alt`
14. **NO** usar `<div>` cuando exista etiqueta semántica

---

## 🤖 Instrucciones para Agentes AI

Si estás desarrollar este proyecto:

1. **Lee este archivo primero** antes de generar código
2. **Usa las variables CSS** de `global.css`, no colores hardcoded
3. **Sigue Mobile First**: empieza con estilos móviles, luego tablet y desktop
4. **Mantén consistencia**: usa la misma nomenclatura BEM en todos los archivos
5. **Accesibilidad**: incluye ARIA labels, roles y alt text
6. **No rompas la integración**: verifica que los cambios no afecten otras páginas
7. **Comentarios en español**: el proyecto está en español
8. **Prueba responsive**: siempre verifica los 3 breakpoints
9. **Usa ejemplos de este archivo** como referencia de calidad

### Ejemplo de Componente Correcto

```html
<!-- HTML -->
<section class="section section--destacados" aria-labelledby="destacados-title">
  <div class="container">
    <h2 id="destacados-title" class="section__title">Rutas Destacadas</h2>
    <div class="cards-grid" role="list" aria-label="Lista de rutas destacadas">
      <article class="card" role="listitem" tabindex="0">
        <h3 class="card__title">Sendero del Bosque</h3>
        <p class="card__description">Ruta de 5km entre árboles nativos</p>
        <a href="#" class="card__link" aria-label="Ver detalles de Sendero del Bosque">Ver más</a>
      </article>
    </div>
  </div>
</section>
```

```css
/* CSS - Mobile First */
.section {
  padding: 2rem 1rem;
  background: var(--white);
}

.section__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--green-dark);
  margin-bottom: 1.5rem;
}

.cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.card {
  background: var(--white);
  border: 2px solid var(--gray-light);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(46, 125, 50, 0.15);
}

.card__title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--green-dark);
  margin-bottom: 0.5rem;
}

.card__description {
  font-size: 0.9375rem;
  color: var(--text);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.card__link {
  display: inline-block;
  color: var(--green-primary);
  font-weight: 600;
  text-decoration: none;
}

.card__link:hover {
  color: var(--green-dark);
}

/* Tablet */
@media (min-width: 768px) {
  .section {
    padding: 3rem 2rem;
  }
  
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## 📞 Contacto y Coordinación

- **Reuniones de sincronización**: Definir frecuencia con el equipo
- **Revisión de PR**: Mínimo 1 aprobación antes de merge
- **Conflictos de merge**: Coordinar con Miguel (integración)
- **Dudas de diseño**: Consultar la paleta y variables en este archivo

---

