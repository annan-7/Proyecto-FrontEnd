import { build } from 'esbuild';
await build({
  entryPoints: ['planner/app.tsx'], outfile: 'js/planificador.js',
  bundle: true, minify: true, format: 'iife', target: ['es2020'],
  jsx: 'automatic', jsxImportSource: 'preact',
  define: { 'process.env.NODE_ENV': '"production"' },
});
