---
"@invana/themes": minor
---

`AppLayoutV2`: a folded rail no longer hides the tree. With `leftNav.expanded === false` and a `leftSection`, activating a rail item opens the `leftSection` in its own column beside the rail, and main gives way as it does for the open rail; Escape or the lit item again closes it, and the rail's expand control keeps it open. The nav stays the single place that holds the selection and the expanded state. On the open rail the lit item again hides the tree column, and any item shows it.
