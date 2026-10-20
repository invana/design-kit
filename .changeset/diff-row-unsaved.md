---
"@invana/ui": patch
---

`DiffRow` draws a change not yet saved: `marker="chip"` puts the sign in a tinted square (amber for new or altered, muted for removed, ✎ for an edit), `description` adds a muted second line, `onActivate` makes the row a button, `actions` sit outside it, and `selected` marks the row picked.
