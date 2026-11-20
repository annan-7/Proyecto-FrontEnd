import { cpSync, mkdirSync, rmSync } from 'node:fs';
// Only these public assets may be served or uploaded to GitHub Pages.
// Backend source, SQLite files, environment files and dependencies stay outside.
const destination = 'dist/site';
rmSync(destination, { recursive: true, force: true });
mkdirSync(destination, { recursive: true });
for (const entry of ['index.html', 'paginas', 'css', 'js', 'assets']) {
  cpSync(entry, `${destination}/${entry}`, { recursive: true });
}
