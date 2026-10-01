import { defineConfig } from 'vitest/config'

// Node only: the tests here check the contract (grammar ids, fixtures,
// patches), not rendering. Rendering is checked in Storybook.
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
})
