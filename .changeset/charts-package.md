---
"@invana/charts": minor
"@invana/ui": minor
---

`@invana/charts` is a new package holding every chart Invana draws. `@invana/ui` no longer ships
any chart.

**Moved from `@invana/ui`:** `LineChart`, `StackedBarChartV`, `Sparkline`, `BarChartH`,
`BarChartV`, `DivergingBar` and `HeatStrip` now import from `@invana/charts`. `MetricTile`,
`MetricGrid`, `Legend` and `Progress` stay in `@invana/ui`.

**Rebuilt on uPlot:** `LineChart` and `StackedBarChartV` keep their props.
- They size to their container and redraw in the current tokens when the theme or density
  changes.
- They share a tooltip, event marks, an `aria-label` summary and a "View as table" toggle.
- `LineChart` gains `reference`, a dashed rule labelled at the right.
- Both gain `empty`, shown in place of a window with nothing in it.

**New:**
- `StackedAreaChart`: totals over time by part, on stepped paths, with direct labels and marks
  for the writes that moved them.
- `InlineMeter`: a share as a bar plus its value in a table cell.
- `SegmentedBar` and `SegmentedBarLegend`: one row's total split into categories, with one
  legend per table.

**Floors:**
- A count axis never tops out below 5.
- Bars are at most 24px wide.
- A single point draws as a point.
- A null period breaks the line.
- An all-zero window says it is empty.
