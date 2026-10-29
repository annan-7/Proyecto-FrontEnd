const nav = document.querySelector("#nav");
const abrir = document.querySelector("#abrir");
const cerrar = document.querySelector("#cerrar");
abrir?.addEventListener("click", (e) => {
    nav?.classList.add("visible");
});
cerrar?.addEventListener("click", (e) => {
    nav?.classList.remove("visible");
});
export {};
//# sourceMappingURL=menu_hamburguesa.js.map