import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  // Every kit package stays external: a dashboard that bundled @invana/ui would
  // put a second copy of every component beside the consumer's own.
  external: [
    'react',
    'react-dom',
    '@invana/ui',
    '@invana/forms',
    '@invana/editor',
    '@invana/styling',
    'lucide-react',
  ],
  treeshake: true,
  tsconfig: './tsconfig.lib.json',
})
