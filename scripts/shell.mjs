import { readFileSync, writeFileSync } from 'node:fs';
const pages = ['index.html', 'paginas/rutas.html', 'paginas/contacto.html', 'paginas/sobre_nosotros.html', 'paginas/404.html'];
const links = [['index.html', 'Inicio'], ['paginas/rutas.html', 'Rutas'], ['paginas/sobre_nosotros.html', 'Sobre nosotros'], ['paginas/contacto.html', 'Contacto']];
const mark = '<svg aria-hidden="true" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 25 13 7l6 10 4-6 6 14H3Z"/><path d="m10 13 3 3 3-3M17 25l4-5"/></svg>';
for (const page of pages) {
 const prefix = page.startsWith('paginas/') ? '../' : './';
 const navLinks = links.map(([href, label]) => `<li><a href="${prefix}${href}"${page === href ? ' aria-current="page"' : ''}>${label}</a></li>`).join('\n');
 const header = `<header class="site-header"><nav class="navbar container" aria-label="Navegación principal">
 <a class="navbar__logo" href="${prefix}index.html" aria-label="EcoRutas, inicio">${mark}<span>EcoRutas</span></a>
 <button type="button" class="menu" aria-expanded="false" aria-controls="nav" id="abrir"><span class="menu-label">Menú</span><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>
 <ul class="navbar__links" id="nav">${navLinks}</ul>
 <label class="theme-control"><span class="visually-hidden">Tema de color</span><select id="theme-select" aria-label="Tema de color"><option value="system">Sistema</option><option value="light">Claro</option><option value="dark">Oscuro</option></select></label>
 </nav></header>`;
 const footer = `<footer class="site-footer"><div class="container footer-grid"><div><a class="navbar__logo" href="${prefix}index.html">${mark}<span>EcoRutas</span></a><p>Explora con calma. Cuida lo que descubres.</p><p class="footer-location">Desde La Araucanía, Chile.</p></div><nav aria-label="Navegación secundaria"><ul>${navLinks}</ul></nav></div><div class="container footer-bottom"><span>© ${new Date().getFullYear()} EcoRutas</span><span>Turismo de naturaleza responsable</span></div></footer>`;
 let html = readFileSync(page, 'utf8');
 html = html.replace(/<!-- site-header -->[\s\S]*?<!-- \/site-header -->/, `<!-- site-header -->\n${header}\n<!-- /site-header -->`);
 html = html.replace(/<!-- site-footer -->[\s\S]*?<!-- \/site-footer -->/, `<!-- site-footer -->\n${footer}\n<!-- /site-footer -->`);
 writeFileSync(page, html);
 if (page === "paginas/404.html") writeFileSync("paginas/footer.html", `<link rel="stylesheet" href="../css/global.css">\n${footer}\n`);
}
