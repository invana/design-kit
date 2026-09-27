import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

// One config for every package and app. ESLint looks for it from the
// directory it runs in upward, so `eslint .` inside `packages/ui` finds this
// file — a package that needs something different adds its own beside it.
//
// The packages ship as tsup-built libraries, not Vite apps, so the
// react-refresh (Fast Refresh boundary) rules don't apply — a barrel that
// re-exports and hooks co-located with their provider are correct here.
export default defineConfig([
  globalIgnores(['**/dist', '**/storybook-static', '**/node_modules', '**/.turbo']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
