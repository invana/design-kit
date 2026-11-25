---
"@invana/boards": patch
"@invana/ui": patch
---

A board panel says what it knows about itself: `footer` is one muted line under it (when its data was read, where, how long), `mark: "added" | "changed"` draws a chip and an accent edge while it is news, and `reading` draws skeleton lines with no renderer mounted until its data is in. A panel in a `fill` row now stretches to the row, so its body has the row's height. `PanelBox` takes a `footer`.
