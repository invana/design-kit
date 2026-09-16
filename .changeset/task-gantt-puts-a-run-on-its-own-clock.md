---
"@invana/ui": minor
---

`TaskGantt` — where a run's time went, one row per task on the run's own clock.

Duration is the question a run detail is opened with, and a step list with a duration column
answers it one row at a time. A bar placed by start and sized by duration puts the slow task,
the retry and the branch that never ran in one glance. Nothing in the kit drew it: `BarChartH`
has no start offset and `TimelineList` has no duration.

It takes the trace's own shape — `task_key`, `status`, `started_at`, `finished_at`,
`duration_ms` — either as `startMs`/`durationMs` or as timestamps with an `origin`, so wiring it
to a run is a rename, not a transform. A retried task carries `attempts`, drawn as segments left
of the bar that stuck; a task that never ran has no segment at all and draws as an outline,
because a paler fill would read as "ran, but less".

A Task's detail is a **card on hover**, not a line under its row: `result` (an object renders as
label/value pairs, nested values as JSON; a node renders as given), `error`, `summary` and `log`
fill the default card, `TaskGanttDetailCard` is exported so a surface can compose around its
header, `task.detail` replaces one row's body and `renderDetail` replaces every row's. A line of
log per row doubled the chart's height and still carried one truncated sentence. The card is
supplementary by design — unreachable by touch, so nothing lives only in it.

One component across three surfaces, which is why `density` and `labelWidth` are
props rather than three drawings: the drawer compact with a line of log per row, the dashboard
full width with logs off, and the document rendering. `nowMs` threads a *now* line through every
row while a run is in flight and `openEnded` marks the axis `8s+` — a live run is the same
component with two more props, not a second view. `onSelectTask` makes the rows pickable, which
is what filters a log to one task.

Colour never carries state alone: every row states its duration, every bar titles itself with
its status, and the statuses are the engine's own (`succeeded` · `running` · `failed` ·
`needs_input` · `stopped` · `skipped` · `queued`), so a Gantt row and a log line say the same
word for the same state.
