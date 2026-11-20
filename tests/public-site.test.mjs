import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readdirSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

test('Publicación excluye backend, configuración privada y restos de builds anteriores', () => {
 const directory = mkdtempSync(join(tmpdir(), 'ecorutas-public-'));
 try {
  for (const name of ['paginas', 'css', 'js', 'assets', 'backend', 'dist/site']) mkdirSync(join(directory, name), { recursive: true });
  writeFileSync(join(directory, 'index.html'), '<h1>Public</h1>');
  writeFileSync(join(directory, 'backend/.env'), 'PRIVATE_TEST_FIXTURE=not-a-secret');
  writeFileSync(join(directory, 'dist/site/stale-private-file'), 'must not be published');
  execFileSync(process.execPath, [resolve('scripts/public-site.mjs')], { cwd: directory });
  assert.deepEqual(readdirSync(join(directory, 'dist/site')).sort(), ['assets', 'css', 'index.html', 'js', 'paginas']);
  assert.ok(existsSync(join(directory, 'backend/.env')), 'El origen privado no se modifica');
 } finally { rmSync(directory, { recursive: true, force: true }); }
});
