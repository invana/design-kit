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

**Always cut releases with `./release.sh <version>` — never hand-edit versions or push a `release:` commit manually.** All publishable packages are versioned in lockstep (one shared version). `release.sh` must be run from a clean `main`; it bumps every `packages/*/package.json` via `npm version`, commits `release: v<version>`, and creates the annotated tag `v<version>`. Then push with:

```
git push origin main --follow-tags
```

The **tag** (`v*`) is what completes a release — pushing the commit alone is not enough:

- `.github/workflows/release.yml` runs git-cliff (`cliff.toml`) over the tag range to generate release notes and publishes/edits the **GitHub Release**. This is how the changelog is generated — do not run `git cliff` locally or commit `CHANGELOG.md` by hand as part of a release.
- `.github/workflows/release-npm.yml` builds `packages/*` and publishes them to **npm** (`pnpm -r publish`, workspace deps rewritten to `^<version>`).

Separately, on the release **commit** push, `.github/workflows/release-{ui,styling,themes}.yml` build each package whose files changed and publish the built artifacts to branches `releases/ui`, `releases/styling`, `releases/themes` (git-branch distribution: `pnpm add github:invana/design-kit#releases/<package>`, see root `README.md`; the `dist/` contents are what ship). `release-ui` also triggers on `packages/styling/**` changes because `ui`'s build embeds the compiled styles.

If a `release:` commit ever lands without its tag (e.g. a manual push), recover by tagging that exact commit (`git tag -a v<version> -m "v<version>"`) and pushing with `--follow-tags` — do not re-run `release.sh`, which would fail on the already-bumped version.

## Conventions

- Components in `@invana/ui` follow shadcn structure (`components/ui/*` are primitives, `components/ui-extended/*` are higher-level compositions). When adding a new shadcn primitive, place it in `components/ui/` and re-export from `components/ui/index.ts`.
- Use `cn` from `@invana/ui/lib/utils` (re-exported at the package root) for class merging — it wraps `clsx` + `tailwind-merge`.
- **Type: two sizes, and the root is the dial.** A component declares no font size. Default text inherits the root (`html` is 13px in an application; a site can set 16px and every component follows). Text that is deliberately subordinate — a count, a timing, a row's subtitle — says `text-meta`. That is the whole ladder for content; `lg`/`xl` and up remain heading steps. **Do not write `text-sm` or `text-xs`** — they are compatibility aliases of `base` and `meta`, kept so the 300+ existing call sites in canvas and invana render what their authors meant, not so new code has options. A hard-coded size is what stops a component being body copy on a marketing page, which is the reason this rule exists. Every step is a ratio of the root (`rem`, never `px`, never `em`); see the ladder note at the top of `packages/styling/src/index.css`. **The aliases only reach a consumer that compiles that `@theme` block** — i.e. one that `@import`s `@invana/styling`. A consumer importing only the precompiled `@invana/ui/styles.css` gets custom properties, not tokens, and its own Tailwind regenerates `text-sm` at 0.875rem. Studio is in that second group today.
- Theme-aware colors come from CSS variables defined in `@invana/styling` (`background`, `foreground`, `primary`, `muted`, `accent`, `border`, etc.). Prefer these tokens over hardcoded Tailwind colors so themes (`default`, `tailwind`, `vite`) all work.
- Do not create git commits unless the user explicitly asks for one. Stage and propose, but wait for an explicit "commit" instruction before running `git commit`.
- Write commit messages as [Conventional Commits](https://www.conventionalcommits.org/) — always prefix with a type and (where it applies) a package scope: `feat(ui): add DatePicker`, `fix(themes): correct header height`, `docs(readme): …`. The changelog is generated from these prefixes by git-cliff (`cliff.toml`), so commits without a valid prefix are dropped and never appear in `CHANGELOG.md`. Type → section: `feat` → Features, `fix` → Bug Fixes, `perf` → Performance, `refactor` → Refactors, `docs` → Documentation. `test`, `chore`, `ci`, `build`, `style` are valid prefixes but intentionally skipped from the changelog. The changelog/release notes are generated in CI from the release tag (see Release pipeline) — `pnpm changelog` (`git-cliff -o CHANGELOG.md`) is for local preview only, not part of cutting a release.
- Form field placement: regular form fields (inputs, selects, checkboxes, textareas, radios, switches, etc. — anything buildable with React + Radix + existing deps) belong in `@invana/ui` alongside other primitives. Only specialised fields that require their own external JS library (e.g. rich text editor, heavy date picker, code editor, file uploader with a dep) get their own package or live in `@invana/forms`.
- `@invana/forms` is an unopinionated composition library, NOT a one-shot form renderer. There is no `FormRenderer` / `FormSchema` tree. Consumers always own `useForm` (react-hook-form) and compose their own chrome (Card, Tabs, Accordion, footer, Submit). The library exposes: `FormField` (shadcn's RHF `FormField` augmented with `.ObjectField` and `.Color` / `.Number` / `.Select` / `.Boolean` / `.Input` / `.Icon`), the `Form` provider, and leaf shadcn inputs (`Input`, `Select`, `Switch`, …). The primary building block is `<FormField.ObjectField control={form.control} name="shape" fields={[…]} rowConfig={[…]} labelPosition="top" />` — fields render as `${name}.${field.name}` so multiple ObjectFields in the same `useForm` all write to a single shared data object. Fields with a `group` property are auto-wrapped in an Accordion; ungrouped fields render flat.
- Write only one story per file in `apps/storybook/stories/`. Each `*.stories.tsx` file should export a single story — split variants into separate files rather than bundling multiple stories together.
- Organize stories under these top-level sections in `apps/storybook/stories/`: `ui/`, `forms/` (form generator stories, split into `forms/examples/` for full example forms — login, registration, create-project, … — and `forms/showcase/` for capability showcases — object-field, column-layout, complex, properties-panel), `data-tables/`, `themes/` (for theme stories), and `others/` (catch-all for anything that doesn't fit). A small number of top-level showcase stories (e.g. `palette.stories.tsx`, `showcase.stories.tsx`) live directly in `apps/storybook/stories/` so they appear at the sidebar root; their `title` is a single segment (`"Palette"`, `"Showcase"`).
- Stories under `ui/` mirror `packages/ui/src/components/` exactly — i.e. `ui/ui/`, `ui/ui-extended/`, `ui/typography/`. Story `title` mirrors the full folder path, e.g. `"UI/UI/Button"`, `"UI/UI Extended/NavHorizontal"`, `"UI/Typography/Heading"`, `"Data Tables/DataTable"`, `"Themes/AppV2"`. The one exception is the forms section: files live under `forms/examples/` and `forms/showcase/`, but their titles are grouped under `Form Generator/…` for the sidebar — e.g. `"Form Generator/Examples/Login"`, `"Form Generator/Showcase/Properties Panel"`.

## Where demand comes from

The kit's roadmap is driven by the **Invana hi-fi board** at
`~/Projects/invana/invana/.design/` (43 artboards, `hi-fi-finance/`). Every hi-fi screen is
composed only from `@invana/*` components — so a component the board needs and the kit lacks is a
gap in the kit, not a one-off in the design.

- `~/Projects/invana/invana/.design/design-kit-coverage.md` is the authoritative map: each board
  element → its design-kit component, what is missing, and the build order. Read it before adding
  a component, and update it when you ship one.
- New components land here **with a story** before the design or Studio uses them. A component
  without a story is not done.
- Invana-domain composites (emissions, thinkings, citations, charts) belong in
  `@invana/ui/components/ui-extended/` — they need no external dep, and the whole kit is Invana's.
  Only a component needing an external JS library gets its own package (see the placement rule
  above); `@invana/editor` (CodeMirror 6) is the current example.
- Density is a **token axis, not a prop**. `@invana/styling` ships `data-density="compact"`;
  components read `--control-h*` / `--font-size-*` rather than hard-coding `h-8`/`h-9`.
