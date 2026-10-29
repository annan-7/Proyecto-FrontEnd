const nav = document.querySelector("#nav") as HTMLElement | null;
const abrir = document.querySelector("#abrir") as HTMLElement | null;
const cerrar = document.querySelector("#cerrar") as HTMLElement | null;

abrir?.addEventListener("click", () => {
    nav?.classList.add("visible");
});

cerrar?.addEventListener("click", () => {
    nav?.classList.remove("visible");
});