# @invana/charts

Every chart Invana draws: the time series on the Plan and Model pages, the marks that sit inside
a table row, and the provisional charts that moved here from `@invana/ui`.

This package exists because the time series are built on [uPlot](https://github.com/leeoniya/uPlot),
an external library. Following the kit's placement rule, anything that needs an external JS
library gets its own package, so a consumer that only wants a button never pays for a chart
engine. The dependency points one way: `@invana/charts` imports from `@invana/ui`, and
`@invana/ui` neither depends on nor re-exports it.

```bash
pnpm add @invana/charts
```

Peer dependencies: `@invana/ui`, `@invana/styling`, `@invana/tables`, `react`, `react-dom`.
`uplot` ships as a direct dependency.

## Setup: Tailwind v4 import order

The charts use kit tokens and Tailwind utilities, so your stylesheet must compile the
`@invana/styling` theme and scan this package for classes:

```css
@import "tailwindcss";

@source "../node_modules/@invana/ui/dist/**/*.js";
@source "../node_modules/@invana/tables/dist/**/*.js";
@source "../node_modules/@invana/charts/dist/**/*.js";

@import "@invana/styling/index.css";
```

1. `tailwindcss` comes first.
2. Then your `@source` globs, with this package among them.
3. Then `@invana/styling`.

Importing `@invana/styling` is what gives you `--color-data-1…8`, the status tokens and the
`--text-*` type ladder. The charts read all three. No uPlot stylesheet is needed: the few rules
uPlot needs are installed once at runtime.

## What's in it

| Component | Engine | For |
|---|---|---|
| `LineChart` | uPlot | One measure over time, such as work p50 or p95 a day. It can carry event `marks` and a `reference` line. |
| `StackedBarChartV` | uPlot | Counts a day split into parts: runs served and failed, or queries by caller. |
| `StackedAreaChart` | uPlot | Totals over time by part, with stepped paths, such as records by model or by type. |
| `Sparkline` | SVG | The shape of a series inside a row. |
| `InlineMeter` | DOM | A share as a bar plus its value, in a table cell. |
| `SegmentedBar`, `SegmentedBarLegend` | DOM | One row's total split into categories, with one legend per table. |
| `BarChartH`, `BarChartV`, `DivergingBar`, `HeatStrip` | DOM/SVG | Provisional: moved as-is and not yet used by a design. |

`MetricTile`, `MetricGrid`, `Legend` and `Progress` stay in `@invana/ui`, and the charts here
compose them.

### Why some charts use uPlot and others DOM/SVG

- **uPlot, for the time series.** A 30-to-90-day series with a crosshair, hover, marks and a
  redraw on every resize or theme change is what a canvas engine is for. uPlot is small and
  fast, and owns scales, hit-testing and the cursor. Everything read as text stays DOM,
  composed from `@invana/ui`:
  - period ticks
  - the tooltip (`Card` + `Eyebrow`)
  - the legend (`Legend`)
  - the table view (`DataTable`)

  So chart text sets in the same type as the panel around it and never scales with the canvas.
- **DOM/SVG, for marks in a row.** A sparkline, meter or segmented bar repeats dozens of times
  down a list. Each is a handful of elements, so a canvas per row would cost more than it
  draws, and it would not inherit the row's type, colour or selection state.

## Usage

```tsx
import { LineChart, StackedBarChartV, StackedAreaChart } from '@invana/charts';

<LineChart
  values={p95}                     // (number | null)[] — null breaks the line
  labels={days}
  format={(v) => `${v.toFixed(1)}s`}
  marks={[{ index: 17, label: 'import' }]}
  reference={{ value: 1.4, label: 'Graph p95' }}
/>;

<StackedBarChartV
  data={days.map((label, i) => ({ label, values: { served: served[i], failed: failed[i] } }))}
  series={[
    { key: 'served', label: 'served', color: 'var(--color-success)' },
    { key: 'failed', label: 'failed', color: 'var(--color-destructive)' },
  ]}
/>;

<StackedAreaChart
  data={growth}
  series={models}                  // fixed order; colour follows the model, not its rank
  marks={writes}
  markLegend="a write — an import or a stitch commit"
/>;
```

Colours are always tokens (`var(--color-data-3)`, `var(--color-success)`), never literal
values. The status tokens are only for series that *are* a status.

## The chart base

Every uPlot chart sits on one internal frame, which does the following:

- **Sizes to its container** with a `ResizeObserver` and draws at its real width, so axis text
  is never stretched.
- **Resolves tokens** with `getComputedStyle`, since a canvas cannot read `var()`. It resolves:
  - `--color-data-1…8`
  - `--color-success`, `--color-warning`, `--color-destructive`
  - `--color-foreground`, `--color-muted-foreground`, `--color-border`, `--color-card`
  - the `--text-*` sizes
- **Redraws on a theme, mode or density change** without a reload. A `MutationObserver` watches
  `class`, `style`, `data-theme` and `data-density` on `<html>`, and a listener catches the OS
  colour scheme flipping under a `system` theme.
- **Shares its parts** between the charts:
  - a hover tooltip that reads the nearest period (arrow keys do the same on focus)
  - event marks: a dashed rule with its label at the top, because a mark is an event, not a value
  - a reference line: a dashed rule with its label to the right of the plot
  - a hover target the size of the whole period's slot, not the painted mark
- **Is accessible.** It gives an `aria-label` summary, plus a "View as table" toggle that shows
  the same data in `@invana/tables`' `DataTable`.
- **Keeps the legend inside the chart.** The legend and toggle are in the chart's own flow, so a
  parent never clips them. `height` is the plot's height; ticks and legend sit below it.

## Floors

These hold on every chart, so a thin window never draws a false picture:

- **A count axis never tops out below 5.** One run on a quiet day is a short column, not a
  full-height one.
- **Axes step cleanly.** A ceiling is 2–4 steps of 1, 2 or 5 × 10ⁿ, so a busiest day of 51
  reads 0 · 20 · 40 · 60. Line charts keep headroom above their highest value.
- **Bars are at most 24px wide**, with a 4px rounded data end, a square baseline end, and a 2px
  surface gap between stacked segments.
- **A single point draws a point**, centred on an axis from zero, not on an edge.
- **A null period breaks the line** rather than dropping it to zero, because *nothing ran* is not
  *it took no time*. A measured day between two gaps draws as a point.
- **An all-zero window shows that it is empty**, not a chart of zeros pretending to be data.
- **Direct labels are dropped rather than stacked when they would collide.** The legend is
  always there for two or more series.

## License

MIT © Ravi Raja Merugu
