---
"@invana/ui": patch
"@invana/tables": patch
"@invana/forms": patch
---

Shell pieces for the new Invana UI. `NavVertical` takes `groups` and becomes a views column: a `header` (title, buttons, a slot under them), labelled groups, a `count` per view, `activeKey`, and `collapsed` with `onCollapsedChange` to fold it to a 56px icon rail. `TreeView` items take `meta` (a right-aligned count), `tone` (a status dot) and `group` (a header over the top-level items that share it). The tables take `selection` (`count`, `actions`, `onClear`): with any rows picked, the toolbar reads *n picked*, the actions and Clear. `PropertyRow` takes `meta`, a muted fact after the value. New in `@invana/forms`: `FileDrop`, an upload drop area that checks `accept` and `maxBytes` on a drop too and names each refused file.
