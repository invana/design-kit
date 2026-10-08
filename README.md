# @invana/blocks

Blocks: reusable drawings built from a JSON spec. The same spec draws in a conversation turn
(`@invana/assistant`), a board panel (`@invana/boards`) or a page, a report laid out as a
document. A block renders bare, with no card and no title; the shell around it adds the frame
and says what its actions mean.

```bash
pnpm add @invana/blocks
pnpm add @invana/ui @invana/charts @invana/tables @invana/styling react react-dom
```

## A block

```tsx
import { Block } from "@invana/blocks"

<Block
  spec={{ kind: "timeseries", unit: "rounds", series: [{ name: "Rounds", points: [["W1", 0], ["W2", 3]] }] }}
  onAction={(action) => console.log(action)}
/>
```

Every kind lives here (`BLOCKS` in `kinds.ts`); 24 have a renderer, the rest draw a labelled
placeholder with their JSON. `BlockOptionsByKind` types each one's options; `BLOCK_RENDERERS` maps a
kind to what draws it.

Every block takes the same props: `spec`, and for a block that returns a value `state` (`pending`
until answered) and `value`. Whatever the reader does comes back through `onAction(action, value?)`:
`reply` / `change` / `skip` from an ask, `open` from a table holding rows back, `prompt` from a
suggested question, `scope` with `{ part, value }`, or an action's own id. The shell says what
each means: the assistant turns them into conversation events, a board into panel actions.

## A page

```tsx
import { Page } from "@invana/blocks"

<Page
  spec={{
    title: "Top accounts that raised a round",
    sections: [
      { blocks: [{ kind: "narrative", text: "**9 of the top 50** raised in the last 90 days." }] },
      { title: "The accounts", blocks: [{ kind: "table", columns, rows }] },
    ],
  }}
  onAction={(action, at) => console.log(action, at.section, at.block)}
/>
```

Sections run top to bottom with no cards or borders; a section's title is its rule. A
conversation's long answer opens as a page with `answerToPage(turn)` from `@invana/assistant`.
