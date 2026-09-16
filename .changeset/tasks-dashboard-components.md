---
"@invana/ui": minor
"@invana/forms": minor
"@invana/editor": minor
---

The Tasks dashboards — the `mainSection` for a TaskRun and a Task.

Four new components and three extensions, taken from the six artboards on page 4 of *The Tasks
Panel* canvas (the run dashboard, three step dashboards, the plan dashboard and a task's
parameters). One story each.

**New**

- `PanelBox` (`@invana/ui`) — one band of a dashboard: a bordered box with a label bar over it,
  content-height and owning no scroller, so a column of twenty does not nest twenty scrollers.
  `aside` is the fact on the right; `flush` drops the body padding so a table or a canvas meets the
  border. Distinct from `PanelContent`, which fills its parent, owns a scroller, drops its border and
  types its right slot as nav items.
- `RecordHeader` (`@invana/ui`) — which record a surface is showing: a status dot, mono crumbs whose
  last is the record and whose earlier ones are muted, chips, and actions.
- `BoundChip` (`@invana/ui`) — what a task may spend, as a swatch and a name. Nine bounds, one fixed
  hue each. The name is always rendered; the swatch never carries the meaning alone.
- `ParamRow` (`@invana/forms`) — one parameter of a task: name and type, a source select
  (`literal` · `argument` · `binding`) joined to the value input, and a note or error. Takes a
  descriptor rather than children, because the form is generated from a catalogue contract.

**Extended**

- `MetricTile` gains `tone` (tints the value) and `meter` (a 4px bar, `0`–`1`, only for a value with
  a real ceiling). **Its label and value are re-based**: the label is now caps and tracked, like every
  other label that titles something (see `Eyebrow`), and the value is mono at `text-lg`, because
  proportional digits make `1,880` and `2 / 5` sit at different widths and a strip of six stops
  reading as one row of numbers. Padding goes to 10/12 and `MetricGrid` takes a `gap`, so a tile
  strip keeps the rhythm of the surface it sits in rather than its own tighter one. Every existing
  `MetricTile` changes appearance.
- `CodeBlock` gains `json` in `CodeLanguage` and `maxHeight`, which caps the block and scrolls inside
  CodeMirror rather than on the wrapper.
- `TerminalLine` gains `level` and `levelColumn`, tinting exactly one cell so a run's log reads
  `time · LEVEL · source · message` without a wall of coloured prose. Setting `level` drops the
  `kind` marker.
