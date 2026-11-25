---
"@invana/boards": patch
"@invana/styling": patch
"@invana/ui": patch
---

A board takes the full height and width of its parent, never of the window, and a `fill` row never shrinks below `--spacing-board-fill` (320px at the 13px root): on a shorter board the body scrolls, so a canvas in that row never collapses.
