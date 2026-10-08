---
"@invana/blocks": patch
---

The `gantt` block's spec takes what `Gantt` does: a task's or bar's `result` is any `Record<string, unknown>` (nested values read as JSON in the hover card), and its `error` takes a `detail` under the message.
