# Acta de Reunion N.° 5 - MongulEnd (Eco Ruta Temuco)

**Fecha:** 06/10/2026

**Hora:** 13:40 PM - 14:50 PM

**Registrado por:** Matias Espinoza

**Tipo de reunion:** Presencial

---

## Asistencia

**Presentes:**
- Matias Espinoza (Scrum Master)
- Annan John (Developer)
- Miguel Torres (Developer)
- Catalina Ojeda (QA/Tester)

**Ausentes Justificados:**
- Tomas Mardones (Project Owner)

---

## Objetivo de la Reunion

Cierre formal del Sprint 1, revision de entregables pendientes para la defensa del 08/10, y planificacion inicial del Sprint 2 con rotacion de roles agiles.

---

## 1. Revision de Cierre Sprint 1

### Entregables Verificados

| Entregable | Estado | Responsable | Observaciones |
|------------|--------|-------------|---------------|
| HTML semantico (5 paginas) | Completado | Todo el equipo | Un solo h1 y main por pagina verificado |
| CSS Mobile First + Variables | Completado | Todo el equipo | Paleta ECORUTAS aplicada consistentemente |
| Despliegue GitHub Pages | Completado | Miguel | URL activa y workflow de Actions funcionando |
| Reporte Bug Bounty PDF | Completado | Catalina | Ubicado en documentos/reportes/ |
| Actas de reunion (4) | Completado | Matias | Subidas a documentos/ |
| Tablero Trello | Completado | Matias | Issues de accesibilidad registrados como tareas |
| AGENT.md | Completado | Equipo | Guia de desarrollo creada |
| README.md | Pendiente | Tomas | Falta actualizar con URL final de GitHub Pages |

### Score de Accesibilidad Final

- Lighthouse Accesibilidad promedio: 92/100
- Issues totales detectados: 18
- Issues corregidos: 13 (5 Altas, 6 Medias, 2 Bajas)
- Issues pendientes: 5 (3 Medias, 2 Bajas)

---

## 2. Planificacion Sprint 2

### Rotacion de Roles Agiles

Segun lo acordado en la guia del curso, los roles rotan para el Sprint 2:

| Rol | Sprint 1 | Sprint 2 |
|-----|----------|----------|
| Scrum Master | Matias Espinoza | Annan John |
| Project Owner | Tomas Mardones | Matias Espinoza |
| Developer | Annan John | Tomas Mardones |
| Developer | Miguel Torres | Miguel Torres |
| QA/Tester | Catalina Ojeda | Catalina Ojeda |

### Objetivo RA2 del Sprint 2

JavaScript moderno, asincronia y TypeScript. El equipo debe migrar las funcionalidades estaticas actuales a una experiencia interactiva con validaciones, busqueda dinamica y tipado fuerte.

### Funcionalidades Planificadas por Modulo

**Annan John (Buscador de Rutas):**
- Implementacion de busqueda en tiempo real con debounce
- Filtros dinamicos funcionales (dificultad, distancia, duracion)
- Carga de rutas desde archivo JSON simulando API
- Migracion a TypeScript con interfaces para objetos de ruta

**Tomas Mardones (Contacto):**
- Validacion de formulario con JavaScript y expresiones regulares
- Mensajes de error accesibles con aria-live
- Simulacion de envio con async/await
- Feedback visual de campos validos/invalidos

**Matias Espinoza (Home):**
- Carrusel funcional con JavaScript (auto-play y controles manuales)
- Controles de teclado para navegacion del carrusel
- Indicadores de slide activo sincronizados con ARIA
- Animaciones de entrada con Intersection Observer

**Miguel Torres (Integracion):**
- Menu hamburguesa interactivo con transiciones
- Cerrar menu al hacer click en enlace
- Configuracion de TypeScript (tsconfig.json)
- Migracion de main.js a main.ts con tipos basicos

**Catalina Ojeda (QA + Nosotros):**
- Pruebas unitarias basicas con funciones puras
- Validacion de accesibilidad en componentes dinamicos
- Animaciones de scroll en seccion de equipo
- Filtros de equipo por rol

---

## 3. Compromisos y Mejoras para Sprint 2

### Compromisos del Equipo

1. Resolver los 5 issues de accesibilidad pendientes durante la primera semana del Sprint 2 antes de iniciar nuevas funcionalidades.
2. Mantener score de Lighthouse Accesibilidad sobre 90/100 en cada iteracion.
3. Documentar funciones y componentes con JSDoc para facilitar la migracion a TypeScript.
4. Realizar code reviews cruzados antes de cada merge a main.
5. Actualizar AGENT.md con las nuevas convenciones de TypeScript.

### Mejoras de Proceso

- Implementar revision de Pull Requests obligatoria (minimo 1 aprobacion).
- Establecer estandares de cobertura para funciones criticas.
- Usar ramas feat/ para cada funcionalidad nueva siguiendo convencion de commits.
- Reuniones de sincronizacion cortas de 15 minutos al inicio de cada sesion de trabajo.

---

## 4. Problemas Identificados

1. **Curva de aprendizaje TypeScript:** Ningun integrante del equipo tiene experiencia previa con TypeScript. Se requiere tiempo de investigacion antes de la implementacion.
2. **Compatibilidad con GitHub Pages:** El despliegue actual es estatico. Se debe evaluar si se necesita un proceso de build para compilar TypeScript a JavaScript.
3. **Tiempo limitado:** El Sprint 2 abarca 4 semanas (8 a 11) con funcionalidades complejas. Se priorizaran las funcionalidades criticas primero.
4. **Mantenimiento de accesibilidad:** Los componentes dinamicos generados con JavaScript deben mantener los atributos ARIA correctos.

---

## 5. Resoluciones y Acuerdos

1. **Cierre administrativo Sprint 1:**
   - Tomas actualizara el README.md con URL final antes del viernes 19/09.
   - Catalina verificara que el reporte Bug Bounty este correctamente vinculado en el repositorio.
   - Matias preparara las diapositivas de presentacion para la defensa del 24/09.

2. **Defensa Sprint 1 (06/10):**
   - Presentadores principales: Matias (Scrum Master) y Catalina (QA).
   - Duracion maxima: 15 minutos.
   - Incluir demo en vivo del sitio desplegado con navegacion por teclado.
   - Mostrar comparativa wireframe vs prototipo y resultados de auditoria.

3. **Inicio Sprint 2:**
   - Miguel configurara el entorno TypeScript el lunes 28/09.
   - Cada integrante investigara TypeScript basico durante la semana de receso.
   - Primera reunion de planificacion Sprint 2: miercoles 13/10 a las 12:40 PM.

4. **Coevaluacion:**
   - Cada integrante completara la coevaluacion individual antes del jueves 08/10.
   - Escala 1 a 7, solo enteros, solo compañeros (no autoevaluacion).

---

## 6. Tareas Asignadas

| Tarea | Responsable | Deadline | Prioridad |
|-------|-------------|----------|-----------|
| Actualizar README.md con URL final | Tomas | 19/09 | Media |
| Corregir 5 issues de accesibilidad pendientes | Todo el equipo | 22/09 | Alta |
| Crear diapositivas de presentacion | Matias + Catalina | 22/09 | Alta |
| Ensayo general de presentacion | Todo el equipo | 23/09 19:00 | Alta |
| Completar coevaluacion individual | Cada integrante | 22/09 | Alta |
| Configurar entorno TypeScript | Miguel | 28/09 | Alta |
| Investigar TypeScript basico | Todo el equipo | 28/09 | Media |
| Merge ramas feat/* a main | Cada integrante | 17/09 23:59 | Alta |

---

## 7. Proxima Reunion

**Fecha:** 13/10/2026

**Hora:** 19:00 PM - 20:30 PM

**Tipo:** En linea / Discord

**Objetivo:** Registro de progreso inicial en el Sprint 2.

---

**Registrado por:** Matias Espinoza (Scrum Master)

**Revisado por:** Tomas Mardones (Project Owner)

**Fecha de registro:** 06/10/2026