---
"@invana/ui": minor
---

`StatusIcon`, and `RunRow` draws with it.

A glyph in a circle for the rows where the state is not written beside it: `success` check ·
`error` cross · `running` spinning loader · `queued` clock · `waiting` pause · `question` ·
`alert` · `cancelled` slash. The shape carries the state as well as the colour, so the word can
go. `runStatusIcons` maps the engine's run statuses onto it.

`RunRow` now leads with the title — what the run was about — and moves the address to the head
of line two. `tone` is replaced by `state` (a `StatusIconState`), `titleMono` draws a query in
monospace, and `KnownRunStatus` gains `awaiting_input` and `partial`.
