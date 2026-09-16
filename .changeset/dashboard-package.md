---
"@invana/dashboard": minor
"@invana/ui": minor
---

`@invana/dashboard` — a dashboard assembled from JSON, and `TaskNode`.

**`Dashboard`** takes a `DashboardSpec` and renders it. The spec says what bands there are, what kind
each is and what data it carries; the component decides layout and nothing else. That split is the
point: one component renders a run, a step, a plan and a draft, so a seventh surface is a new
document rather than a new screen.

Eleven built-in panel kinds — `metrics` · `properties` · `json` · `code` · `exchange` · `gantt` ·
`table` · `log` · `list` · `params` · `text` — each composed from kit components. `title` is what
puts a panel in a `PanelBox`; without one it renders bare, which is how a strip of tiles sits
directly on the dashboard. `flush` drops the box padding so a table or a canvas meets the border.

**Behaviour is not in the spec.** Actions carry an `id` and come back through `onAction`; a Gantt
row's selection, a list row's click and a parameter edit all arrive through the same seam. So a spec
can be fetched, stored beside a plan as `dashboard.yml`, diffed between two runs, and handed to a
renderer that has never heard of the record it describes.

**`@invana/canvas` arrives through the registry, not an import.** A consumer registers
`{ canvas: MyPanel }` and types the spec as `DashboardSpec<{ canvas: CanvasOptions }>`. Keeping it
out of the package means PixiJS stays out of the bundle of every consumer that only wanted tiles and
a log.

The spec is **parametrised by its registry** rather than carrying a `kind: string` catch-all. A union
with one permissive member checks nothing — a `gantt` panel full of invalid statuses compiled and
rendered empty tracks before the type was fixed. With the registry as a type argument, built-in
options are checked and an unregistered kind is a compile error. `AnyDashboardSpec` is there for a
spec off the wire, where nothing can be checked anyway.

**`TaskNode`** (`@invana/ui` › `ui-extended/task-node`) — one task in a flow, as a card: status dot,
mono `step_key`, `BoundChip`, tags, and a line of meta. The same card serves three renderings — a run
paints status, a plan paints medians, a draft paints handles — so the three views cannot drift into
three pictures of the same graph. Presentational: it knows nothing about a canvas, which is why it
lives here rather than in `@invana/canvas-ui`.

**Consumers must add the package to their Tailwind sources**:

```css
@source "../node_modules/@invana/dashboard/dist/**/*.js";
```

Without it, every class the dashboard uses that no other kit package happens to use is **never
generated** — the page renders, mostly correctly, with a handful of rules silently missing. It cost
three wrong fixes here before the cause was found, because a missing utility looks exactly like a
CSS specificity problem.
