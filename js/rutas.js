
"use strict";

const API_BASE = "https://ecorutas-api.vercel.app";
const IMAGEN_RESPALDO = "../assets/imagenes/optimized/BosqueNativo-960.webp";

const ETIQUETAS_DIFICULTAD = {
  facil: "Fácil",
  moderada: "Moderada",
  dificil: "Difícil",
  experto: "Experto"
};

const ICONO_UBICACION = '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>';
const ICONO_DISTANCIA = '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>';
const ICONO_TIEMPO = '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';
const ICONO_FLECHA = '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>';

function normalizarTextoRuta(texto) {
  return String(texto ?? "")
    .trim()
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function buscarRutasPorNombre(rutas, termino) {
  const busqueda = normalizarTextoRuta(termino);

  return rutas.filter(ruta =>
    [ruta.name, ruta.location].some(valor =>
      normalizarTextoRuta(valor).includes(busqueda)
    )
  );
}

function ordenarRutasPorDificultad(rutas) {
  const niveles = {
    facil: 1,
    moderada: 2,
    dificil: 3,
    experto: 4
  };

  return [...rutas].sort(
    (a, b) =>
      (niveles[normalizarTextoRuta(a.difficulty)] ?? 5) -
      (niveles[normalizarTextoRuta(b.difficulty)] ?? 5)
  );
}

function elemento(etiqueta, clase, texto) {
  const nodo = document.createElement(etiqueta);

  if (clase) nodo.className = clase;
  if (texto !== undefined) nodo.textContent = texto;

  return nodo;
}

function asignarImagen(img, ruta) {
  img.alt = `Vista de ${ruta.name || "ruta de naturaleza"}`;
  img.loading = "lazy";
  img.width = 400;
  img.height = 250;
  img.src = ruta.image_url || IMAGEN_RESPALDO;

  img.addEventListener("error", () => {
    if (img.dataset.fallback === "1") return;

    img.dataset.fallback = "1";
    img.src = IMAGEN_RESPALDO;
  }, { once: true });
}

function textoNumero(valor, unidad) {
  return typeof valor === "number" && Number.isFinite(valor)
    ? `${new Intl.NumberFormat("es-CL", {
        maximumFractionDigits: 2
      }).format(valor)} ${unidad}`
    : "No disponible";
}

function crearTarjeta(ruta) {
  const li = elemento("li", "route-card");
  li.setAttribute("role", "listitem");
  li.dataset.routeId = ruta.id;

  const article = elemento("article", "route-card__article");
  const wrapper = elemento("div", "route-card__image-wrapper");

  const img = elemento("img", "route-card__image");
  asignarImagen(img, ruta);
  wrapper.append(img);

  const dificultad = normalizarTextoRuta(ruta.difficulty);

  const clase =
    dificultad === "facil" ? "easy" :
    dificultad === "moderada" ? "medium" : "hard";

  wrapper.append(
    elemento(
      "span",
      `route-card__badge route-card__badge--${clase}`,
      ETIQUETAS_DIFICULTAD[dificultad] ||
        ruta.difficulty ||
        "Sin datos"
    )
  );

  const contenido = elemento("div", "route-card__content");

  contenido.append(
    elemento("h3", "route-card__title", ruta.name || "Ruta sin nombre")
  );

  const ubicacion = elemento("p", "route-card__location");

  // SVG estático, no contenido HTML de la API.
  ubicacion.innerHTML = ICONO_UBICACION;
  ubicacion.append(
    document.createTextNode(
      ` ${ruta.location || "Ubicación no disponible"}`
    )
  );

  contenido.append(ubicacion);

  const meta = elemento("div", "route-card__meta");

  for (const [icono, texto] of [
    [ICONO_DISTANCIA, textoNumero(ruta.distance_km, "km")],
    [ICONO_TIEMPO, textoNumero(ruta.duration_hours, "h")]
  ]) {
    const span = elemento("span", "route-card__meta-item");
    span.innerHTML = icono;
    span.append(document.createTextNode(texto));
    meta.append(span);
  }

  contenido.append(meta);

  const boton = elemento(
    "button",
    "route-card__link",
    "Ver detalles "
  );

  boton.type = "button";
  boton.dataset.routeDetails = ruta.id;

  boton.setAttribute(
    "aria-label",
    `Ver detalles de ${ruta.name || "ruta"}`
  );

  boton.insertAdjacentHTML("beforeend", ICONO_FLECHA);

  contenido.append(boton);
  article.append(wrapper, contenido);
  li.append(article);

  return li;
}

function iniciarRutas() {
  const grid = document.querySelector(".routes-grid");

  if (!grid || grid.dataset.initialized === "true") return;

  grid.dataset.initialized = "true";

  const formulario = document.querySelector(".search-form");
  const busqueda = document.querySelector("#search-input");
  const chips = [...document.querySelectorAll(".chip[data-filter]")];
  const dificultad = document.querySelector("#filter-difficulty");
  const distancia = document.querySelector("#filter-distance");

  const salidaDistancia = document.querySelector(
    'output[for="filter-distance"]'
  );

  const duracion = document.querySelector("#filter-duration");
  const contador = document.querySelector("#results-number");
  const vacio = document.querySelector(".results__empty");
  const estado = document.querySelector("#routes-status");
  const dialog = document.querySelector(".route-dialog");
  const detalleTexto = dialog?.querySelector(".route-dialog__text");

  let rutas = [];
  let cargando = null;
  let categoria = "all";

  function estadoCarga(mensaje, error = false) {
    estado.hidden = !mensaje;
    estado.replaceChildren();

    if (!mensaje) return;

    estado.append(elemento("p", "", mensaje));

    if (error) {
      const reintentar = elemento(
        "button",
        "route-card__link",
        "Reintentar"
      );

      reintentar.type = "button";

      reintentar.addEventListener(
        "click",
        cargarRutas,
        { once: true }
      );

      estado.append(reintentar);
    }
  }

  function filtrar() {
    const termino = busqueda.value;
    const nivel = dificultad.value;
    const maxDistancia = Number(distancia.value);
    const maxDuracion = duracion.value;

    const filtradas = buscarRutasPorNombre(rutas, termino).filter(
      ruta => {
        const tipo = normalizarTextoRuta(ruta.route_type);

        const coincideTipo =
          categoria === "all" ||
          tipo === normalizarTextoRuta(categoria);

        const coincideDificultad =
          !nivel ||
          normalizarTextoRuta(ruta.difficulty) === nivel;

        const coincideDistancia =
          ruta.distance_km == null ||
          Number(ruta.distance_km) <= maxDistancia;

        const coincideDuracion =
          !maxDuracion ||
          (
            typeof ruta.duration_hours === "number" &&
            (
              maxDuracion === "24"
                ? ruta.duration_hours > 8
                : ruta.duration_hours <= Number(maxDuracion)
            )
          );

        return (
          coincideTipo &&
          coincideDificultad &&
          coincideDistancia &&
          coincideDuracion
        );
      }
    );

    grid.replaceChildren(...filtradas.map(crearTarjeta));

    contador.textContent = String(filtradas.length);

    vacio.hidden =
      filtradas.length !== 0 || !estado.hidden;
  }

  function limpiar() {
    busqueda.value = "";
    dificultad.value = "";
    distancia.value = distancia.max;
    duracion.value = "";

    salidaDistancia.textContent = `${distancia.value} km`;

    distancia.setAttribute("aria-valuenow", distancia.value);
    distancia.setAttribute(
      "aria-valuetext",
      `${distancia.value} kilómetros`
    );

    categoria = "all";

    chips.forEach(chip => {
      const activo = chip.dataset.filter === "all";

      chip.classList.toggle("chip--active", activo);
      chip.setAttribute("aria-pressed", String(activo));
    });

    filtrar();
  }

  async function cargarRutas() {
    if (cargando) return cargando;

    estadoCarga("Cargando rutas...");
    vacio.hidden = true;
    grid.replaceChildren();
    contador.textContent = "0";

    cargando = (async () => {
      try {
        const respuesta = await fetch(
          `${API_BASE}/api/v1/routes?limit=100`
        );

        if (!respuesta.ok) {
          throw new Error(`HTTP ${respuesta.status}`);
        }

        const datos = await respuesta.json();

        if (!datos || !Array.isArray(datos.items)) {
          throw new Error("Formato de respuesta inválido");
        }

        rutas = datos.items.filter(
          ruta =>
            ruta &&
            typeof ruta.id === "string" &&
            ruta.is_active !== false
        );

        // Ajustar el rango a las distancias reales.
        const distanciaMaxima = Math.max(
          1,
          ...rutas.map(ruta => Number(ruta.distance_km) || 0)
        );

        distancia.min = "0";
        distancia.max = String(Math.ceil(distanciaMaxima));
        distancia.value = distancia.max;

        salidaDistancia.textContent = `${distancia.value} km`;

        distancia.setAttribute("aria-valuemax", distancia.max);
        distancia.setAttribute("aria-valuenow", distancia.value);
        distancia.setAttribute(
          "aria-valuetext",
          `${distancia.value} kilómetros`
        );

        estadoCarga("");
        filtrar();

      } catch (error) {
        console.error("Error al cargar rutas:", error);

        estadoCarga(
          "No pudimos cargar las rutas. Comprueba tu conexión e inténtalo de nuevo.",
          true
        );

      } finally {
        cargando = null;
      }
    })();

    return cargando;
  }

  async function abrirDetalles(id) {
    if (!id) return;

    dialog.querySelector("[data-dialog-title]").textContent =
      "Cargando detalles...";

    dialog.querySelector("[data-dialog-location]").textContent = "";

    for (const atributo of [
      "difficulty",
      "distance",
      "duration"
    ]) {
      dialog.querySelector(
        `[data-dialog-${atributo}]`
      ).textContent = "";
    }

    detalleTexto.textContent =
      "Consultando información de la ruta...";

    dialog.querySelector("[data-dialog-image]").hidden = true;

    if (!dialog.open) dialog.showModal();

    try {
      const respuesta = await fetch(
        `${API_BASE}/api/v1/routes/${encodeURIComponent(id)}`
      );

      if (respuesta.status === 404) {
        throw new Error("404");
      }

      if (!respuesta.ok) {
        throw new Error(`HTTP ${respuesta.status}`);
      }

      const ruta = await respuesta.json();

      if (!dialog.open) return;

      dialog.querySelector("[data-dialog-title]").textContent =
        ruta.name || "Ruta sin nombre";

      dialog.querySelector("[data-dialog-location]").textContent =
        ruta.location || "Ubicación no disponible";

      dialog.querySelector("[data-dialog-difficulty]").textContent =
        ETIQUETAS_DIFICULTAD[
          normalizarTextoRuta(ruta.difficulty)
        ] ||
        ruta.difficulty ||
        "Sin dificultad";

      dialog.querySelector("[data-dialog-distance]").textContent =
        textoNumero(ruta.distance_km, "km");

      dialog.querySelector("[data-dialog-duration]").textContent =
        textoNumero(ruta.duration_hours, "h");

      detalleTexto.textContent = [
        ruta.description,
        ruta.interesting_fact &&
          `Dato interesante: ${ruta.interesting_fact}`
      ].filter(Boolean).join("\n\n") ||
        "No hay descripción disponible.";

      const imagen = dialog.querySelector(
        "[data-dialog-image]"
      );

      imagen.hidden = false;
      asignarImagen(imagen, ruta);

      const mapa = dialog.querySelector(
        "[data-dialog-map]"
      );

      if (mapa) {
        const tieneCoordenadas =
          ruta.latitude != null &&
          ruta.longitude != null;

        mapa.hidden = !tieneCoordenadas;

        if (tieneCoordenadas) {
          mapa.href =
            `https://www.google.com/maps?q=${encodeURIComponent(
              `${ruta.latitude},${ruta.longitude}`
            )}`;
        } else {
          mapa.removeAttribute("href");
        }
      }

    } catch (error) {
      if (!dialog.open) return;

      dialog.querySelector("[data-dialog-title]").textContent =
        "No se pudo mostrar la ruta";

      detalleTexto.textContent =
        error.message === "404"
          ? "Esta ruta no existe o ya no está disponible."
          : "No pudimos obtener los detalles. Inténtalo nuevamente.";
    }
  }

  formulario.addEventListener("submit", event => {
    event.preventDefault();
    filtrar();
  });

  busqueda.addEventListener("input", filtrar);
  dificultad.addEventListener("change", filtrar);
  duracion.addEventListener("change", filtrar);

  distancia.addEventListener("input", () => {
    salidaDistancia.textContent = `${distancia.value} km`;

    distancia.setAttribute("aria-valuenow", distancia.value);
    distancia.setAttribute(
      "aria-valuetext",
      `${distancia.value} kilómetros`
    );

    filtrar();
  });

  chips.forEach(chip =>
    chip.addEventListener("click", () => {
      categoria = chip.dataset.filter;

      chips.forEach(c => {
        const activo = c === chip;

        c.classList.toggle("chip--active", activo);
        c.setAttribute("aria-pressed", String(activo));
      });

      filtrar();
    })
  );

  document.querySelectorAll(
    ".filters__clear, .results__empty-clear"
  ).forEach(boton =>
    boton.addEventListener("click", limpiar)
  );

  grid.addEventListener("click", event => {
    const boton = event.target.closest("[data-route-details]");

    if (boton && grid.contains(boton)) {
      abrirDetalles(boton.dataset.routeDetails);
    }
  });

  dialog.querySelector("[data-dialog-close]")
    .addEventListener("click", () => dialog.close());

  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });

  cargarRutas();
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    iniciarRutas,
    { once: true }
  );
} else {
  iniciarRutas();
}
