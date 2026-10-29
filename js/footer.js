document.addEventListener("DOMContentLoaded", () => {
    const contfooter = document.getElementById("contenedor-footer");

    if (contfooter) {
        const Subcarpeta = window.location.pathname.includes("/paginas/");
        const rutafooter = Subcarpeta ? "../paginas/footer.html" : "./paginas/footer.html";
        
        fetch(rutafooter)
            .then(respuesta => respuesta.text())
            .then(html => {
                contfooter.innerHTML = html;

                if (Subcarpeta) {
                    contfooter.querySelectorAll("a").forEach(link => {
                        const href = link.getAttribute("href");
                        
                        if (href && !href.startsWith("http") && !href.startsWith("#")) {
                            link.setAttribute("href", "../" + href);
                        }
                    });
                }
            })
            .catch(error => console.error("Error al cargar el footer:", error));
    }
});