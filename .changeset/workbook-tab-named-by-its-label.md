---
"@invana/ui": patch
---

A closable tab is named by its label alone. Its `×` is now a sibling of the tab inside one box rather than a child of it, so a `Workbook` tab reads as "Funding", not "Funding Close Funding", and no button is nested in a tab. The `×` stays reachable by its own name ("Close Funding"); the look is unchanged.
