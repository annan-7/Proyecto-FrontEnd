export const roles = new Map();
roles.set("Fundador & Coordinador de ECORUTA", 1);
roles.set("Especialista en Rutas y cartografía", 1);
roles.set("Coordinador de counidad y contacto", 1);
roles.set("Directora de contenido y storytelling", 1);
roles.set("Diseñador UX/UI y desarrollo de Frontend", 1);
export function filtrarEquipoPorRol(miembros, rol) {
    return miembros.filter(miembro => miembro.rol.toLowerCase() === rol.toLowerCase());
}
export function contarMiembrosPorRol(miembros) {
    const conteoRoles = {};
    miembros.forEach(miembro => {
        const rol = miembro.rol;
        if (conteoRoles[rol]) {
            conteoRoles[rol]++;
        }
        else {
            conteoRoles[rol] = 1;
        }
    });
    return conteoRoles;
}
