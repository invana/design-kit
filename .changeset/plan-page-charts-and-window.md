---
"@invana/ui": minor
"@invana/dashboard": minor
---

Two charts for a record read over time, and a window that applies to every tab.

`StackedBarChartV` draws counts over days split into parts, such as served and failed runs. The
parts stack bottom-up with a 2px surface gap, only a column's top is rounded, and a day with nothing
draws nothing. Each column answers a hover with its day and each part's count. Axis labels are
sparse (`ticks`), and two or more series always carry a legend.

`LineChart` draws one measure over time, with `marks` (a dashed rule labelled at the top) for the
events that might explain it, such as a version being published. A `null` day breaks the line rather
than dropping it to zero. It draws at its measured width so its axis text is never stretched, and a
hover reads the nearest day.

`TabbedPanel` gains `headerContent`, a control on the right of the tab strip that applies to every
tab.

`@invana/dashboard`: `DashboardSpec.tabActions` puts `ActionSpec`s there, for example a
`7 · 30 · 90 days` switch. `TableOptions` gains `rowKey`, `selectAction` and `selected`: a picked
row dispatches `{ itemId }` with its `rowKey` value and is drawn selected.
