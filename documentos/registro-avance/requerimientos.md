# Documento de Requerimientos 

## 1 Vision General
En este documento se establecen los requerimientos técnicos y funcionales para el desarrollo, se detallan las especificaciones de HTML5, CSS3 y gestion de recursos visuales como imagenes.

---

## 2 Requerimientos HTML

### 2.1 Paginas y archivos 
* **pagina principal:** `index.html`
* **paginas secundarias:** se encuentran en `/paginas`
* **formulario de contacto:** `contacto.html`

### 2.2 Estandares y semantica
* **Doctype y Codificación:** Todos los archivos deben incluir `<!DOCTYPE html>` y la etiqueta `<meta charset="UTF-8">`
* **iseño Adaptativo (Viewport):** Incluir la etiqueta `<meta name="viewport" content="width=device-width, initial-scale=1.0">` en la cabecera (`<head>`).
* **Etiquetas Semánticas:** Uso obligatorio de elementos HTML5 para estructurar el contenido:
  * `<header>` para la barra superior y menú principal.
  * `<nav>` para la navegación.
  * `<main>` para el contenido principal único de cada página.
  * `<section>` y `<article>` para la división de bloques temáticos.
  * `<footer>` para pie de página y enlaces institucionales.
* **Formularios (`contacto.html`):** 
  * Uso de tipos de entrada correctos (`type="email"`, `type="tel"`, `type="submit"`).
  * Atributos `required` en campos obligatorios y enlaces `<label>` asociados a cada `<input>` mediante el atributo `for`.
