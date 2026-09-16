---
"@invana/ui": patch
---

`ClampedText` — prose that shows its first few lines and offers the rest in place.

A project's purpose, an agent's instructions, a dataset's note: text whose first sentence is
what a panel is *for*, and whose full length would push the list under it off the screen. It
clamps to `lines` (three by default) and expands where it stands — not into a tooltip or a
dialog, because the reader is already looking at the right place.

The toggle only exists when there is something behind it, and that is **measured** rather than
guessed from a character count: three lines in a 320px panel is one line in a wide one, and a
`Show more` that reveals nothing teaches the reader to stop pressing it. Re-measured on resize
for the same reason, and only while clamped — expanded, `scrollHeight === clientHeight` by
definition, and measuring there would retract the button that got you there.
