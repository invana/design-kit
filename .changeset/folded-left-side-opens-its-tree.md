---
"@invana/themes": minor
---

`AppLayoutV2`: a folded rail no longer hides the tree. With `leftNav.expanded === false` and a `leftSection`, activating a rail item opens the `leftSection` as a flyout beside the rail (Escape or a click outside closes it); the rail's expand control pins it open. The nav stays the single place that holds the selection and the expanded state.
