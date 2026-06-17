---
"@invana/forms": minor
---

Add full-size form support to the schema-driven generator and a `textarea` field type.

- `ObjectField` (and the `Field.*` renderers) now accept a `size` prop (`'sm' | 'md'`). `sm` keeps the existing compact look (`h-8` inputs, `text-sm`/`text-xs`) and remains the default for backward compatibility; `md` renders full-size fields for primary, page-level forms.
- New `textarea` `FieldType` with an optional `rows` on `FieldConfig`, plus a `TextareaField` renderer (exported and on `Field.Textarea`).
- Removed the baked-in `md:text-sm` from the `Input` primitive so inputs default to `text-base` on all breakpoints. The compact `sm` field variant re-applies `text-sm` explicitly.
