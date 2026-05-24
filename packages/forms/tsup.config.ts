import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    '@invana/ui',
    '@invana/styling',
    'react-hook-form',
    '@hookform/resolvers',
    'zod',
    'lucide-react',
    'react-day-picker',
    'react-colorful',
  ],
  treeshake: true,
  tsconfig: './tsconfig.lib.json',
})
