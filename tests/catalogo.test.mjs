import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const source = readFileSync('js/catalogo.js', 'utf8');
const route = id => ({ id, name: 'Ruta', location: 'Chile', distance_km: 5, duration_hours: 2 });
const harness = fetch => {
 const context = vm.createContext({ fetch, AbortSignal });
 vm.runInContext(source, context);
 return () => vm.runInContext('EcoCatalog.load()', context);
};
test('Catálogo pagina, comparte la solicitud y excluye inactivas', async () => {
 const urls = [];
 const load = harness(async url => {
  urls.push(url);
  return { ok: true, json: async () => urls.length === 1
   ? { items: [route('a')], total: 3 }
   : { items: [route('b'), {...route('c'), is_active:false}], total: 3 } };
 });
 const first = load(); assert.equal(first, load());
 assert.equal((await first).length, 2);
 assert.match(urls[1], /skip=1$/);
 assert.equal(urls.length, 2);
});
test('Catálogo permite reintentar después de HTTP fallido', async () => {
 let attempts = 0;
 const load = harness(async () => ++attempts === 1 ? {ok:false,status:503} : {ok:true,json:async()=>({items:[route('a')],total:1})});
 await assert.rejects(load(), /503/);
 assert.equal((await load()).length, 1);
});
test('Catálogo rechaza páginas incompletas y respuestas ajenas a la API', async () => {
 for (const payload of [{items:[],total:10}, {items:[{id:'bad'}],total:1}, {}]) {
  const load = harness(async () => ({ok:true,json:async()=>payload}));
  await assert.rejects(load());
 }
});
