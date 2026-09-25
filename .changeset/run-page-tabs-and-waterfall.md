---
"@invana/ui": minor
"@invana/dashboard": minor
---

A run page reads as a report header over tabs, and its waterfall marks the loop and the gate.

- `TaskGantt` takes `brackets` (a loop, bracketed over its rounds) and `seams` (a gate, ruled across the time it held). Its label and duration columns take their content's width; `labelWidth` is now an override, not a default.
- `DashboardSpec` takes `tabs` — readings of one record under the shared header, controlled with `tab` + `tabAction` or kept by the dashboard itself — and `HeaderSpec` takes `crumbActions` (a crumb that links back) and `crumbMenu` (the last crumb opens a picker of its siblings).
