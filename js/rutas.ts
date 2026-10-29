interface IRuta {
  id: number;
  nombre: string;
  ubicacion: string;
  distancia: number;
  duracion: string;
  dificultad: string;
  tipo: string;
  descripcion: string;
  imagen: string;
}

// Permite buscar sin distinguir mayúsculas ni tildes.
function normalizarTextoRuta(texto: string): string {
  return texto
    .trim()
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function buscarRutasPorNombre(
  rutas: IRuta[],
  termino: string
): IRuta[] {
  const busqueda = normalizarTextoRuta(termino);

  return rutas.filter((ruta) =>
    normalizarTextoRuta(ruta.nombre).includes(busqueda)
  );
}

function ordenarRutasPorDificultad(rutas: IRuta[]): IRuta[] {
  const niveles: Record<string, number> = {
    easy: 1,
    facil: 1,
    medium: 2,
    media: 2,
    moderada: 2,
    hard: 3,
    dificil: 3,
    alta: 3
  };

  const obtenerNivel = (dificultad: string): number =>
    niveles[normalizarTextoRuta(dificultad)] ?? 4;

  // Ordena una copia para conservar el array original.
  return [...rutas].sort(
    (a, b) =>
      obtenerNivel(a.dificultad) - obtenerNivel(b.dificultad)
  );
}