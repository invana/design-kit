import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

// Node only: the tests here check the contract (board patches), not rendering.
// Rendering is checked in Storybook.
export default defineConfig({
  resolve: {
    // Blocks from source, as Storybook reads them, so a test never runs against a stale build.
    alias: { '@invana/blocks': fileURLToPath(new URL('../blocks/src', import.meta.url)) },
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
})
