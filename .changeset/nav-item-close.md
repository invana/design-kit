---
"@invana/ui": minor
---

A nav item can carry an inline close button.

`NavItemConfig.onClose` draws an `×` inside the item, labelled
`Close <name>`. The body still selects; only the `×` closes — the same split
the `caret` menu trigger makes. A tab that has nothing to manage but its own
closing uses this instead of a one-row caret menu.
