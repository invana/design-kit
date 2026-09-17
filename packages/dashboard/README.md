# @invana/dashboard

A dashboard is **data**. This package takes a JSON-serialisable `DashboardSpec` and renders it
from `@invana/ui` panels — so one component covers many screens, and a spec can be fetched from
an API, stored beside a plan as `dashboard.yml`, and diffed between two runs.

```bash
pnpm add @invana/dashboard
```

## Peer dependencies

```bash
pnpm add @invana/ui @invana/styling @invana/forms @invana/editor react react-dom
```

Styles come from `@invana/styling` — see [its README](../styling/README.md) for the Tailwind v4
import order.

## Usage

The spec says what bands exist, what kind each is and what data it carries. The component decides
layout and nothing else.

```tsx
import { Dashboard, type DashboardSpec } from '@invana/dashboard';

const spec: DashboardSpec = {
  header: {
    tone: 'success',
    crumbs: ['orders.csv → Brokerage.Order', 'import_dataset'],
    chips: [{ label: 'succeeded', tone: 'success' }],
    actions: [{ id: 'more', icon: 'more', variant: 'ghost' }],
  },
  rows: [
    {
      panels: [
        {
          kind: 'metrics',
          options: {
            tiles: [
              { label: 'Status', value: 'ok', caption: 'first attempt', tone: 'success' },
              { label: 'Duration', value: '3.4s', caption: '72% of the run' },
            ],
          },
        },
      ],
    },
    {
      panels: [
        {
          kind: 'json',
          title: 'result.json',
          options: { value: { written: 1204, dataset_id: 'ds_9f2c' } },
        },
      ],
    },
  ],
};

<Dashboard spec={spec} onAction={(id, ctx) => console.log(id, ctx)} />;
```

### Behaviour is not in the spec

A function is not JSON, so actions carry an `id` and come back through a single
`onAction(actionId, ctx)`. `ctx` tells you which panel it came from and, where the panel has a
selection, what was selected (`taskKey`, `itemId`, `param`, `option`).

Icons are passed in by name via the `icons` prop — the spec only ever carries the string. Unknown
names render nothing, so this package pulls in no icon set of its own.

## Built-in panel kinds

`metrics` · `properties` · `json` · `code` · `exchange` · `gantt` · `table` · `log` · `list` ·
`params` · `text`

A panel with a `title` is wrapped in a `PanelBox`; without one it renders bare, which is how a
tile strip sits directly on the surface.

## Extra panel kinds

A dashboard's type is **parametrised by its registry**, which is how the built-in kinds stay
type-checked. Register a kind by saying what its options are:

```tsx
import { Dashboard, type DashboardSpec } from '@invana/dashboard';

type Extra = { canvas: { nodes: MyFlowNode[] } };

const spec: DashboardSpec<Extra> = { rows: [{ panels: [{ kind: 'canvas', options: { nodes } }] }] };

<Dashboard<Extra> spec={spec} registry={{ canvas: MyFlowPanel }} />;
```

`@invana/canvas` arrives this way rather than as an import, so PixiJS stays out of the bundle of
every consumer that only wanted tiles and a log.

For a spec arriving off the wire, where nothing can be checked anyway, use `AnyDashboardSpec`.

## Exports

`Dashboard`, the panel components (`MetricsPanel`, `PropertiesPanel`, `JsonPanel`, `CodePanel`,
`ExchangePanel`, `GanttPanel`, `TablePanel`, `LogPanel`, `ListPanel`, `ParamsPanel`, `TextPanel`),
`SpecChip(s)` / `SpecAction(s)`, `BUILT_IN_PANELS`, `resolveRegistry`, and the spec types.

## License

MIT © Ravi Raja Merugu
