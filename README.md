# @invana/boards

A board is **data**. This package takes a JSON-serialisable `BoardSpec` and renders it
from blocks (`@invana/blocks`) and a few panels only a board has — so one component covers
many screens, and a spec can be fetched from an API, stored beside a plan as `board.yml`, and
diffed between two runs. A panel of a block kind is drawn from the same JSON a conversation turn
is.

```bash
pnpm add @invana/boards
```

## Peer dependencies

```bash
pnpm add @invana/blocks @invana/ui @invana/charts @invana/tables @invana/styling @invana/forms @invana/editor react-hook-form react react-dom
```

Styles come from `@invana/styling` — see [its README](../styling/README.md) for the Tailwind v4
import order.

## Usage

The spec says what bands exist, what kind each is and what data it carries. The component decides
layout and nothing else.

```tsx
import { Board, type BoardSpec } from '@invana/boards';

const spec: BoardSpec = {
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
          kind: 'grid',
          options: {
            tiles: [
              { label: 'Status', value: 'ok', delta: 'first attempt', tone: 'good' },
              { label: 'Duration', value: '3.4s', delta: '72% of the run' },
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

<Board spec={spec} onAction={(id, ctx) => console.log(id, ctx)} />;
```

### Behaviour is not in the spec

A function is not JSON, so actions carry an `id` and come back through a single
`onAction(actionId, ctx)`. `ctx` tells you which panel it came from and, where the panel has a
selection, what was selected (`taskKey`, `itemId`, `param`, `option`). A block panel sends the
block's own action with what it carries as `value` — a `table` row picked is
`onAction('select', { panelId, value: <rowKey value> })`, a `form` submitted is `reply`.

Icons are passed in by name via the `icons` prop — the spec only ever carries the string. Unknown
names render nothing, so this package pulls in no icon set of its own.

## Panel kinds

- **Every block kind** (`BLOCKS` in `@invana/blocks`): `options` are the block's options,
  checked against `BlockOptionsByKind`. The block draws bare; the panel's `title`, `aside` and
  `absent` frame it. A kind with no renderer yet is a labelled placeholder.
- **Panels only a board has:** `json` · `code` · `exchange` · `log` · `list` · `params` ·
  `text`.

Every panel is drawn in a `PanelBox`, as an answer card frames every block, so one spec draws the
same in a board and a conversation. `title` adds the label bar; `flush` drops the padding.

### From the old panels

| Was | Now | Changes |
| --- | --- | --- |
| `metrics` | `grid` | `caption` → `delta`; `meter: n` → `gauge: { value: n, max: 1 }`; `tone` is `good`/`bad`/`warn`/`neutral` and colours the `delta` (`running`, `info` are gone; `flag` marks the tile to look at) |
| `properties` | `record` | `mono` defaults to `true` as before; `labelWidth` is gone |
| `table` | `table` | Columns set `mono: true` (the default is now off); `selectAction` is gone — a pick is `select` with `{ panelId, value }` |
| `gantt` | `gantt` (a block) | A conversation draws it too, so it is a block. `selectedKey` → `selected`; `selectAction` is gone — a pick is `select` with `{ panelId, value }` (the task's key, which was `taskKey`); a task's `subtasks` nest under it |

## Extra panel kinds

A board's type is **parametrised by its registry**, which is how the built-in kinds stay
type-checked. Register a kind by saying what its options are:

```tsx
import { Board, type BoardSpec } from '@invana/boards';

type Extra = { canvas: { nodes: MyFlowNode[] } };

const spec: BoardSpec<Extra> = { rows: [{ panels: [{ kind: 'canvas', options: { nodes } }] }] };

<Board<Extra> spec={spec} registry={{ canvas: MyFlowPanel }} />;
```

`@invana/canvas` arrives this way rather than as an import, so PixiJS stays out of the bundle of
every consumer that only wanted tiles and a log.

A registered kind wins over a block of the same name, at runtime and in the types: `RUN_PANELS`
registers its own `trace`, which replaces the `trace` block on that board.

For a spec arriving off the wire, where nothing can be checked anyway, use `AnyBoardSpec`.

## Exports

`Board`, `BlockPanel` and `BLOCK_PANELS`, the panel components (`JsonPanel`, `CodePanel`,
`ExchangePanel`, `LogPanel`, `ListPanel`, `ParamsPanel`, `TextPanel`), `RUN_PANELS`,
`SpecChip(s)` / `SpecAction(s)`, `BUILT_IN_PANELS`, `resolveRegistry`, the spec types, and the
parts only a board draws: `RecordDescription` (the line under the header), `StagedBar` (`spec.staged`)
and `AttemptClock` (the `attempts` run panel). They moved here from `@invana/ui`.

## License

MIT © Ravi Raja Merugu
