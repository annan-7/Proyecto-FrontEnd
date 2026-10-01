document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', async (event) => {
            const urlDestino = link.getAttribute('href');
            if (!urlDestino || urlDestino === '#' || urlDestino.startsWith('http')) {
                return;
            } event.preventDefault();
            try {
                const respuesta = await fetch(urlDestino, { method: 'HEAD' });

                if (respuesta.ok) {
                    window.location.href = urlDestino;
                } else {
                    Pag404();
                }
            } catch (error) {
                Pag404();
            }
        });
    });
});

function Pag404() {
    if (window.location.pathname.includes('/paginas/')) {
        window.location.href = '404.html';
    } else {
        window.location.href = 'paginas/404.html';
    }
}