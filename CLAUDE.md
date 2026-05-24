# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository

Invana Design Kit — a pnpm + Turborepo monorepo containing the design language, reusable UI components, stylesheets, and themes shared across Invana products.

- Package manager: `pnpm@9.0.0` (workspace defined in `pnpm-workspace.yaml`)
- Node: `>=18` (`.nvmrc` pins `v22.15.0`)
- Build orchestrator: Turborepo (`turbo.json`)

## Commands

Run from repo root unless noted:

- `pnpm build` — builds all packages via Turbo (respects `^build` dependency order)
- `pnpm dev` — runs all `dev` tasks in parallel (non-cached, persistent)
- `pnpm lint` — lints all packages
- `pnpm check-types` — type-checks across the workspace
- `pnpm format` — Prettier across `**/*.{ts,tsx,md}`

Filter to a single package with `pnpm --filter <name> <script>`, e.g.:

- `pnpm --filter @invana/ui build`
- `pnpm --filter @invana/themes dev`
- `pnpm --filter @invana/stoybook dev` — note the misspelled package name (`stoybook`) in `apps/storybook/package.json`; the script runs Storybook on port 6009

Per-package scripts of note:

- `@invana/ui` / `@invana/themes`: `build` runs `tsup` then `build:css` (Tailwind CLI bundles `src/styles/globals.css` → `dist/styles.css`); `type-check` runs `tsc --noEmit`
- `@invana/stoybook`: `dev` = `storybook dev -p 6009`, `build-storybook` produces `storybook-static/`
- `@invana/styling`: ships source CSS directly — no build step

There is no test runner wired into root scripts; `vitest` is installed in `ui` and `storybook` but no `test` script exists. Don't claim test commands that aren't there.

## Workspace layout

```
packages/
  styling/   → @invana/styling   (Tailwind v4 design tokens, themes, source CSS only)
  ui/        → @invana/ui        (React component library, shadcn/Radix based)
  themes/    → @invana/themes    (App layout shells: AppLayoutBase, app-v1, app-v2)
apps/
  storybook/ → @invana/stoybook  (Storybook 10 + Vite consumer of the three packages)
```

Dependency direction: `ui` depends on `styling` (devDep, workspace:*); `themes` depends on `ui` + `styling` (peer + dev, workspace:*); `storybook` consumes all three. Never invert this — `styling` must remain free of React, `ui` must not import from `themes`.

## Architecture

### `@invana/styling` — Tailwind v4 token layer

- Pure CSS package. `main` is `./src/index.css`; subpath exports expose `base`, `theme`, `themes/default|tailwind|vite`, plus `themes.config.ts`.
- Consumers `@import "tailwindcss"` first, declare their own `@source` globs, then `@import "@invana/styling/index.css"`.
- `themes.config.ts` is the single source of truth for theme variants (id, name, mode). `applyTheme(variantId)` mutates `document.documentElement` — sets `data-theme`, adds `theme-<id>` and `light`/`dark` classes, and wires a `prefers-color-scheme` listener for `system` mode. Storybook's theme toolbar consumes `getStorybookThemeItems()` from this file.

### `@invana/ui` — component library

- `src/index.ts` re-exports `components/ui/*` (shadcn primitives wrapping Radix), `components/ui-extended/*` (composed components like `NavHorizontal`, `NavVertical`, `TabbedPanel`, `TreeView`, `Toolbar`), `components/typography/*`, and the `cn` util from `lib/utils`.
- Built with `tsup` → CJS + ESM + `.d.ts`. `react` / `react-dom` are externals; `peerDependencies` are React 18 or 19.
- `build:css` uses `@tailwindcss/cli` to compile `src/styles/globals.css` → `dist/styles.css`; this file is exported as `@invana/ui/styles.css`.
- Path alias `@/components`, `@/lib`, `@/hooks`, `@/styles` map inside `packages/ui/src/` — see `apps/storybook/.storybook/main.ts` for the canonical alias map used in Storybook's Vite config.

### `@invana/themes` — app shells

- `src/index.tsx` exposes `core` (theme provider), `app-base`, `app-v1`, `app-v2`. Each `app-*` folder is a self-contained layout (header/main/footer or sidebar variants) built on top of `@invana/ui` primitives (`TooltipProvider`, `NavHorizontal`, etc.).
- Same `tsup` + Tailwind CLI build pipeline as `ui`. Peer deps include `@invana/styling` and `@invana/ui` as `workspace:*`.

### `apps/storybook` — showcase + dev environment

- Storybook 10 on Vite 7, React 19. Stories live in `apps/storybook/stories/` (organized as `ui-components/`, `themes/`, `debug/`, plus `palette.stories.tsx` and `showcase.stories.tsx`).
- `.storybook/main.ts` aliases `@invana/*` to the source (`packages/*/src`) so Storybook always reflects unbuilt source — no need to rebuild packages while iterating. Honor those aliases when adding new subpaths.

## Release pipeline

`.github/workflows/release-{ui,styling,themes}.yml` build each package on pushes to `main` that touch the relevant package, then publish the built artifacts to branches `releases/ui`, `releases/styling`, `releases/themes`. Consumers install via `pnpm add github:invana/design-kit#releases/<package>` (see root `README.md`). There is no npm publish — distribution is git-branch based, so the contents of `dist/` for `ui` and `themes` are what ship. The `release-ui` workflow also triggers on changes to `packages/styling/**` because `ui`'s build embeds the compiled styles.

## Conventions

- Components in `@invana/ui` follow shadcn structure (`components/ui/*` are primitives, `components/ui-extended/*` are higher-level compositions). When adding a new shadcn primitive, place it in `components/ui/` and re-export from `components/ui/index.ts`.
- Use `cn` from `@invana/ui/lib/utils` (re-exported at the package root) for class merging — it wraps `clsx` + `tailwind-merge`.
- Theme-aware colors come from CSS variables defined in `@invana/styling` (`background`, `foreground`, `primary`, `muted`, `accent`, `border`, etc.). Prefer these tokens over hardcoded Tailwind colors so themes (`default`, `tailwind`, `vite`) all work.
- Do not create git commits unless the user explicitly asks for one. Stage and propose, but wait for an explicit "commit" instruction before running `git commit`.
- Form field placement: regular form fields (inputs, selects, checkboxes, textareas, radios, switches, etc. — anything buildable with React + Radix + existing deps) belong in `@invana/ui` alongside other primitives. Only specialised fields that require their own external JS library (e.g. rich text editor, heavy date picker, code editor, file uploader with a dep) get their own package or live in `@invana/forms`.
- Write only one story per file in `apps/storybook/stories/`. Each `*.stories.tsx` file should export a single story — split variants into separate files rather than bundling multiple stories together.
- Organize stories under these top-level sections in `apps/storybook/stories/`: `ui/`, `form-generator/`, `data-tables/`, `themes/` (for theme stories), and `others/` (catch-all for anything that doesn't fit). A small number of top-level showcase stories (e.g. `palette.stories.tsx`, `showcase.stories.tsx`) live directly in `apps/storybook/stories/` so they appear at the sidebar root; their `title` is a single segment (`"Palette"`, `"Showcase"`).
- Stories under `ui/` mirror `packages/ui/src/components/` exactly — i.e. `ui/ui/`, `ui/ui-extended/`, `ui/typography/`. Story `title` mirrors the full folder path, e.g. `"UI/UI/Button"`, `"UI/UI Extended/NavHorizontal"`, `"UI/Typography/Heading"`. For other sections: `"Form Generator/TextInput"`, `"Data Tables/DataTable"`, `"Themes/AppV2"`.
