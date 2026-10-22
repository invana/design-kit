---
"@invana/forms": patch
---

A `keyvalue` field takes its known keys as `options` — each `description` the kind of value, shown as the value's placeholder — and *Add* lists the ones not set yet. `strictKeys` allows no other key; without it a key of one's own is typed and tagged `new`. Each key appears once: a repeat is refused at its row, and `uniqueKeys` keeps the form from submitting.
