---
"@invana/ui": patch
---

An icon-only nav item now carries its own accessible name.

`NavItems` renders `item.name` into a `TooltipContent`, which is not a label
and is not in the tree until hover — so every icon-only control built on it
(the `PanelStack` header actions, the left rail) reached a screen reader as an
unnamed button, and a test could only find one by position. When an item
renders no visible `label`, its control now gets `aria-label={item.name}`: the
name it already had, in the place that makes it one.
