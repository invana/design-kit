---
"@invana/styling": minor
"@invana/charts": minor
"@invana/ui": patch
---

The data palette is named by hue: `--color-data-blue`, `-orange`, `-aqua`, `-yellow`, `-magenta`, `-green`, `-violet`, `-red`, replacing `--color-data-1…8` (no alias); the Tailwind classes follow: `bg-data-violet`, `text-data-aqua`, `border-data-red/35`, replacing `bg-data-7` and the rest. It is declared `@theme static`, so every hue is emitted though no class names it; before, a hue the build never saw used was dropped and read as unset in light mode.

`@invana/styling/color` exports `DATA_HUES` (the slot order) and `dataVar(slot)`; `colorVarByString` and the charts' series colours use it.
