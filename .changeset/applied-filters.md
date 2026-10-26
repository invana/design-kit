---
"@invana/ui": patch
---

`AppliedFilters` shows the filters narrowing a list right now — one read-only chip per filter with its ×, an optional `Clear all`, and `set by …` when someone else (the assistant) applied them. `FilterChip` gains `readOnly`: text, not a button — no caret, no menu, the value on a primary tint — with the × as its only control.
