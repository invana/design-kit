---
"@invana/ui": minor
---

`Table` takes `bordered` (default `true`). Set it to `false` for a table that sits directly in a panel's column: the outer box goes and the row rules stay. `CastTable` passes it through.

Panel rows and headers share one 12px inset: `SectionHeader` and `LensRow` are `px-3`, and `RunRow` uses `px-3` with its depth added as `--row-indent` rather than an inline `paddingLeft`.
