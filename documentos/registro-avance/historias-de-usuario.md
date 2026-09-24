# Historias de usuario  
* **Curso:** Desarrollo de Frontend
* **Equipo:** MogulEnd  
* **Fecha de actualización:**  24/09/2026  

---

## **1. Introducción y Metodología**  
Cada historia de usuario sigue el formato: *"Como [rol], quiero [funcionalidad], para [beneficio]"*, con criterios de aceptación observables y verificables.  
La priorización sigue el método **MoSCoW**, alineado estrictamente con las restricciones técnicas del  **Sprint 1** (HTML/CSS Vanilla) y los criterios de evaluación de la pauta (Accesibilidad, HTML Semántico, Diseño Responsivo y Progresión Grupal).  

---

## 2. Product Backlog Priorizado  
| | | | | | |  
|-|-|-|-|-|-|  
| **ID** | **Historia de Usuario (Como / Quiero / Para)** | **Criterios de Aceptación (Observables)** | **Prioridad (MoSCoW)** | **Estado** | **Alineación con la Pauta** |   
| **HU-01** | Como **turista**, quiero ver las rutas disponibles con su nivel de dificultad, para elegir una acorde a mi condición física. | 1. Se listan las rutas en rutas.html. 2. Cada tarjeta muestra badge de dificultad (Fácil/Media/Difícil). 3. El texto es legible y contrasta con el fondo. | **Must Have** | Listo | RA1: HTML Semántico, Diseño Responsivo |  
| **HU-02** | Como **turista que viaja ligero**, quiero una página accesible desde mi teléfono celular, para revisar la información cómodamente sin deformaciones. | 1. El layout se adapta a viewport de 320px (Mobile First). 2. Los botones y filtros son táctiles (mínimo 44x44px). 3. No hay scroll horizontal no intencional. | **Must Have** | Listo | RA1: Diseño Responsivo |   
| **HU-03** | Como **persona no vidente**, quiero una plataforma adaptada con lector de pantalla, para navegar de forma autónoma. | 1. Todas las imágenes tienen atributo alt descriptivo. 2. Uso de etiquetas semánticas (<nav>, <main>, <article>). 3. Controles de formulario y filtros tienen aria-label o aria-describedby. | **Must Have** | En progreso | RA1: Accesibilidad |   
| **HU-04** | Como **asesor de turismo**, quiero que la página muestre cómo llegar al destino con confianza, para que los turistas no se pierdan. | 1. Cada tarjeta de ruta incluye ubicación clara (ej. "Valle Central, Chile"). 2. La página de detalle (futuro) o tarjeta incluye instrucciones textuales de acceso. | **Must Have** | Por hacer | RA1: Arquitectura escalable |   
| **HU-05** | Como **padre de familia**, quiero conocer el rango etario recomendado de la ruta, para asegurar que mis hijos puedan realizar la actividad de forma segura. | 1. La tarjeta de ruta incluye un metadato de "Edad recomendada" o "Apto para niños". 2. Esta información es visible sin hacer clic en la tarjeta. | **Should Have** | Por hacer | RA2: Gestión de datos |   
| **HU-06** | Como **turista**, quiero filtrar las rutas por dificultad, distancia y duración, para encontrar rápidamente la opción que mejor se adapta a mi tiempo y capacidad. | 1. Filtros por "chips" (categoría) funcionan sin recargar la página. 2. Filtros avanzados (rango de km, select de horas) actualizan la vista en tiempo real. 3. Botón "Limpiar filtros" restablece la vista. | **Should Have** | En progreso | RA2: JS Moderno, Gestión de estado |   
| **HU-07** | Como **turista**, quiero ver opiniones o reseñas de otros visitantes en la ficha de la ruta, para decidir si es adecuada para mi grupo. | 1. (Fase 1): Maquetación estática de una sección de "Reseñas" en la ficha de detalle. 2. (Fase 2): Sistema de valoración con estrellas (mock o API). | **Should Have** | Por hacer | RA2: Componentización / APIs |   
| **HU-08** | Como **analista de prevención de riesgos**, quiero que se muestre el estado de seguridad y clima de la ruta, para evitar enviar turistas a zonas peligrosas. | 1. (Fase 1): Badge visual estático en la tarjeta (ej. " Consultar clima antes de ir"). 2. (Fase 2): Integración con API del clima para mostrar estado en tiempo real y deshabilitar rutas no seguras. | **Could Have** | Por hacer | RA2: Consumo de APIs Externas |   
| **HU-09** | Como **diseñador gráfico**, quiero una presentación temática con paleta de colores y tipografía que transmita tranquilidad y naturaleza. | 1. Uso de colores inspirados en la Araucanía (verdes, tierras, azules). 2. Tipografía legible y espaciado (whitespace) que evoque calma. 3. Imágenes de alta calidad en formato .webp. | **Could Have** | Listo | RA1: Diseño de Interfaz |   

---

## 3. Definición de "Listo" (DoD)  
Para que una Historia de Usuario se considere **Terminada** y sea cerrada en el tablero Trello, debe cumplir los siguientes puntos:  
1. El código está fusionado en la rama main mediante un Pull Request aprobado.  
2. El código pasó por revisión del intgrante con el rol **QA/Tester**.  
3. Cumple con los estándares de accesibilidad.  
4. Es completamente responsiva (probada en vista móvil y escritorio).  
5. Los commits siguen la convención: feat:, fix:, refactor:, docs:.  

---

## Sprint 1 (Actual: HTML/CSS - Semanas 5-7)
* **Enfoque:** Prototipo funcional, semántico, responsivo y accesible.
* **Historias:** HU-01,02,03,04,09. Estan en progreso o terminados.
* **Entregable clave:** Páginas estáticas (`index.html`, `rutas.html`, `contacto.html`, `404.html`) con filtros básicos en JS Vanilla ya implementados.

