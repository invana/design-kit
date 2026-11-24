---
"@invana/ui": patch
---

`NavVertical`: icons stay at the same height whether the rail is open or folded. Each group's head is one height in both states: its label when open, a short rule when folded. When folded, an item whose `count` has a `countTone` shows a dot of that tone on its icon. On a vertical `nav` strip, the active item also gets a 2px primary bar on its leading edge. New story: `OpenAndFolded`.
