import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  // CodeMirror stays external: it is the reason this package exists, and
  // bundling it here would put a second copy beside a consumer's own.
  external: [
    'react',
    'react-dom',
    '@invana/ui',
    '@invana/styling',
    '@codemirror/state',
    '@codemirror/view',
    '@codemirror/commands',
    '@codemirror/language',
    '@codemirror/legacy-modes',
  ],
  treeshake: true,
  tsconfig: './tsconfig.lib.json',
})
