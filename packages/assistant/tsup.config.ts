import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  // Every kit package stays external: the assistant composes ui, charts, tables
  // and forms, and bundling any of them would ship a second copy of each.
  external: [
    'react',
    'react-dom',
    '@invana/ui',
    '@invana/charts',
    '@invana/tables',
    '@invana/forms',
    '@invana/styling',
  ],
  treeshake: true,
  tsconfig: './tsconfig.lib.json',
})
