import type { StorybookConfig } from "@storybook/react-vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx", 
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-vitest"
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config) {
    // Ensure aliases are properly resolved
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      // When @ is used in UI package files, resolve to UI package src
      '@/components': resolve(__dirname, '../../../packages/ui/src/components'),
      '@/lib': resolve(__dirname, '../../../packages/ui/src/lib'),
      '@/hooks': resolve(__dirname, '../../../packages/ui/src/hooks'),
      '@/styles': resolve(__dirname, '../../../packages/ui/src/styles'),
      '@': resolve(__dirname, '../src'),
      '@invana/ui': resolve(__dirname, '../../../packages/ui/src'),
      '@invana/ui/*': resolve(__dirname, '../../../packages/ui/src/*'),
      '@invana/styling': resolve(__dirname, '../../../packages/styling/src'),
      '@invana/styling/*': resolve(__dirname, '../../../packages/styling/src/*'),
      '@invana/themes': resolve(__dirname, '../../../packages/themes/src'),
      '@invana/themes/*': resolve(__dirname, '../../../packages/themes/src/*'),
      '@invana/tables': resolve(__dirname, '../../../packages/tables/src'),
      '@invana/tables/*': resolve(__dirname, '../../../packages/tables/src/*'),
      '@invana/forms': resolve(__dirname, '../../../packages/forms/src'),
      '@invana/forms/*': resolve(__dirname, '../../../packages/forms/src/*'),
      '@invana/editor': resolve(__dirname, '../../../packages/editor/src'),
      '@invana/editor/*': resolve(__dirname, '../../../packages/editor/src/*'),
      '@invana/charts': resolve(__dirname, '../../../packages/charts/src'),
      '@invana/blocks': resolve(__dirname, '../../../packages/blocks/src'),
      '@invana/charts/*': resolve(__dirname, '../../../packages/charts/src/*'),
      '@invana/boards': resolve(__dirname, '../../../packages/boards/src'),
      '@invana/assistant': resolve(__dirname, '../../../packages/assistant/src'),
      '@invana/assistant/*': resolve(__dirname, '../../../packages/assistant/src/*'),

    };
    // The graph canvas is linked from the local canvas repo (`link:` in package.json). It brings
    // its own React and `@invana/themes`: one React for both, and — a linked package is source to
    // Vite, not a pre-bundled dep — its themes import goes through the alias above to this repo's
    // source, so `CanvasThemeSync` reads the same ThemeProvider as the stories.
    config.resolve.dedupe = [...(config.resolve.dedupe ?? []), 'react', 'react-dom'];

    return config;
  },
  docs: {}
};

export default config;
