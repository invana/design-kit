---
"@invana/forms": minor
---

The generator has three more field types. `date` is a day held as `YYYY-MM-DD`. `file` is a drop area whose value is a `File[]`, with `accept`, `maxBytes` and `multiple`, and its label points at the file input. `custom` draws any control you give it through `render`, with the generator's label, help text and error around it. `FileDrop` takes an optional `id`.
