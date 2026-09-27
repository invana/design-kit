---
"@invana/ui": minor
"@invana/dashboard": minor
---

A record being edited reads the way it is drawn: its description under the crumbs, what it has
staged, and which of its readings wait.

**New in `@invana/ui`:**
- `RecordDescription` puts a record's description on one line under its `RecordHeader`. `More`
  shows the whole description and its facts as a `PropertyList`, and `Less` folds them back.
- `StagedBar` shows what is staged and not yet published: a count, then each change with its sign
  spelled out and its own `×`, then `Discard all` and the shortcut that publishes.

**New in `@invana/dashboard`:**
- `header.description` and `header.details` draw a `RecordDescription` under the header.
- `staged` draws a `StagedBar` between the header and the tabs, on every tab. Its acts dispatch
  by id.
- A `locked` tab draws dimmed with a lock and cannot be picked.
- A `fill` row takes the height the tab has left, for a canvas.
- A segmented action honours `disabled`: a window control greys out on a tab it does not apply to.
