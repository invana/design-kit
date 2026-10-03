---
"@invana/boards": patch
"@invana/editor": patch
---

An action can be a **menu**: `menu: true` puts an action's `options` behind its own button — `⋯`
opening `Versions · Arguments · Export YAML` — and each item dispatches `{ option }`. With an `icon`,
the button draws the icon alone and `label` is its accessible name. Story: *D13 Action · a menu
behind ⋯*.

`CodeBlock` highlights **YAML** (`language: "yaml"`), and the board's `code` panel accepts it.
Story: *Editor/CodeBlock · Yaml*.
