# @invana/ui

Invana's React component library — shadcn-style primitives over Radix, plus the composed
components the Invana products share.

```bash
pnpm add @invana/ui
```

Peer dependencies: `react` and `react-dom` (18 or 19).

## Styles

Two ways in, and the difference matters.

**Recommended — compile the tokens yourself.** Your Tailwind v4 build sees `@invana/styling`'s
`@theme` block, so the design tokens (including the type ladder) are real tokens in your build:

```css
@import "tailwindcss";

/* your own source globs, plus this package's so its classes are generated */
@source "./src/**/*.{ts,tsx}";
@source "../../node_modules/@invana/ui/dist/**/*.js";

@import "@invana/styling/index.css";
```

**Or ship the precompiled sheet**, if you are not running Tailwind:

```ts
import '@invana/ui/styles.css';
```

The precompiled sheet gives you CSS custom properties but **not** the `@theme` tokens — your own
Tailwind will regenerate `text-sm` at its stock `0.875rem` rather than the kit's value. Prefer the
first form when you have a Tailwind build.

## Usage

```tsx
import { Button, Card, NavHorizontal, cn } from '@invana/ui';

export function Toolbar({ active }: { active: boolean }) {
  return (
    <Card className={cn('p-4', active && 'ring-1 ring-ring')}>
      <Button variant="outline">Run</Button>
    </Card>
  );
}
```

`cn` is the class merger used throughout the kit — `clsx` + `tailwind-merge`.

## What's in it

**Primitives** (`components/ui`) — accordion, alert, alert-dialog, avatar, badge, breadcrumb,
button, button-group, card, carousel, command, dialog, dropdown-menu, hover-card, item, kbd,
menubar, navigation-menu, pagination, popover, progress, resizable, scroll-area, separator, sheet,
sidebar, skeleton, sonner, spinner, status-dot, table, tabs, toggle, toggle-group, tooltip.

**Composed** (`components/ui-extended`) — layout and navigation (`NavHorizontal`, `NavVertical`,
`TabbedPanel`, `PanelStack`, `PanelBox`, `Toolbar`, `TreeView`, `ContextBar`, `FilterBar`,
`SectionHeader`, `RecordHeader`, `EmptyState`, `Tour`), charts and readouts (`BarChartH`,
`BarChartV`, `DivergingBar`, `Sparkline`, `HeatStrip`, `Legend`, `MetricTile`, `TaskGantt`,
`TimelineList`, `PropertyList`), and the Invana-domain composites (`ChatSession`, `EmissionCard`,
`CitationList`, `ProposalCard`, `DiagnosisCard`, `ClarifyCard`, `CannotAnswerCard`, `AgentChip`,
`BoundChip`, `TaskNode`, `Terminal`, `DiffList`, `ClampedText`, `RichSelect`).

**Typography** (`components/typography`) — exported both individually as `TypographyH1` …
`TypographyPre`, and as a `Typography` namespace object:

```tsx
import { Typography, TypographyH1 } from '@invana/ui';

<TypographyH1>Runs</TypographyH1>
<Typography.Lead>Everything that ran today.</Typography.Lead>
```

`H1`–`H6`, `P`, `Lead`, `Large`, `Small`, `Muted`, `Blockquote`, `Code`, `List`, `Pre`.

Also exported: `cn` and the `useOverflowItems` hook.

## Type scale

Three rungs — `base` · `sm` · `xs` — and the root is the only dial.

Components declare no font size: default text inherits the root. Text that is deliberately
subordinate — a count, a timing, a row's subtitle — uses `text-sm`, and the genuinely small uses
`text-xs`. Setting `html` to 13px gives you an application (13 / 12 / 11); 16px gives you a site
(16 / 14.8 / 13.5), and every component follows, because each step is a ratio of the root.

There is no `text-meta`. It was a third name over the same 12px as `text-xs`, while `text-sm` was an
alias of `base` — four class names over two sizes, with `text-sm` not meaning small. Retiring it was
a 1:1 rename, so no pixel moved.

## Documentation

Every component has a Storybook story. From the monorepo root:

```bash
pnpm --filter @invana/stoybook dev
```

## License

MIT © Ravi Raja Merugu
