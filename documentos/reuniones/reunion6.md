# Acta de Reunion N.° 6 - MongulEnd (Eco Ruta Temuco)

**Fecha:** 05/11/2026

**Hora:** 12:40 PM - 14:00 PM

**Registrado por:** Annan John (Scrum Master Sprint 2)

**Tipo de reunion:** Presencial / Sala de clases

---

## Asistencia

**Presentes:**
- Annan John (Scrum Master)
- Matias Espinoza (Project Owner)
- Tomas Mardones (Developer)
- Miguel Torres (Developer)
- Catalina Ojeda (QA/Tester)

**Ausentes:**
- Ninguno

---

## Objetivo de la Reunion

Revisar el avance de la migracion de modulos a TypeScript, realizar el Code Review formal entre pares segun la pauta del curso, debatir sobre errores de tipado encontrados y preparar el cierre del Sprint 2.

---

## Descripcion de Avances por Miembro del Equipo

### Annan John (Scrum Master / Developer)
- Finalizo la migracion del modulo de busqueda de rutas a TypeScript, definiendo las interfaces `IRuta` y `IFiltros`.
- Implemento la funcion de `debounce` en el buscador en tiempo real para optimizar el rendimiento.
- Coordino la sesion de Code Review formal, asegurando que todos los integrantes utilizaran la pauta proporcionada por el curso.

### Matias Espinoza (Project Owner / Developer)
- Valido que las funcionalidades de JavaScript y TypeScript implementadas cumplan con las historias de usuario del Sprint 2.
- Migro la logica del carrusel de eventos a TypeScript, asegurando que la generacion dinamica de slides mantenga los atributos ARIA correctos.
- Actualizo el tablero de Trello moviendo las tareas de desarrollo a la columna "En Revision".

### Tomas Mardones (Developer)
- Migro la validacion del formulario de contacto a TypeScript, creando la interfaz `IFormData` para tipar los campos.
- Implemento mensajes de error dinamicos utilizando `aria-live` y `aria-invalid` para garantizar la accesibilidad en validaciones asincronas.
- Simulo el envio del formulario utilizando `async/await`, manejando correctamente los estados de carga y error.

### Miguel Torres (Developer)
- Finalizo la configuracion del archivo `tsconfig.json` y ajusto el workflow de GitHub Actions para compilar TypeScript a JavaScript antes del despliegue.
- Migro el archivo `main.js` a `main.ts`, agregando tipos a las funciones globales y al manejo del menu hamburguesa.
- Resolvio conflictos de compilacion derivados del modo estricto de TypeScript, ajustando la configuracion para permitir una migracion progresiva.

### Catalina Ojeda (QA/Tester)
- Ejecuto pruebas de regresion de accesibilidad sobre los componentes dinamicos (carrusel, buscador, formulario) usando NVDA y navegacion por teclado.
- Migro los filtros de la seccion de equipo en la pagina "Nosotros" a TypeScript.
- Documenta los bugs de tipado encontrados durante el Code Review y genera el registro formal de la revision entre pares.

---

## Problemas Identificados y Soluciones

**Problema 1: Errores de compilacion en modo estricto**
- *Descripcion:* Al activar `"strict": true` en `tsconfig.json`, surgieron mas de 40 errores de tipado en el codigo JavaScript existente.
- *Solucion:* Se acordo cambiar temporalmente a `"strict": false` y habilitar reglas especificas (`noImplicitAny`, `strictNullChecks`) de forma incremental para no bloquear el avance.

**Problema 2: Regresion de accesibilidad en componentes dinamicos**
- *Descripcion:* Al renderizar las tarjetas de rutas dinamicamente con JavaScript, se perdian los `aria-label` y el foco del teclado.
- *Solucion:* Tomas y Catalina implementaron una funcion helper en TypeScript que inyecta los atributos ARIA correctamente al crear los elementos del DOM.

---

## Resoluciones y Acuerdos

1. **Cierre de migracion TypeScript:** Todos los modulos criticos (buscador, formulario, carrusel, menu) deben estar compilando sin errores antes del viernes 07/11.
2. **Registro de Code Review:** Catalina subira el documento PDF con las pautas de Code Review firmadas por todos a la carpeta `documentos/reportes/`.
3. **Preparacion Sprint Review 2:** Matias y Annan prepararan la demo para el "cliente" simulado, enfocandose en la interactividad y el consumo de datos.
4. **Rotacion de roles:** Se confirma que para el Sprint 3, Catalina sera Scrum Master y Tomas Product Owner.

---

## Proxima Reunion

**Fecha:** 12/11/2026 (Semana 12 - Sprint Review 2)

**Hora:** 2:30 PM - 3:00 PM

**Tipo:** Presencial / Sala de clases

**Objetivo:** Demo ante el cliente, retrospectiva y Control RA2.

---

