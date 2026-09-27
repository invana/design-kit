---
"@invana/ui": patch
"@invana/forms": patch
"@invana/tables": patch
"@invana/editor": patch
"@invana/dashboard": patch
---

The packages lint clean. `useIsMobile` reads the viewport with `useSyncExternalStore`, so it is right
on the first render; `SliderNumber` and `ColorSwatches` take a new `value` while rendering rather than
in an effect; refs are synced after commit, never mid-render; the typography props are type aliases
of the same names. No API changes.
