---
"@invana/ui": minor
---

`LayerStrip` is a gantt: time across, the participants it spends down.

The first cut headed one column per task and drew a dot where a task met a layer. Two things were
wrong with that. A task name along the top cannot say how long anything takes, and it forces a
column per task whether or not the task engages anything. And a band alone cannot say **which**
participant a step reaches — `llm` is not an answer to *which model decides this*, and that list is
what a world is checked against.

So the drawing turns: **time is the x axis, a participant is the row, and a task is a bar** written
once where it sits.

**The shape**

- `bands: LayerBand[]` — one per layer, each opening into `parts`: `role: decide`,
  `model/Orders@v2`, `third_party/app/email`, with a `note` for what the caller still owes or what
  the crossing is. A band is dim only when neither it nor its parts carry anything.
- `items: LayerItem[]` — a task, its `layer`, the `part` it spends, and `start`/`end` in the axis's
  own unit. No `end` is an instant, drawn at the minimum width; a bar near the end of the axis
  anchors to its own end so it grows inwards rather than off the track.
- `scale` — `"seq"` reads a plan's order, `"elapsed"` a run's wall clock. One component, two
  tenses, so *declared versus touched* is a comparison rather than two vocabularies to learn.
- `brackets` — a bounded repetition over the stretch of time it owns.
- `collapsed` / `defaultCollapsed` / `onCollapsedChange` — the bands whose participants are folded
  away. A shut band keeps its tasks: they drop onto its own line, so the folded strip is six lines
  with every task still placed in time, and `collapse all` in the header does the lot. Folding moves
  a task up a row, it never drops it.
- `domain` · `ticks` · `formatTick` · `labelWidth` · `minTrackWidth` · `minSlotWidth` for the axis
  and the gutter — past `minSlotWidth` the strip scrolls rather than squeezing a bar too narrow to
  carry its task's name.

**What is kept.** Refusals are struck in place and never filtered out; `skipped` stays a third state
beside them; the `agent` spine is always drawn with its wire; the labels freeze while time scrolls.

**Breaking.** `steps: Step[]` and `onSelectStep` are gone, and with them the `Step`/`StepTouch`
types. A caller projects its ledger into `items` instead and picks a `scale`. `TouchDirection`
survives as the run half of `LayerItemState`, which adds `declared`.

Three stories, because one component with two tenses and two readings is not shown by one:
`default` draws a plan on the step axis, `touched` draws a run on the wall clock with two refusals
and a skip, and `collapsed` draws twelve participants folded into six lines.
