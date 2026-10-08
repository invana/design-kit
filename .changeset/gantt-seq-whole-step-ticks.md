---
"@invana/blocks": patch
---

A `seq` gantt marks whole steps. With no `ticks` set, a plan's axis takes one tick per step (or the most intervals up to 8 that divide a long plan evenly), and its span rounds up to a whole step, so a 3-step plan reads `step 0 · step 1 · step 2 · step 3` instead of repeating a step. `ticks` still wins when set.
