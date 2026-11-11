import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import vm from 'node:vm';
const pages = ['index.html', 'paginas/rutas.html', 'paginas/contacto.html', 'paginas/sobre_nosotros.html', 'paginas/404.html'];
for (const page of pages) {
 test(`${page}: recursos, enlaces, idioma y estructura`, () => {
  const html = readFileSync(page, 'utf8');
  assert.match(html, /<html lang="es">/);
  assert.equal((html.match(/<main\b/g) || []).length, 1);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length, 'IDs únicos');
  for (const [, attr, url] of html.matchAll(/\b(src|href)="([^"]+)"/g)) {
   if (/^(https?:|mailto:|tel:|data:)/.test(url)) continue;
   if (url.startsWith('#')) { assert.ok(ids.includes(url.slice(1)), `${page}: ancla ${url}`); continue; }
   assert.ok(existsSync(resolve(dirname(page), url.split(/[?#]/)[0])), `${page}: ${attr} ${url}`);
  }
  for (const [, id] of html.matchAll(/<label[^>]+for="([^"]+)"/g)) assert.ok(ids.includes(id), `label ${id}`);
  assert.ok(html.indexOf('js/theme.js') < html.indexOf('css/global.css'), 'Tema aplicado antes de CSS');
  assert.doesNotMatch(html, /dist\/js/);
 });
}
const css = readFileSync('css/global.css', 'utf8');
const blocks = [css.match(/:root\s*\{([^}]+)\}/)[1], css.match(/\[data-theme="dark"\]\s*\{([^}]+)\}/)[1]];
const luminance = hex => {
 const rgb = hex.slice(1).match(/../g).map(n => parseInt(n, 16) / 255).map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4);
 return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
};
for (const [index, block] of blocks.entries()) {
 test(`Contraste WCAG: tema ${index === 0 ? 'claro' : 'oscuro'}`, () => {
  const tokens = Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/g)].map(m => [m[1], m[2]]));
  const check = (fg, bg, min) => {
   const values = [luminance(tokens[fg]), luminance(tokens[bg])].sort((a,b) => b-a);
   const ratio = (values[0] + .05) / (values[1] + .05);
   assert.ok(ratio >= min, `${fg}/${bg}: ${ratio.toFixed(2)} < ${min}`);
  };
  for (const bg of ['background', 'surface', 'surface-soft']) {
   for (const fg of ['text', 'muted', 'primary', 'error']) check(fg, bg, 4.5);
   for (const fg of ['focus', 'input-border']) check(fg, bg, 3);
  }
  check('on-primary', 'primary', 4.5);
  check('on-primary', 'primary-hover', 4.5);
  for (const level of ['easy','medium','hard']) check(`badge-${level}-text`, `badge-${level}-bg`, 4.5);
 });
}
function themeHarness(stored, dark = false, blocked = false) {
 const listeners = {}, docListeners = {}, mediaListeners = {}, selectListeners = {};
 const select = { value: '', addEventListener: (name, fn) => selectListeners[name] = fn };
 const media = { matches: dark, addEventListener: (name, fn) => mediaListeners[name] = fn };
 const document = { documentElement: { dataset: {} }, querySelector: () => select, addEventListener: (name, fn) => docListeners[name] = fn, dispatchEvent: () => {} };
 const storage = { value: stored, getItem() { if (blocked) throw Error('Blocked'); return this.value; }, setItem(key, val) { if (blocked) throw Error('Blocked'); this.value = val; } };
 vm.runInNewContext(readFileSync('js/theme.js','utf8'), {document, localStorage: storage, matchMedia: () => media, window: {addEventListener: (name, fn) => listeners[name] = fn}, Event: class {} });
 return {document, storage, media, select, listeners, docListeners, mediaListeners, selectListeners};
}
test('Tema persistido se aplica antes de DOMContentLoaded', () => {
 const h = themeHarness('dark');
 assert.equal(h.document.documentElement.dataset.theme, 'dark');
 h.docListeners.DOMContentLoaded();
 assert.equal(h.select.value, 'dark');
 h.selectListeners.change({target:{value:'light'}});
 assert.equal(h.storage.value, 'light');
 assert.equal(h.document.documentElement.dataset.theme, 'light');
});
test('Sistema sigue cambios y almacenamiento bloqueado no rompe el inicio', () => {
 const h = themeHarness(null, true, true);
 assert.equal(h.document.documentElement.dataset.theme, 'dark');
 h.media.matches = false; h.mediaListeners.change();
 assert.equal(h.document.documentElement.dataset.theme, 'light');
 h.docListeners.DOMContentLoaded(); h.selectListeners.change({target:{value:'dark'}});
 assert.equal(h.document.documentElement.dataset.theme, 'dark');
});
test('Preferencias inválidas y sincronización entre pestañas', () => {
 const h = themeHarness('invalid');
 assert.equal(h.document.documentElement.dataset.themePreference, 'system');
 h.listeners.storage({key:'ecorutas-theme',newValue:'dark'});
 assert.equal(h.document.documentElement.dataset.theme, 'dark');
});
