# Design Kit Spec — plan

The [Design Kit Spec](https://claude.ai/artifact/VcN3AYgmbdCpHbxXZjMir5) is the one design reference
for asks, answers and charts. An **intent** (`ASKS`, `ANSWER_INTENTS` in
`packages/assistant/src/grammar/`) is drawn by an **intent block** (a preset renderer), which is
composed of **parts** (`ui-extended`, `charts`, `tables`, `forms`).

**Rule for every item below: build the slice a real screen needs now.** Prefer a prop or an
optional slot on an existing component over a new component, and an existing package over a new
one. No "for later" props.

## To do

- [ ] **Triage Needs review.** Keep only the generic variants and merge them into their block
      boards: line with reference + forecast (`timeseries`), tile with a mark (`grid`), stacked
      (`bars`), one flagged cell (`matrix`), proposal tag + scope note (`proposal`), compact
      timeline with a tag (`timeline`). Park the rest, including `activity` and `decisions`, on a
      Parked page.
- [ ] **Block anatomy.** Name the optional parts once (heading with optional `title` and
      `description`, lead, footer actions, note, state, 280px collapse) and show them on the
      Customisation page. Fold board variants that only toggle a part into one board. Build the
      shared heading part in `ui-extended` only when a second ask uses it.
- [ ] **Charts page.** One board per chart in `@invana/charts`: bare, in a `PanelBox`, in an
      answer card, then one frame per prop that changes the drawing, plus empty and 280 / 720
      widths. No playgrounds. Settle the four provisional charts' APIs while drawing them.
- [ ] **Stories follow the boards.** One variant story per frame, named after its caption, with
      `args` / `argTypes` so its props can be changed from the controls panel. Data from fixtures.
- [ ] **`@invana/blocks`, when the first dashboard needs a chart block.** Move only `timeseries`,
      `bars`, `ranked`, `metric` and `grid` (props `{ spec, onAction? }`) and their option types;
      assistant registers them from there, dashboard draws them inside `PanelBox`. Leave
      dashboard's own `metrics` / `table` panels alone until they clash.

## Not now

- Spans, lineage, egress / budget approvals, mirrored reads / writes, context by source.
- Moving the chat-tied answer renderers or the ask renderers into `@invana/blocks`.
- Retiring or aliasing dashboard panels.
