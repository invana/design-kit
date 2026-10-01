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

There is no test runner wired into root scripts. `@invana/assistant` has the one `test` script (`pnpm --filter @invana/assistant test`, vitest in node): it checks the grammar ids against the block registry, runs `validate()` on every session fixture, and exercises `applyPatch`. `vitest` is also installed in `ui` and `storybook` with no `test` script. Don't claim test commands that aren't there.

## Terms

One word per idea, the same in code, docs, stories and the Design Kit Spec (full table in
`docs/design-kit-spec.md`):

- **block**: one reusable drawing built from a JSON spec, shown in a conversation turn or a
  dashboard panel. No sub-types: a block that returns a value and one that only shows data are
  both blocks. Its id is its **kind** (`{ kind: "timeseries", … }`).
- **part**: a plain component a block is built from (`ui`, `charts`, `tables`, `forms`).
- **shell**: what frames a block and maps its actions: the conversation (`ChatSession`) or the
  dashboard (`PanelBox`).
- **ask** / **answer**: the two kinds of conversation turn, never the name of a block.
- **intent**: why a turn uses a block; conversation-only (`ASK_INTENTS`, `ANSWER_INTENTS`).
- Retired: *preset*, *intent block*, *answer block*, *ask preset*. In code: `BLOCKS` (with
  `BlockKind`, `AskKind`, `AnswerKind`) in `@invana/blocks`, the `kind` key, `ASK_INTENTS`.

## Workspace layout

```
packages/
  styling/   → @invana/styling   (Tailwind v4 design tokens, themes, source CSS only)
  ui/        → @invana/ui        (React component library, shadcn/Radix based)
  themes/    → @invana/themes    (App layout shells: AppLayoutBase, app-v1, app-v2)
  blocks/    → @invana/blocks    (every block, drawn from a JSON spec, and Page; shared by assistant and dashboard)
  assistant/ → @invana/assistant (JSON-driven analyst conversation: thread, asks, answers, follow-ups)
apps/
  storybook/ → @invana/stoybook  (Storybook 10 + Vite consumer of the three packages)
```

Dependency direction: `ui` depends on `styling` (devDep, workspace:*); `themes` depends on `ui` + `styling` (peer + dev, workspace:*); `storybook` consumes all three. `blocks` depends on `ui`, `charts`, `tables` and `styling`; `assistant` depends on `blocks`, `ui`, `charts`, `tables`, `forms` and `styling` (peer + dev, workspace:*) and nothing depends on it — the dashboard included. Never invert this — `styling` must remain free of React, `ui` must not import from `themes`, `blocks` or `assistant`, and `blocks` must not import from `assistant` or `dashboard`.

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

**Always cut releases with `./release.sh <version>` — never hand-edit versions or push a `release:` commit manually.** All publishable packages are versioned in lockstep (one shared version). `release.sh` must be run from a clean `main`; it bumps every `packages/*/package.json` via `npm version`, regenerates `CHANGELOG.md` (`git-cliff --tag v<version>`), commits both as `release: v<version>`, and creates the annotated tag `v<version>`. Then push with:

```
git push origin main --follow-tags
```

The **tag** (`v*`) is what completes a release — pushing the commit alone does nothing. Everything CI does lives in **one workflow**, `.github/workflows/release.yml`, so a release is a single run whose stages are jobs:

| Job | Needs | Does |
| --- | --- | --- |
| `resolve` | — | Works out the target ref/tag once, so the rest share one answer |
| `publish` | `resolve` | `turbo run build --filter="./packages/*"` then `pnpm -r publish` to **npm** with provenance (workspace deps rewritten to `^<version>`); uploads `packages/*/dist` as an artifact |
| `dist-branches` | `publish` | Matrix over all 10 packages — force-pushes each to `releases/<pkg>` |
| `notes` | `resolve` | git-cliff (`cliff.toml`) over the tag range → creates/edits the **GitHub Release** |
| `storybook` | `resolve` | Builds and deploys the Storybook site to GitHub Pages |

- Build and npm publish are deliberately the **same job**: `pnpm publish` runs each package's `prepare` (= build) anyway, so splitting them would only buy a second `pnpm install`.
- `CHANGELOG.md` itself is written by `release.sh` on the release commit, not by CI — never hand-edit it, and never hand-write a version section. If an entry is wrong, fix the commit message convention and regenerate.
- `dist-branches` ships git-branch distribution (`pnpm add github:invana/design-kit#releases/<package>`, see root `README.md`). It copies exactly what each `package.json` declares in `files` — `dist` for built packages, `src` for `styling` — strips `devDependencies` and the lifecycle hooks (`prepare` et al., which a git dependency would otherwise fire on install), and rewrites `workspace:*` to `^<version>`.
- **Nothing runs on a plain push to `main`** — not even Storybook. To redeploy the docs site between releases, run the workflow manually (`workflow_dispatch`) with an empty `tag` input; only the `storybook` job runs.
- Deploying Pages from a tag requires the `github-pages` environment to permit it. GitHub creates that environment restricted to the default branch, so a tag rule `v*` must exist under **Settings → Environments → github-pages → Deployment branches and tags**, or the `storybook` job fails its protection check.

If a `release:` commit ever lands without its tag (e.g. a manual push), recover by tagging that exact commit (`git tag -a v<version> -m "v<version>"`) and pushing with `--follow-tags` — do not re-run `release.sh`, which would fail on the already-bumped version.

## Conventions

- Components in `@invana/ui` follow shadcn structure (`components/ui/*` are primitives, `components/ui-extended/*` are higher-level compositions). When adding a new shadcn primitive, place it in `components/ui/` and re-export from `components/ui/index.ts`.
- Use `cn` from `@invana/ui/lib/utils` (re-exported at the package root) for class merging — it wraps `clsx` + `tailwind-merge`.
- **Type: three sizes, and the root is the dial.** A component declares no font size. Default text inherits the root (`html` is 13px in an application; a site can set 16px and every component follows). Text that is deliberately subordinate — a count, a timing, a row's subtitle — says `text-sm`; the genuinely small says `text-xs`. At a 13px root that ladder is **13 / 12 / 11**. `lg`/`xl` and up remain heading steps. **There is no `text-meta`** — it was a third name over the same 12px as `text-xs`, while `text-sm` was an alias of `base`, so four class names covered two sizes and `text-sm` did not mean small. The rename was 1:1 (`text-sm → text-base`, then `text-meta → text-sm` and `text-xs → text-sm`), so no pixel moved and `xs` became a rung that was never available before. A hard-coded size is what stops a component being body copy on a marketing page, which is the reason this rule exists. Every step is a ratio of the root (`rem`, never `px`, never `em`); see the ladder note at the top of `packages/styling/src/index.css`. **The scale only reaches a consumer that compiles that `@theme` block** — i.e. one that `@import`s `@invana/styling`; a consumer importing only the precompiled `@invana/ui/styles.css` gets custom properties, not tokens, and its own Tailwind regenerates `text-sm` at 0.875rem. Studio `@import`s `@invana/styling`.
- **`seamless` is a prop, and the assistant passes it.** Anything that is cells divided by rules
  — `Table`, `DataTable`, `CastTable`, a `joined` `MetricGrid`, `ScopeLine`, `ConfirmCard`'s cost
  strip, `ProposalCard`'s evidence — takes `seamless`: no border or radius around it, no rule under
  the last row, and its outer cells flush with the text around it (no outer padding). Off by
  default, so a table standing alone keeps its box. The assistant's renderers pass `seamless`
  (the card or answer is the frame), and so does the Design Kit Spec's shared stylesheet; the
  dashboard draws every panel in a `PanelBox` (a `title` only adds the label bar), so a block is
  framed alike in both shells;
  stories set the prop, never classes. Where the outer cells can't be known (an auto-fit grid that
  wraps), the component reaches out by a cell's padding and clips it — with `overflow-hidden`, not
  `clip-path`, whose anti-aliased edge shows the rule colour as a hairline.
- Theme-aware colors come from CSS variables defined in `@invana/styling` (`background`, `foreground`, `primary`, `muted`, `accent`, `border`, etc.). Prefer these tokens over hardcoded Tailwind colors so themes (`default`, `tailwind`, `vite`) all work.
- Do not create git commits unless the user explicitly asks for one. Stage and propose, but wait for an explicit "commit" instruction before running `git commit`.
- Write commit messages as [Conventional Commits](https://www.conventionalcommits.org/) — always prefix with a type and (where it applies) a package scope: `feat(ui): add DatePicker`, `fix(themes): correct header height`, `docs(readme): …`. The changelog is generated from these prefixes by git-cliff (`cliff.toml`), so commits without a valid prefix are dropped and never appear in `CHANGELOG.md`. Type → section: `feat` → Features, `fix` → Bug Fixes, `perf` → Performance, `refactor` → Refactors, `docs` → Documentation. `test`, `chore`, `ci`, `build`, `style` are valid prefixes but intentionally skipped from the changelog. `CHANGELOG.md` is regenerated by `release.sh` and the GitHub Release notes in CI (see Release pipeline), both from `cliff.toml` — so a commit's subject line *is* its changelog entry, and only the subject appears (bodies are not rendered). `pnpm changelog` (`git-cliff -o CHANGELOG.md`) previews the same output at any time.
- Form field placement: regular form fields (inputs, selects, checkboxes, textareas, radios, switches, etc. — anything buildable with React + Radix + existing deps) belong in `@invana/ui` alongside other primitives. Only specialised fields that require their own external JS library (e.g. rich text editor, heavy date picker, code editor, file uploader with a dep) get their own package or live in `@invana/forms`.
- `@invana/forms` is an unopinionated composition library, NOT a one-shot form renderer. There is no `FormRenderer` / `FormSchema` tree. Consumers always own `useForm` (react-hook-form) and compose their own chrome (Card, Tabs, Accordion, footer, Submit). The library exposes: `FormField` (shadcn's RHF `FormField` augmented with `.ObjectField` and `.Color` / `.Number` / `.Select` / `.Boolean` / `.Input` / `.Icon`), the `Form` provider, and leaf shadcn inputs (`Input`, `Select`, `Switch`, …). The primary building block is `<FormField.ObjectField control={form.control} name="shape" fields={[…]} rowConfig={[…]} labelPosition="top" />` — fields render as `${name}.${field.name}` so multiple ObjectFields in the same `useForm` all write to a single shared data object. Fields with a `group` property are auto-wrapped in an Accordion; ungrouped fields render flat.
- **A story composes default components and adds no classes.** A story is the component's own
  documentation, so it shows what the kit renders out of the box: `<Eyebrow>`, `<SectionHeader>`,
  `<TypographyH4>`, `<PropertyList>` — never a raw `<h4 className="mb-2 text-sm font-medium
  text-muted-foreground">` or a `<div>` dressed with utilities. The **only** exception is a story
  whose subject *is* the customisation — a "with a custom class" variant demonstrating `className`
  passthrough — and it says so in its name.
- **Match the job, not the tag.** The right component is the one that owns the role, which is often
  not the one whose name matches the HTML element. A small muted label over a block is `Eyebrow` or
  `SectionHeader`, **not** `TypographyH4` — `TypographyH4` is `text-xl font-semibold`, so swapping
  the tag for the same-numbered component makes a 20px heading out of a caption. Label/value pairs
  are `PropertyList`; a band of a panel is `PanelBox` or a bare `Eyebrow`.
- **A story that cannot be written without classes is a gap in the kit.** Build the missing
  component here, with its own story, rather than styling around it — that is the signal this rule
  exists to surface.
- **How a story is written** (the standard for every story).
  The story-only helpers are in `apps/storybook/stories/_story/`; none of them is a kit component.
  - **Data is JSON** in `apps/storybook/fixtures/<area>/` (`blocks/<kind>.json`, `charts/`, `runs/`,
    `dashboards/`), never inline in the story — and never in a package (no dummy data ships). A
    block's file is `[{ caption, spec, state?, value?, narrow?, turn, now? }]`, typed in
    `fixtures/blocks/index.ts`; `Blocks/<Kind>`, its conversation board and a dashboard panel all read
    the same file.
  - **One story per component, showing its variants**: `VariantBoard` lays them out as the spec's
    board does, with a `variant` select (`variantArg`) to draw one.
  - **The Code tab shows the data and the call**, written from that JSON with `snippet` / `snippets`
    / `jsx` into `parameters.docs.source` (`transform: sourceFor(…)` when there is a `variant`
    select, so the Code tab follows it). Callbacks are named (`onAction={onAction}`) with what they
    receive in a comment.
  - **Interactions answer back.** Every callback is an `fn()` arg (the Actions panel) and is written
    to the cell's `EventLog` with its payload; the story then does what a consumer would — an ask
    settles (`LiveBlock`), a conversation event gets the API's patch (`LiveTurn`), a picked row
    moves the selection. `Reset` draws a cell fresh.
  - **Live data is replayed**: `useReplay` + `ReplayFrame` feed a stream (chart points, run events)
    as new props, with play / pause / skip to end.
  - **A `play` function checks the interaction** — click, then assert the payload and what changed.
    Run them with `pnpm --filter @invana/stoybook exec vitest run --project storybook <path>`.
- **One title, one story — so the sidebar shows only folders and stories.** Every `*.stories.tsx`
  exports exactly one story, and no two files share a `title`: a component's variants are cells of
  its one story (`VariantBoard`), never sibling files. The story's export is named as the title's
  last segment (`title: 'Blocks/Components/Confirm'`, `export const Confirm`), so Storybook hoists
  it and draws no component node. A component whose variants are too heavy for one page (a
  `DataTable`, an app shell) draws one at a time: its `variant` arg defaults to the first caption.
- **Blocks, Charts, Dashboard and Assistant share one tree**: `<Area>/Components/<Name>` (one
  story per component, every variant), `<Area>/Showcase` (every component of the area and its
  variants on one page, read from the same JSON — never a second copy of the data), plus
  `Dashboard/Examples/<Screen>` for whole dashboards and `Assistant/Conversations/*` and
  `Assistant/Playground` as they are. In code: `stories/<area>/components/<name>/<name>.stories.tsx`
  and `stories/<area>/showcase.stories.tsx`.
- Organize stories under these top-level sections in `apps/storybook/stories/`: `ui/`, `forms/` (`@invana/forms`, kept small and split by who builds the fields: `forms/manual/` — fields written by hand, a `FormField` render per field (raw controls, or the generator's labelled rows such as `FormField.Input`); `forms/generated/` — fields rendered from a `FieldConfig[]` by `ObjectField` / `SettingsPanel`: the capabilities (all fields, rows and columns, groups) and one story per Studio form shape (sign in, create page, dialog, settings section, inspector). A new Studio form that fits an existing story extends it rather than adding one), `data-tables/`, `assistant/` (mirrors `packages/assistant/src`: `assistant/conversations/`, `assistant/asks/`, `assistant/answers/`, every story under `assistant/conversations/` renders `<ChatSession spec={fixture} />` and nothing else, with its JSON in `fixtures/conversations/`; and `assistant/playground.stories.tsx` (`Assistant/Playground`) — the whole assistant in an `AppLayoutV2` shell, and the one place each user's experience is shown (there are no per-user stories): pick a user (or link to one with the `user` arg, e.g. `&args=user:journalist;variant:cli`), a variant (`web`/`cli`) and a width, and play recorded runs (send, needs input, a costly question, failure, stop, open a step, tasks view) into their thread. Its data is one JSON file per user in `packages/assistant/src/data/conversations/` — the thread they open on plus their recorded runs, built into patch scripts by `fixtures/scripts/runs.ts`; a new moment or user goes there, and `runs.test.ts` checks that the users together show every built ask and block), `blocks/` (`@invana/blocks`: `blocks/components/<kind>/` or `page/`, titled `Blocks/Components/<Name>`; the conversation's board for the same block is `Assistant/Components/Asks/<Name>` or `Assistant/Components/Answers/<Name>`, from the same JSON), `charts/` (`charts/components/<component>/`, titled `Charts/Components/<Component>`), `themes/` (for theme stories), and `others/` (catch-all for anything that doesn't fit). A small number of top-level showcase stories (e.g. `palette.stories.tsx`, `showcase.stories.tsx`) live directly in `apps/storybook/stories/` so they appear at the sidebar root; their `title` is a single segment (`"Palette"`, `"Showcase"`).
- Stories under `ui/` mirror `packages/ui/src/components/` exactly — i.e. `ui/ui/`, `ui/ui-extended/`, `ui/typography/`. Story `title` mirrors the full folder path, e.g. `"UI/UI/Button"`, `"UI/UI Extended/NavHorizontal"`, `"UI/Typography/Heading"`, `"Data Tables/DataTable"`, `"Themes/AppV2"`. The forms section follows the same rule — `"Forms/Manual/Composed Form"`, `"Forms/Generated/Dialog"`.

## Where demand comes from

The kit's roadmap is driven by the **Invana hi-fi board** at
`~/Projects/invana/invana/.design/` (43 artboards, `hi-fi-finance/`). Every hi-fi screen is
composed only from `@invana/*` components — so a component the board needs and the kit lacks is a
gap in the kit, not a one-off in the design.

- `~/Projects/invana/invana/.design/design-kit-coverage.md` is the authoritative map: each board
  element → its design-kit component, what is missing, and the build order. Read it before adding
  a component, and update it when you ship one.
- The **Design Kit Spec** (https://claude.ai/artifact/VcN3AYgmbdCpHbxXZjMir5) is the one design
  reference for blocks; code follows it and no other canvas. Its model (see Terms): a **block**
  is drawn from its JSON spec and composed of **parts** (`ui-extended`, `charts`, `tables`,
  `forms`) that know nothing of blocks and take size, density, `palette` and `seamless` as props;
  a **shell** (conversation or dashboard) frames it. In a conversation an **intent** says why a
  turn uses a block, and several intents may share one block with different options. Each block
  board's header names its intents, parts, status and knobs; the Shared blocks page shows one spec
  in both shells, the Customisation page shows the knobs live and the Playground shows the blocks
  in `AppLayoutV2`. Each block with a renderer has **one story that replicates its whole board**: every variant,
  captioned as the board captions it, laid out by the story-only `Board` helper
  (`apps/storybook/stories/assistant/board.tsx`, four 320px columns; the 280px variant draws at
  280px). A variant the renderer cannot draw is a gap in the renderer, not a story workaround.
  A design change goes to the spec first; its Needs review page holds changes not yet decided.
- `docs/TODO.md` tracks every component the assistant needs, across packages:
  folder, change, status, tier, and the assistant's block registry. Flip a row's `Status` in the
  same commit that ships or changes the component.
- New components land here **with a story** before the design or Studio uses them. A component
  without a story is not done.
- **Where a component goes** — ask in order and stop at the first yes:
  needs an external JS library the other packages don't have → its own package
  (`@invana/editor`, `@invana/charts`); encodes numbers as marks → `@invana/charts`; rows and
  columns of records → `@invana/tables`; drawn from a JSON spec, in a conversation turn, a
  dashboard panel or a page → `@invana/blocks`; only meaningful inside a conversation (turns,
  intents, the envelope) → `@invana/assistant`; anything else, including anything a dashboard, run view,
  review queue or report also shows → `@invana/ui`. So `TraceList`, `ExchangeRecord`,
  `ArtifactTable`, the run outcomes, `CitationList` and `ProposalCard` stay in ui.
- **`@invana/assistant` is JSON only.** Studio renders `<ChatSession spec variant="cli" | "web" />`
  (`packages/assistant/src/styles/`); the API sends a `ConversationSpec` then patches
  (`applyPatch`, or handed over as `stream` / `useChatSession().stream`), the UI sends
  `ConversationEvent`s — to `onEvent` and to a typed callback per event (`onReply`, `onAction`,
  `onOpenRun`, …). The variants share one base (`styles/base/`) and **name no block**: every ask
  and block is drawn through the registry, and how one sits (an ask bare or in the question card, a
  block in the answer card or its own) is a trait registered beside its renderer, never a check on
  its id in a variant.
  Kinds are ids in `packages/blocks/src/kinds.ts`; intents, patterns and flows are ids in
  `packages/assistant/src/grammar/`. A new block gets a board on the Design Kit Spec and a kind
  first, then its renderer (`packages/blocks/src/blocks/<kind>.tsx`, props `{ spec, state?,
  value?, id?, onAction? }`) is registered in `packages/blocks/src/registry.ts`; the assistant
  wraps every block once (`answers/shared.tsx`), turning its actions into conversation events. An
  unbuilt block renders a labelled placeholder; a renderer reads only its spec — a screen that
  needs more is a change to the kind's options, not a prop.
  Envelope fields (scope, grounding, freshness, method, caveats) sit on the answer, never as
  blocks. Answer patterns are typed recipes and stories, not exports.
- **Every chart lives in `@invana/charts`**, never in `@invana/ui` — the dependency points
  charts → ui, and ui gets no re-exports. Time series are uPlot on the internal chart frame
  (`packages/charts/src/base/`), which resolves tokens for the canvas and redraws on theme or
  density change; in-row marks (sparkline, meter, segmented bar) are DOM/SVG. `Legend`,
  `MetricTile`, `MetricGrid` and `Progress` stay in `@invana/ui`.
- Density is a **token axis, not a prop**. `@invana/styling` ships `data-density="compact"`;
  components read the control scale rather than hard-coding `h-8`/`h-9`.
- **One size name, one height.** `@invana/styling` defines the control scale as spacing tokens
  `--spacing-control-xs|sm|md|lg` — **22 / 26 / 32 / 40px** at a 13px root, in `rem` so they
  follow the root. Every component with a `size` maps its names onto `h-control-*` /
  `size-control-*` and nothing else: `Button`, `Badge`, `SearchInput`, forms `Input` / `Select`,
  `SegmentedControl`, `Toggle`, `Tabs`, `FilterChip`. A control given no size is `md` — every
  one, so an unsized toolbar lines up; a toolbar beside a search passes `sm`. The one exception is
  `Badge`, which defaults to `xs` because it labels a row. Callers pass `size` (or a table's
  `density`), never an `h-control-*` class. Table `density` is the same scale — `compact` = `sm`,
  `default` = `md`, `comfortable` = `lg`, header and rows alike — and a cell's padding is kept
  small enough that the row holds that height with a `xs` badge or an open editor in it. `cn` registers the
  names with tailwind-merge — a new `--spacing-*` name must be added there too, or a conflicting
  height survives the merge. A control's text is the root size; only `Badge` stays `text-sm`.
  **A bar is a control's height too**: `lg` — `AppLayoutBase` header, `RecordHeader` (default);
  `md` — `PanelBox`, `TabbedPanel`, `PanelContent` and `FilterBar` headers, `RecordHeader
  size="md"` (a panel or drawer), `StagedBar` (minimum); `sm` — `ContextBar`, `AppStatusBar`, the
  app footer, and a card's header strip (`ClarifyCard`, `EmissionCard`, `TemplatePicker`). A bar
  holds controls a step smaller. Never a pixel height on a bar.
