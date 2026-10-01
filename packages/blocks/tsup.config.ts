import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  // Every kit package stays external: a block composes ui, charts and tables,
  // and bundling any of them would ship a second copy of each.
  // react-hook-form stays with them: the form block shares forms' context.
  external: ['react', 'react-dom', 'react-hook-form', '@invana/ui', '@invana/charts', '@invana/tables', '@invana/forms', '@invana/styling'],
  treeshake: true,
  tsconfig: './tsconfig.lib.json',
})
