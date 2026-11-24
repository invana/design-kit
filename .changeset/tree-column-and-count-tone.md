---
"@invana/ui": patch
---

`TreeView` fills a shell's tree column: `variant="column"` draws it flat and full height with rows indented 14px a level, `activeId` lights the open row (`aria-current`), and `expanded` / `defaultExpanded` with `onExpandedChange` hold which branches are open, in the same `ExpandedKeys` shape as `DataTable` and `Gantt`. Items take `metaTone` (amber *staged*, red *end gone*), `title` (a tooltip) and `href` (the row is a link; `onClick` also gets the event to `preventDefault` it). `groupMeta` puts a fact on a group's header and `searchPlaceholder` names the filter; while a filter is typed every branch shows open, so no match hides in a shut one. Nav items take `countTone` to colour their `count`, such as an amber *15 drift*. Both tones come from one map, `toneText` (`TextTone`), exported for any short fact coloured by tone.
