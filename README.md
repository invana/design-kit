# Invana Design Kit

The design language, reusable UI components, stylesheets, and themes shared across
Invana products. It's a [pnpm](https://pnpm.io/) + [Turborepo](https://turborepo.com/)
monorepo built on React, [Tailwind CSS v4](https://tailwindcss.com/), and
[shadcn](https://ui.shadcn.com/) / [Radix](https://www.radix-ui.com/) primitives.

## Packages

| Package | Name | Description |
| --- | --- | --- |
| [`packages/styling`](packages/styling) | `@invana/styling` | Tailwind v4 design tokens, themes, and source CSS. No React, no build step — ships CSS directly. |
| [`packages/ui`](packages/ui) | `@invana/ui` | React component library — shadcn/Radix primitives (`components/ui/*`) and higher-level compositions (`components/ui-extended/*`), typography, and the `cn` util. |
| [`packages/forms`](packages/forms) | `@invana/forms` | Composable form building blocks — `FormField` (+ `ObjectField` and leaf inputs) on top of `react-hook-form`. Unopinionated: consumers own `useForm` and the form chrome. |
| [`packages/tables`](packages/tables) | `@invana/tables` | Data table components. |
| [`packages/themes`](packages/themes) | `@invana/themes` | App layout shells (`AppLayoutBase`, `app-v1`, `app-v2`) built on `@invana/ui`. |
| [`apps/storybook`](apps/storybook) | `@invana/stoybook` | Storybook 10 showcase and dev environment consuming all packages. Not published. |

**Dependency direction:** `ui` → `styling`; `forms`/`tables`/`themes` → `ui` + `styling`;
`storybook` consumes everything. `styling` stays React-free and `ui` must never import from
`themes` — don't invert these.

## Installation

Packages are published to npm under the `@invana/` namespace. Install whichever you need:

| Package | Install |
| --- | --- |
| `@invana/styling` | `pnpm add @invana/styling` |
| `@invana/ui` | `pnpm add @invana/ui` |
| `@invana/forms` | `pnpm add @invana/forms` |
| `@invana/tables` | `pnpm add @invana/tables` |
| `@invana/themes` | `pnpm add @invana/themes` |

Or install them all at once:

```bash
pnpm add @invana/styling @invana/ui @invana/forms @invana/tables @invana/themes
```

`react` and `react-dom` (18 or 19) are peer dependencies. `@invana/styling` requires
`tailwindcss@^4`. To use the compiled styles:

```ts
import "@invana/ui/styles.css";
```

And in your Tailwind entry CSS, import the design tokens (after Tailwind and your own
`@source` globs):

```css
@import "tailwindcss";
@import "@invana/styling/index.css";
```

## Development

Requires **Node >= 18** (`.nvmrc` pins `v22.15.0`) and **pnpm 9**.

```bash
pnpm install        # install workspace dependencies
pnpm build          # build all packages (respects ^build order via Turbo)
pnpm dev            # run all dev tasks in parallel
pnpm lint           # lint all packages
pnpm check-types    # type-check the workspace
pnpm format         # Prettier across **/*.{ts,tsx,md}
```

Filter to a single package with `pnpm --filter`:

```bash
pnpm --filter @invana/ui build
pnpm --filter @invana/themes dev
pnpm --filter @invana/stoybook dev   # runs Storybook on port 6009
```

> Note: the Storybook package name is intentionally misspelled `@invana/stoybook`.

Storybook aliases `@invana/*` to package **source** (`packages/*/src`), so it always
reflects unbuilt source — no need to rebuild packages while iterating.

## Contributing

1. Branch off `main`.
2. Make your change. Place new shadcn primitives in `packages/ui/src/components/ui/` and
   re-export them from `components/ui/index.ts`; higher-level compositions go in
   `components/ui-extended/`. Use the theme-aware CSS variables from `@invana/styling`
   (`background`, `foreground`, `primary`, `muted`, `accent`, `border`, …) and the `cn`
   helper for class merging — avoid hardcoded colors so all themes work.
3. Add a Storybook story for new components. Stories live in `apps/storybook/stories/`,
   one story per file, organized under `ui/` (mirroring `packages/ui/src/components/`),
   `form-generator/`, `data-tables/`, `themes/`, and `others/`. Story titles mirror the
   folder path (e.g. `"UI/UI/Button"`, `"UI/UI Extended/NavHorizontal"`).
4. Run `pnpm lint`, `pnpm check-types`, and `pnpm build` before opening a PR.
5. Open a PR against `main`. Commits are not created on your behalf — review the diff and
   commit explicitly.

See [`CLAUDE.md`](CLAUDE.md) for the full architecture and conventions reference.

## Release management

Two complementary pipelines, both driven from GitHub Actions:

### npm (version tags)

Pushing a `v*` git tag runs [`release.yml`](.github/workflows/release.yml) — a single
workflow whose jobs are the stages of a release:

```
resolve ─┬─ publish ──── dist-branches (matrix: all 7 packages)
         ├─ notes
         └─ storybook
```

`publish` builds every `packages/*` package and runs `pnpm -r publish` to npm (with
provenance; `workspace:*` dependencies are rewritten to real versions automatically),
`notes` creates the GitHub Release from git-cliff notes, and `storybook` deploys the
showcase to GitHub Pages.

```bash
# bump versions with ./release.sh <version>, then:
git push origin main --follow-tags
```

Nothing runs on a plain push to `main`. To redeploy the Storybook site between releases,
run the workflow manually with an empty `tag` input — only the `storybook` job runs.

### GitHub release branches

The `dist-branches` stage force-pushes each package's shippable files (`dist/` or `src/`,
`README`, a `package.json` with `devDependencies` and lifecycle scripts stripped) to a
`releases/<package>` branch. These branches provide an install-from-Git fallback
alongside the npm packages:

```bash
pnpm add github:invana/design-kit#releases/ui
```

## License

MIT © Ravi Raja Merugu
