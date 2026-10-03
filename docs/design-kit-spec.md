# Design Kit Spec — plan

The [Design Kit Spec](https://claude.ai/artifact/VcN3AYgmbdCpHbxXZjMir5) is the one design reference
for blocks, charts and the shells that hold them.

**Rule for every item below: build the slice a real screen needs now.** Prefer a prop or an
optional slot on an existing component over a new component, and an existing package over a new
one. No "for later" props.

## Terms

One word per idea, spelled the same in code, docs, stories and the spec.

| Term | Means | Code |
|---|---|---|
| **block** | One reusable drawing, built from a JSON spec. Some return a value (a form, a choice), some only show data (a chart, a record). No sub-types. | `@invana/blocks`, `blocks/<kind>.tsx` |
| **kind** | A block's id, the key of its spec | `{ kind: "timeseries", … }`, `BlockKind` |
| **spec** | The JSON a block, a conversation or a board is drawn from | `BlockSpec`, `ConversationSpec`, `BoardSpec` |
| **part** | A plain component a block is built from. Knows nothing of blocks. | `@invana/ui`, `charts`, `tables`, `forms` |
| **shell** | What frames a block and says what its actions mean | `ChatSession` (answer and ask cards), `Board` (`PanelBox`) |
| **ask**, **answer** | The two kinds of turn in a conversation. An ask holds one block that returns a value; an answer holds blocks that show data. | `AskTurn`, `AnswerTurn` |
| **intent** | Why a turn uses a block. Conversation-only. | `ASK_INTENTS`, `ANSWER_INTENTS` |
| **pattern**, **flow** | The intents of one answer; the stages and asks of one analysis | `PATTERNS`, `FLOWS` |

Retired words: **preset** (say block, or kind for its id), **intent block**, **answer block**,
**ask preset**, **panel kind** for anything a block draws.

## Packages

The target layout. One new package, `@invana/blocks`; nothing else is added.

```
styling ─┬─ ui ─┬─ forms ─ tables ─ charts ─┐
         │      ├─ editor ──────────────────┼─ board
         │      ├─ themes                   │
         │      └───────────────────────────┴─ blocks ─┬─ assistant
         │                                             └─ board
```

| Package | Holds | Depends on |
|---|---|---|
| `@invana/styling` | Tokens, themes, type and control scales. CSS only. | — |
| `@invana/ui` | Parts: primitives and compositions | styling |
| `@invana/forms` | Form composition (`FormField.ObjectField`) | ui |
| `@invana/tables` | `DataTable` and its cells | ui, forms |
| `@invana/charts` | Every chart, bare and data-driven | ui, tables |
| `@invana/editor` | Rich text and code editors | ui |
| `@invana/themes` | App shells: `AppLayoutV2` and the rest | ui |
| **`@invana/blocks`** | **Blocks: `types.ts` (kinds and their option types), `registry.ts`, `block.tsx`, one file per kind** | ui, charts, tables, forms |
| `@invana/assistant` | The conversation shell: turns, intents, patterns, flows, envelope, streaming, cite focus | blocks, ui |
| `@invana/boards` | The board shell: rows, panels in `PanelBox`, header, tabs; every block kind as a panel; panels only a board has (`json`, `code`, `exchange`, `log`, `list`, `params`, `text`) | blocks, ui, charts, tables, forms, editor |

**Where a component goes**, in order, stopping at the first yes:

1. Needs an external JS library the others don't have → its own package (`editor`, `charts`).
2. Encodes numbers as marks → `charts`.
3. Rows and columns of records → `tables`.
4. Drawn from a JSON spec, in a conversation turn or a board panel → `blocks`.
5. Only meaningful in a conversation (turns, intents, the envelope) → `assistant`.
6. Only meaningful in a board (rows, panel layout) → `boards`.
7. Anything else → `ui`.

`blocks` holds every kind: the 24 with renderers, and the rest as kinds and option types that
draw a labelled placeholder. Assistant registers them from `blocks` through one adapter. Board
draws every kind in `PanelBox`: a panel's `options` are the block's, its title and aside are the
panel's, and a block's `onAction(action, value)` arrives as `onAction(action, { panelId, value })`.
A kind the consumer registers wins over the block of that name. **The shell always frames a
block:** the answer card in a conversation, a `PanelBox` on a board (every panel has one; a
`title` only adds its label bar). A block draws seamless and never its own border, so one spec
draws the same in both. No backward compatibility is kept.

## To do

- [x] **Rename to the terms above** in the grammar, protocol, registry, fixtures, stories and the
      spec: `ASK_PRESETS` + `BLOCK_PRESETS` → one `BLOCKS` (with `BlockKind`, `AskKind`,
      `AnswerKind`), `ASKS` → `ASK_INTENTS`, the `preset` key → `kind`.
- [x] **Create `@invana/blocks`** with every block and `Page`, a `Blocks/<Kind>` story each.
      Assistant draws every kind from it, and `answerToPage(turn)` opens a long answer as a page.
- [x] **Board draws blocks.** The `table` block gained `rowKey` + `selected` (a click sends
      `select`) and `mono` columns, replacing the board `table`; `grid` gained `minTileWidth`
      and a target-less `gauge` (a meter), replacing `metrics` (its `running`/`info` tones are
      gone); `record` rows gained `mono`, replacing `properties` (`labelWidth` is gone). `text`
      stays a board panel. Still to add to the spec pages: those four options.
- [ ] **Triage Needs review.** Keep only the generic variants and merge them into their block
      spec pages: line with reference + forecast (`timeseries`), tile with a mark (`grid`), stacked
      (`bars`), one flagged cell (`matrix`), proposal tag + scope note (`proposal`), compact
      timeline with a tag (`timeline`). Park the rest, including `activity` and `decisions`.
- [ ] **Block anatomy.** Name the optional parts once (heading with optional `title` and
      `description`, lead, footer actions, note, state, 280px collapse) and show them on the
      Customisation page. Fold spec-page variants that only toggle a part into one spec page.
- [ ] **Charts page.** One spec page per chart: bare, in a `PanelBox`, in an answer card, then one
      frame per prop that changes the drawing, plus empty and 280 / 720 widths. No playgrounds.
      Settle the four provisional charts' APIs while drawing them.
- [ ] **Stories follow the spec pages.** One variant story per frame, named after its caption, with
      `args` / `argTypes` so its props can be changed from the controls panel. Data from fixtures.

## Not now

- Spans, lineage, egress / budget approvals, mirrored reads / writes, context by source.
- Moving the conversation-tied blocks (`narrative`, `citations`, `scope`, `trace`, `files`,
  `proposal`, `caveat`, `cannot`) and the other ask blocks into `@invana/blocks`.
