---
"@invana/styling": patch
---

`@invana/styling/color` gives any string a default colour from the data palette.

`colorSlotByString(name)` hashes a name to one of the eight `--color-data-N` slots; `colorVarByString`
returns that slot as a CSS `var(…)`, and `colorByString` resolves it against the live theme for surfaces
that need a concrete value, such as a canvas. Same name, same colour, on every surface and across reloads.
