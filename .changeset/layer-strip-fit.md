---
"@invana/ui": minor
"@invana/dashboard": minor
---

`LayerStrip` gains `fit` — the overview reading, where the whole axis fits the strip's own width.

A strip in a narrow column used to scroll past its first steps, because the track kept a floor of
`minTrackWidth` or `ticks × minSlotWidth` and the label column a fixed `labelWidth`. With `fit` the
track has no floor, the label column takes at most 30% of the width, and each axis label is clipped
to its own slot, so every step stays in view while the panel is resized. A bar narrower than its name
truncates; its hover card still carries the rest.

Without `fit` is the expanded reading, and it now sizes the track from its **shortest bar**: wide
enough that the briefest span is drawn at the bar's readable width (4.5rem), up to the new
`maxTrackWidth` (240rem), and never under the old `minTrackWidth` / `minSlotWidth` floors. A long run
with short steps scrolls so each step can be read, rather than clearing a fixed floor and
squeezing them.

`@invana/dashboard`: a titled panel takes `actions`, drawn on the right of its header after `aside`
and dispatched with `{ panelId }` — so a panel can offer a reading of itself, such as a `Fit`
switch. An `ActionSpec` with `pressed` draws as a labelled `Switch` and dispatches `{ pressed }`.
`LayersOptions` passes `fit` through.
