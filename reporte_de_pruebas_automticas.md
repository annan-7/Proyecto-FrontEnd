# Reporte de Pruebas Automaticas - Proyecto Frontend

**Fecha:** 25 de septiembre de 2026  
**Evaluador:** Tomas Ignacio Mardones Aguilera  
**Paginas Evaluadas:** Inicio (`index.html`), Contacto (`contacto.html`), Rutas (`rutas.html`) y Sobre nosotros (`sobre_nosotros.html`).  

Se ejecutaron pruebas de accesibilidad y rendimiento a las 4 paginas funcionales del sitio utilizando **axe DevTools**, **Lighthouse** y **WAVE**. A continuación, se detallan los hallazgos y resultados obtenidos en cada una de ellas.

---

## 1. Inicio (`index.html`)

### Axe DevTools
* **Descripción:** axe no detectó errores de accesibilidad en `index.html`.
* **Impacto:** No hay impacto.
* **Severidad:** Baja.
* **Evidencia:**  
  ![Resultados Axe DevTools - Index](https://annan-7.github.io/Proyecto-FrontEnd/index.html) *(Total de incidencias: 0)*

### Pruebas de Lighthouse (Modo Mobile)
| Métrica | Puntuación |
| :--- | :--- |
| **Rendimiento** | 68 / 100 |
| **Accesibilidad** | 98 / 100 |
| **Buenas Prácticas** | 96 / 100 |
| **SEO** | 91 / 100 |

* **Observaciones:** Presenta un *Total Blocking Time* (TBT) de 1,090 ms, indicando la presencia de scripts o tareas pesadas en el hilo principal ejecutándose al cargar la página. En contraste, la estabilidad visual es perfecta con un CLS de 0.

### WAVE
* Detectó 3 enlaces redundantes en la sección de senderos destacados (enlaces que redirigen al mismo lugar en vez de a la ruta seleccionada).

---

## 2. Rutas (`rutas.html`)

### Axe DevTools
* **Descripción:** axe detectó 3 errores de contraste de color en `rutas.html`.
* **Impacto:** Contraste insuficiente de colores en `route-card` y en el pie de página (`footer`).
* **Severidad:** Grave.
* **Detalle del error:**
  ```html
  <!-- Elemento 1: Badge de dificultad -->
  <span class="route-card__badge route-card__badge--medium">Media</span>
  <!-- Contraste de 2.7. Esperado: 4.5:1 -->

  <!-- Elemento 2: Texto del footer -->
  <p>© 2026 Descubre la Naturaleza. Todos los derechos reservados.</p>
  <!-- Contraste de 2.84. Esperado: 4.5:1 -->
  ```
* **Recomendación:** Corregir la paleta de colores de los elementos señalados para cumplir con la ratio WCAG 2.1 AA.

### Pruebas de Lighthouse (Modo Mobile)
| Métrica | Puntuación |
| :--- | :--- |
| **Rendimiento** | 67 / 100 |
| **Accesibilidad** | 97 / 100 |
| **Buenas Prácticas** | 100 / 100 |
| **SEO** | 100 / 100 |

* **Observaciones:** El rendimiento disminuyó 1 punto en comparación con Inicio, pero se alcanzó el 100/100 en SEO y Buenas Prácticas.
* **Recomendación:** Optimizar el uso de la caché del navegador y mejorar la entrega e hiperoptimización de imágenes.

### WAVE
* Detectó los mismos errores de contraste identificados por axe (especialmente en los colores de fondo).
* Detectó hasta 6 enlaces redundantes que dirigen a la página de error `404.html`.

---

## 3. Contacto (`contacto.html`)

### Axe DevTools
* **Descripción:** axe no detectó errores de accesibilidad en `contacto.html`.
* **Impacto:** No hay impacto.
* **Severidad:** Baja.
* **Recomendación:** Ninguna, la página no presenta inconsistencias por el momento.

### Pruebas de Lighthouse (Modo Mobile)
| Métrica | Puntuación |
| :--- | :--- |
| **Rendimiento** | 92 / 100 |
| **Accesibilidad** | 100 / 100 |
| **Buenas Prácticas** | 100 / 100 |
| **SEO** | 90 / 100 |

* **Observaciones:** Destaca el incremento del rendimiento a 92 y accesibilidad al 100%. Buenas prácticas se mantiene perfecto, mientras que SEO bajó a 90/100.
* **Recomendación:** Optimizar el almacenamiento en caché y eliminar o reducir el JavaScript no utilizado.

### WAVE
* Detectó 1 enlace redundante.
* **Inconsistencia de estructura:** Falta un encabezado de primer nivel (`<h1>`), elemento fundamental para la jerarquía del documento.

---

## 4. Sobre Nosotros (`sobre_nosotros.html`)

### Axe DevTools
* **Descripción:** axe detectó 1 error de contraste de color en la página.
* **Impacto:** El elemento del footer presenta baja legibilidad en condiciones normales de visualización.
* **Severidad:** Grave.
* **Detalle del error:**
  ```html
  <footer>
    <p>© 2026 Descubre la Naturaleza. Todos los derechos reservados.</p>
  </footer>
  <!-- Contraste de 2.84. Esperado: 4.5:1 -->
  ```
* **Recomendación:** Corregir el contraste de color en el texto del `footer`.

### Pruebas de Lighthouse (Modo Mobile)
| Métrica | Puntuación |
| :--- | :--- |
| **Rendimiento** | 68 / 100 |
| **Accesibilidad** | 96 / 100 |
| **Buenas Prácticas** | 96 / 100 |
| **SEO** | 100 / 100 |

* **Observaciones:** El rendimiento vuelve a situarse en 68, registrando un bloqueo del hilo principal (*TBT*) de 1,580 ms.
* **Recomendación:** Mejorar las políticas de caché (ahorro estimado de 3 KiB) y aplicar optimizaciones para reducir las tareas pesadas al cargar la página.

### WAVE
* Confirmó el problema de contraste en el texto del pie de página (`footer`).
* Registra el botón de inicio como redundante al enlazar con `index.html`.