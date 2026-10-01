# Components tracker

Status of every component the assistant needs, across packages. The design reference is the [Design Kit Spec](https://claude.ai/artifact/VcN3AYgmbdCpHbxXZjMir5): one board per ask and answer-block, each variant on a board is one story.

**Update the row in the same commit that changes the component.** Edit only the `Status` cell unless the design changes; a design change goes to the canvas first.

- **Change:** `stays` · `move in` · `move out` · `extend` · `new` · `compose` (block from existing parts, story only) · `later` (needs a dependency)
- **Status:** `done` (in the repo and matches the row) · `partial` (exists, change not made) · `todo` (not started)
- **Tier:** `today` · `next` · `later`
- **Slice** (block registry): 0 contract · 1 supply-chain · 2 health · 3 trader · 4 breeder · 5 statistics
- Folders are relative to the repo root; renderer files in the block registry are relative to `packages/blocks/src/`.


## @invana/assistant

Everything here is only meaningful relative to a prompt. ChatSession is the parent that assembles the rest from JSON, in a `cli` or `web` variant. The package adds no external dependency.


### Parent, protocol and grammar

| Component | Folder | Change | Status | Tier |
| --- | --- | --- | --- | --- |
| ChatSession (`variant="cli" \| "web"`) | `packages/assistant/src/styles/chat-session.tsx` | new | done | today |
| ChatSession base (blocks, asks, steps, composer, chrome, view model) | `packages/assistant/src/styles/base/` | new | done | today |
| ChatSession CLI variant | `packages/assistant/src/styles/cli/` | new | done | today |
| ChatSession web variant, ChatSessionTurn | `packages/assistant/src/styles/web/` | new | done | today |
| useChatSession | `packages/assistant/src/styles/use-chat-session.ts` | new | done | today |
| Stream sources (NDJSON, SSE, scripts, deltas, stop) | `packages/assistant/src/protocol/stream.ts` | new | done | today |
| Recorded runs (every user) | `packages/assistant/src/fixtures/scripts/runs.ts` | new | done | today |
| Conversation fixtures (the conversations/ stories' JSON, with a streaming script) | `packages/assistant/src/fixtures/conversations/` | new | done | today |
| Conversation, ConversationTurn | `packages/assistant/src/conversations/` | remove (→ ChatSession) | done | today |
| Block registry | `packages/blocks/src/registry.ts` | new | done | today |
| Protocol types | `packages/assistant/src/protocol/types.ts` | new | done | today |
| Events | `packages/assistant/src/protocol/events.ts` | new | done | today |
| applyPatch | `packages/assistant/src/protocol/reduce.ts` | new | done | today |
| validate | `packages/assistant/src/protocol/validate.ts` | new | done | today |
| Grammar ids | `packages/assistant/src/grammar/` | new | done | today |
| User conversations (session + runs) | `packages/assistant/src/data/conversations/` | new | done | today |
| Placeholder | `packages/assistant/src/conversations/placeholder.tsx` | new | done | today |

### Thread parts, moved from ui into conversations/

| Component | Folder | Change | Status | Tier |
| --- | --- | --- | --- | --- |
| ChatSessionFrame (was ChatSession, the layout) | `packages/assistant/src/conversations/thread.ts` | move in, rename | done | today |
| ChatSessionPromptRow | `packages/assistant/src/conversations/chat-session-prompt-row.tsx` | move in | done | today |
| ChatSessionMessage | `packages/assistant/src/conversations/chat-session-message.tsx` | move in | done | today |
| ChatSessionMessageOptions | `packages/assistant/src/conversations/chat-session-message-options.tsx` | move in | done | today |
| ChatSessionActivityRow | `packages/assistant/src/conversations/chat-session-activity-row.tsx` | move in | done | today |
| ChatSessionProgressLine | `packages/assistant/src/conversations/chat-session-progress-line.tsx` | move in | done | today |
| ChatSessionDisclosure | `packages/assistant/src/conversations/chat-session-disclosure.tsx` | move in | done | today |
| ChatSessionDisclosure inline (on ChatSessionDisclosure) | `packages/ui/src/components/ui-extended/chat-session/chat-session-disclosure.tsx` | extend | done | today |
| ChatSessionComposer | `packages/assistant/src/conversations/chat-session-composer.tsx` | move in | done | today |
| ChatSessionContextChip | `packages/assistant/src/conversations/chat-session-context-chip.tsx` | move in | done | today |
| ChatSessionStatusBar | `packages/assistant/src/conversations/chat-session-status-bar.tsx` | move in | done | today |
| ChatSessionTaskRow | `packages/assistant/src/conversations/chat-session-task-row.tsx` | move in | done | today |

### Asks: shells the blocks in an ask render into

| Component | Folder | Change | Status | Tier |
| --- | --- | --- | --- | --- |
| ClarifyCard | `packages/assistant/src/asks/clarify-card.tsx` | move in | done | today |
| ClarifyCard states (on ClarifyCard) | `packages/assistant/src/asks/clarify-card.tsx` | extend | done | today |
| ClarifyCard time (on ClarifyCard) | `packages/ui/src/components/ui-extended/clarify-card.tsx` | extend | done | today |
| ConfirmCard | `packages/assistant/src/asks/confirm-card.tsx` | new | done | today |
| SuggestionChips | `packages/assistant/src/asks/suggestion-chips.tsx` | new | done | today |
| ClarifyCard rich options (on ClarifyCard) | `packages/ui/src/components/ui-extended/clarify-card.tsx` | extend | todo | next |
| InterpretationStrip | `packages/assistant/src/asks/interpretation-strip.tsx` | new | todo | today |
| InterpretationFork | `packages/assistant/src/asks/interpretation-fork.tsx` | new | todo | next |
| PlanPreview | `packages/assistant/src/asks/plan-preview.tsx` | new | todo | next |
| ModelSpec | `packages/assistant/src/asks/model-spec.tsx` | new | todo | next |
| Ask renderers (21) | `packages/blocks/src/blocks/` | new | partial | today |

### Answers: the card and what goes inside it

| Component | Folder | Change | Status | Tier |
| --- | --- | --- | --- | --- |
| EmissionCard | `packages/assistant/src/answers/emission-card.tsx` | move in | done | today |
| EmissionHeader envelope (on EmissionHeader) | `packages/assistant/src/answers/emission-card.tsx` | extend | partial | today |
| EmissionCard partial (on EmissionCard) | `packages/assistant/src/answers/emission-card.tsx` | extend | partial | today |
| TemplatePicker | `packages/assistant/src/answers/template-picker.tsx` | move in | done | today |
| TemplatePicker previews (on TemplatePicker) | `packages/assistant/src/answers/template-picker.tsx` | extend | partial | next |
| AnswerPreview | `packages/assistant/src/answers/answer-preview.tsx` | new | todo | today |
| TestResult | `packages/assistant/src/answers/test-result.tsx` | new | todo | next |
| Block renderers (41) | `packages/blocks/src/blocks/` | new | partial | today |

### Follow-ups

| Component | Folder | Change | Status | Tier |
| --- | --- | --- | --- | --- |
| RefineChips | `packages/assistant/src/followups/refine-chips.tsx` | new | todo | next |
| StarterGallery | `packages/assistant/src/followups/starter-gallery.tsx` | new | todo | next |

### Patterns

| Component | Folder | Change | Status | Tier |
| --- | --- | --- | --- | --- |
| Answer patterns (26) | `packages/assistant/src/grammar/patterns.ts` | compose | todo | today |

## @invana/charts

Nothing moves out. Files stay flat in charts/src, one per chart. uPlot through ChartFrame for continuous axes; DOM or SVG for marks in a row or a small card. Several existing charts are marked provisional pending the charts design review.


### Existing

| Component | Folder | Change | Status | Tier |
| --- | --- | --- | --- | --- |
| LineChart | `packages/charts/src/line-chart.tsx` | stays | done | today |
| StackedAreaChart | `packages/charts/src/stacked-area-chart.tsx` | stays | done | today |
| StackedBarChartV | `packages/charts/src/stacked-bar-chart-v.tsx` | stays | done | today |
| BarChartH | `packages/charts/src/bar-chart-h.tsx` | stays | done | today |
| BarChartV | `packages/charts/src/bar-chart-v.tsx` | stays | done | today |
| DivergingBar | `packages/charts/src/diverging-bar.tsx` | stays | done | today |
| HeatStrip | `packages/charts/src/heat-strip.tsx` | stays | done | today |
| Sparkline | `packages/charts/src/sparkline.tsx` | stays | done | today |
| InlineMeter | `packages/charts/src/inline-meter.tsx` | stays | done | today |
| SegmentedBar | `packages/charts/src/segmented-bar.tsx` | stays | done | today |
| ChartFrame (internal) | `packages/charts/src/base/chart-frame.tsx` | stays | done | today |

### Extensions

| Component | Folder | Change | Status | Tier |
| --- | --- | --- | --- | --- |
| LineChart band and forecast (on LineChart) | `packages/charts/src/line-chart.tsx` | extend | done | today |
| BarChartV groups and target (on BarChartV) | `packages/charts/src/bar-chart-v.tsx` | extend | done | next |
| BarChartV comparison (on BarChartV) | `packages/charts/src/bar-chart-v.tsx` | extend | done | next |
| BarChartH ranked (on BarChartH) | `packages/charts/src/bar-chart-h.tsx` | extend | done | today |
| InlineMeter target (on InlineMeter) | `packages/charts/src/inline-meter.tsx` | extend | partial | next |

### New, general

| Component | Folder | Change | Status | Tier |
| --- | --- | --- | --- | --- |
| Waterfall | `packages/charts/src/waterfall.tsx` | new | todo | next |
| Heatmap | `packages/charts/src/heatmap.tsx` | new | todo | next |
| Histogram | `packages/charts/src/histogram.tsx` | new | todo | next |
| Funnel | `packages/charts/src/funnel.tsx` | new | todo | next |
| Dumbbell | `packages/charts/src/dumbbell.tsx` | new | todo | next |
| QuantileStrip | `packages/charts/src/quantile-strip.tsx` | new | todo | today |
| SmallMultiples | `packages/charts/src/small-multiples.tsx` | new | todo | next |
| ColumnProfile | `packages/charts/src/column-profile.tsx` | new | todo | next |

### New, statistical

| Component | Folder | Change | Status | Tier |
| --- | --- | --- | --- | --- |
| ScatterPlot | `packages/charts/src/scatter-plot.tsx` | new | todo | next |
| BoxPlot | `packages/charts/src/box-plot.tsx` | new | todo | next |
| ForestPlot | `packages/charts/src/forest-plot.tsx` | new | todo | next |
| ControlChart | `packages/charts/src/control-chart.tsx` | new | todo | next |
| ParetoChart | `packages/charts/src/pareto-chart.tsx` | new | todo | next |
| SurvivalCurve | `packages/charts/src/survival-curve.tsx` | new | todo | next |
| Tornado | `packages/charts/src/tornado.tsx` | new | todo | next |

### Later

| Component | Folder | Change | Status | Tier |
| --- | --- | --- | --- | --- |
| Subgraph | `@invana/canvas` | later | todo | later |
| Map | `own package` | later | todo | later |
| Brush a range | `packages/charts/src/base/` | later | todo | later |

## @invana/tables

Tables cannot import charts, because charts depends on tables. In-row marks such as sparklines are passed in as cell renderers by the block renderer in assistant.


### Existing

| Component | Folder | Change | Status | Tier |
| --- | --- | --- | --- | --- |
| DataTable (every row at once; no search, no pages) | `packages/tables/src/data-table.tsx` | stays | done | today |
| DataTablePagination | `packages/tables/src/data-table-pagination.tsx` | stays | done | today |
| DataTableToolbar | `packages/tables/src/data-table-toolbar.tsx` | stays | done | today |
| EditableCell | `packages/tables/src/editable-cell.tsx` | stays | done | today |

### Extensions

| Component | Folder | Change | Status | Tier |
| --- | --- | --- | --- | --- |
| DataTable preview mode (on DataTable) | `packages/tables/src/data-table.tsx` | extend | done | today |
| DataTable column scale (on DataTable) | `packages/tables/src/data-table.tsx` | extend | partial | today |
| Cell highlight (`isCellHighlighted`, all three tables) | `packages/tables/src/core/table-grid.tsx` | extend | done | today |
| Control cells (`meta.control`, all three tables) | `packages/tables/src/core/table-grid.tsx` | extend | done | today |
| Filter chips (`filters`: in memory on PaginatedTable, sent to `fetchPage` on RemotePaginatedTable) | `packages/tables/src/core/filters.ts` | extend | done | today |

### New

| Component | Folder | Change | Status | Tier |
| --- | --- | --- | --- | --- |
| Table core (shared model + grid behind the three tables) | `packages/tables/src/core/` | new | done | today |
| PaginatedTable (client search, column picker, pages) | `packages/tables/src/paginated-table.tsx` | new | done | today |
| RemotePaginatedTable (`fetchPage`: server pages, sort, search) | `packages/tables/src/remote-paginated-table.tsx` | new | done | today |
| CoefficientTable | `packages/tables/src/coefficient-table.tsx` | new | todo | next |
| PivotTable | `packages/tables/src/pivot-table.tsx` | new | todo | next |
| Reorder ask | `packages/tables/src/` | later | todo | later |

## @invana/ui

Fourteen components move to assistant; the folder shown is where they are today. New additions are controls and notes that a dashboard or report uses as readily as the assistant.


### Moves out to assistant

| Component | Folder | Change | Status | Tier |
| --- | --- | --- | --- | --- |
| chat-session/* (11) | `packages/ui/src/components/ui-extended/chat-session/` | move out | done | today |
| ClarifyCard | `packages/ui/src/components/ui-extended/clarify-card.tsx` | move out | done | today |
| EmissionCard | `packages/ui/src/components/ui-extended/emission-card.tsx` | move out | done | today |
| TemplatePicker | `packages/ui/src/components/ui-extended/template-picker.tsx` | move out | done | today |

### New controls

| Component | Folder | Change | Status | Tier |
| --- | --- | --- | --- | --- |
| PeriodPicker | `packages/ui/src/components/ui-extended/period-picker.tsx` | new | todo | today |
| WeightControl | `packages/ui/src/components/ui-extended/weight-control.tsx` | new | todo | today |
| RangeInput | `packages/ui/src/components/ui-extended/range-input.tsx` | new | todo | next |
| Number with unit (on Questionnaire input) | `packages/ui/src/components/ui/questionnaire.tsx` | extend | done | today |
| Entity search (on RichSelect, SearchInput) | `packages/ui/src/components/ui-extended/rich-select.tsx` | extend | partial | next |

### New notes and values

| Component | Folder | Change | Status | Tier |
| --- | --- | --- | --- | --- |
| ScopeLine | `packages/ui/src/components/ui-extended/scope-line.tsx` | new | done | today |
| CaveatNote | `packages/ui/src/components/ui-extended/caveat-note.tsx` | new | done | today |
| CheckList | `packages/ui/src/components/ui-extended/check-list.tsx` | new | todo | next |
| EvidenceBadge | `packages/ui/src/components/ui-extended/evidence-badge.tsx` | new | todo | next |
| formatValue | `packages/ui/src/lib/format.ts` | new | todo | today |
| Value | `packages/ui/src/components/ui-extended/value.tsx` | new | todo | today |

### Extensions

| Component | Folder | Change | Status | Tier |
| --- | --- | --- | --- | --- |
| SegmentedControl solid and read-only (on SegmentedControl) | `packages/ui/src/components/ui/segmented-control.tsx` | extend | done | today |
| MetricTile hero (on MetricTile) | `packages/ui/src/components/ui-extended/metric-tile.tsx` | extend | done | today |
| MetricTile figure (on MetricTile) | `packages/ui/src/components/ui-extended/metric-tile.tsx` | extend | done | today |
| PropertyList summary (on PropertyList) | `packages/ui/src/components/ui-extended/property-list.tsx` | extend | done | today |
| CitationRow numbered (on CitationList) | `packages/ui/src/components/ui-extended/citation-list.tsx` | extend | done | today |
| TraceList progress (on TraceList, TraceStep) | `packages/ui/src/components/ui-extended/trace-list.tsx` | extend | done | today |
| CannotAnswerCard type sizes (on CannotAnswerCard) | `packages/ui/src/components/ui-extended/cannot-answer-card.tsx` | extend | done | today |

### Everything else

| Component | Folder | Change | Status | Tier |
| --- | --- | --- | --- | --- |
| All other exports | `packages/ui/src/components/` | stays | done | today |

## Other packages

| Package | Item | Folder | Change | Status | Tier |
| --- | --- | --- | --- | --- | --- |
| @invana/styling | Sequential and diverging ramp tokens | `packages/styling/src/index.css` | new | todo | next |
| @invana/styling | Interval and significance tokens | `packages/styling/src/index.css` | new | todo | next |
| @invana/forms | FormField.Period, FormField.Weights | `packages/forms/src/form-field.tsx` | extend | partial | next |
| @invana/forms | FieldConfig `unit` and `aside`, typed number | `packages/forms/src/types.ts` | extend | done | next |
| @invana/forms | `xs` tier at 28px, muted field labels | `packages/forms/src/form-field.tsx` | extend | done | today |
| @invana/dashboard | Panel kinds for the new charts | `packages/dashboard/src/panels/` | extend | partial | next |
| @invana/editor | Rendered markdown | `packages/editor/src/` | later | todo | later |
| @invana/themes | None | `packages/themes/src/` | stays | done | today |
| apps/storybook | Assistant section | `apps/storybook/stories/assistant/` | new | done | today |
| release.yml | dist-branches matrix | `.github/workflows/release.yml` | extend | done | today |

## Block registry

One renderer file per kind in `blocks/src/blocks/`. `proposed` ids get a board on the canvas before they are built.


### Blocks in asks

| Kind | Returns / reads | Renders with | Renderer file | Status | Tier | Slice |
| --- | --- | --- | --- | --- | --- | --- |
| confirm | `boolean` | ConfirmCard · blocks | `blocks/confirm.tsx` | done | today | 2 |
| single | `string` | ClarifyCard · assistant | `blocks/single.tsx` | done | today | 1 |
| multi | `string[]` | ClarifyCard, multiple · assistant | `blocks/multi.tsx` | done | today | 2 |
| quick | `string` | SegmentedControl · ui | `blocks/quick.tsx` | done | today | 2 |
| period | `{ from, to, label }` | PeriodPicker · ui | `blocks/period.tsx` | todo | today | – |
| number | `number` | Questionnaire input with unit · ui | `blocks/number.tsx` | todo | today | 4 |
| short | `string` | Questionnaire input · ui | `blocks/short.tsx` | todo | today | – |
| long | `string` | Questionnaire freeform · ui | `blocks/long.tsx` | todo | today | – |
| entity | `id[]` | RichSelect + SearchInput · ui | `blocks/entity.tsx` | todo | next | 4 |
| scale | `1–5` | RatingControl · ui | `blocks/scale.tsx` | todo | today | – |
| multistep | `Record<askId, value>` | Questionnaire · ui; each step is an ask | `blocks/multistep.tsx` | done | today | 1 |
| form | `Record<field, value>` | ObjectField · forms | `blocks/form.tsx` | done | next | 1 |
| weights | `Record<objective, 0–100>` | WeightControl · ui | `blocks/weights.tsx` | todo | today | 4 |
| approval | `approve \| reject` | ProposalCard · ui | `blocks/approval.tsx` | todo | today | – |
| interpretation (proposed) | `Record<slot, value>` | InterpretationStrip · blocks | `blocks/interpretation.tsx` | todo | today | 5 |
| fork (proposed) | `readingId` | InterpretationFork · blocks | `blocks/fork.tsx` | todo | next | 5 |
| plan (proposed) | `stepId[]` | PlanPreview · blocks | `blocks/plan.tsx` | todo | next | 5 |
| modelspec (proposed) | `{ outcome, predictors[], group?, controls[] }` | ModelSpec · blocks | `blocks/modelspec.tsx` | todo | next | 5 |
| hypothesis (proposed) | `{ test, tails, alpha }` | ClarifyCard + SegmentedControl + number | `blocks/hypothesis.tsx` | todo | next | 5 |
| range (proposed) | `{ min, max }` | RangeInput · ui | `blocks/range.tsx` | todo | next | 5 |
| suggestions | `string` | SuggestionChips · blocks | `blocks/suggestions.tsx` | done | today | 1 |

### Blocks in answers

| Kind | Returns / reads | Renders with | Renderer file | Status | Tier | Slice |
| --- | --- | --- | --- | --- | --- | --- |
| narrative | `{ text, cites? }` | Prose with CitationMarker · blocks | `blocks/narrative.tsx` | done | today | 1 |
| metric | `{ label, value, delta, compare }` | MetricTile · ui | `blocks/metric.tsx` | done | today | 2 |
| grid | `{ tiles[] }` | MetricGrid · ui | `blocks/grid.tsx` | done | today | 1 |
| table | `{ columns, rows, total }` | DataTable preview · tables | `blocks/table.tsx` | done | today | 1 |
| attr | `{ columns[scale, dir], rows }` | DataTable column scale · tables | `blocks/attr.tsx` | todo | today | 4 |
| record | `{ rows[label, value] }` | PropertyList · ui | `blocks/record.tsx` | done | today | 1 |
| ranked | `{ items[label, value] }` | BarChartH ranked · charts | `blocks/ranked.tsx` | done | today | 2 |
| timeseries | `{ series, band?, forecastFrom?, forecastLabel?, marks? }` | LineChart · charts | `blocks/timeseries.tsx` | done | today | 1 |
| bars | `{ groups, series, target? }` | BarChartV · charts | `blocks/bars.tsx` | done | next | 2 |
| waterfall | `{ start, steps[], end }` | Waterfall · charts | `blocks/waterfall.tsx` | todo | next | 3 |
| matrix | `{ rows, cols, values, scale }` | Heatmap · charts | `blocks/matrix.tsx` | todo | next | – |
| funnel | `{ steps[label, count] }` | Funnel · charts | `blocks/funnel.tsx` | todo | next | – |
| histogram | `{ bins \| values, threshold?, outliers? }` | Histogram · charts | `blocks/histogram.tsx` | todo | next | 4 |
| timeline | `{ events[when, text, tone] }` | TimelineList · ui | `blocks/timeline.tsx` | done | today | 1 |
| subgraph | `{ nodes, edges }` | @invana/canvas | `blocks/subgraph.tsx` | todo | later | – |
| method | `{ label, code, meta }` | ChatSessionDisclosure · ui | `blocks/method.tsx` | done | today | 2 |
| citations | `{ sources[] }` | CitationList · ui | `blocks/citations.tsx` | done | today | 2 |
| files | `{ files[name, size, digest] }` | ArtifactTable · ui | `blocks/files.tsx` | done | today | 1 |
| proposal | `{ rows, consequence, actions[] }` | ProposalCard · ui | `blocks/proposal.tsx` | done | today | 1 |
| cannot | `{ reason, remedy, nearest? }` | CannotAnswerCard · ui | `blocks/cannot.tsx` | done | today | 3 |
| caveat | `{ label, text }` | CaveatNote · ui | `blocks/caveat.tsx` | done | today | 1 |
| scope | `{ parts[] }` | ScopeLine · ui | `blocks/scope.tsx` | done | today | 1 |
| checks | `{ rows[label, ok, count] }` | CheckList · ui | `blocks/checks.tsx` | todo | next | – |
| trace | `{ steps[] }` | TraceList · ui | `blocks/trace.tsx` | done | today | 3 |
| test (proposed) | `{ test, statistic, p, effect, ci, assumptions, verdict }` | TestResult · blocks | `blocks/test.tsx` | todo | next | 5 |
| coef (proposed) | `{ terms[term, est, se, lo, hi, p] }` | CoefficientTable · tables | `blocks/coef.tsx` | todo | next | 5 |
| forest (proposed) | `{ rows[label, est, lo, hi], nullAt }` | ForestPlot · charts | `blocks/forest.tsx` | todo | next | 5 |
| scatter (proposed) | `{ points, fit?, r2? }` | ScatterPlot · charts | `blocks/scatter.tsx` | todo | next | 5 |
| box (proposed) | `{ groups[label, q1, median, q3, whiskers, outliers] }` | BoxPlot · charts | `blocks/box.tsx` | todo | next | 5 |
| correlation (proposed) | `{ vars, values }` | Heatmap, diverging · charts | `blocks/correlation.tsx` | todo | next | 5 |
| control (proposed) | `{ series, centre, ucl, lcl, breaches }` | ControlChart · charts | `blocks/control.tsx` | todo | next | 5 |
| pareto (proposed) | `{ items[label, value] }` | ParetoChart · charts | `blocks/pareto.tsx` | todo | next | 5 |
| survival (proposed) | `{ curves[], atRisk }` | SurvivalCurve · charts | `blocks/survival.tsx` | todo | next | 5 |
| tornado (proposed) | `{ base, inputs[label, low, high] }` | Tornado · charts | `blocks/tornado.tsx` | todo | next | 5 |
| decomposition (proposed) | `{ trend, seasonal, residual }` | SmallMultiples · charts | `blocks/decomposition.tsx` | todo | next | 5 |
| modeleval (proposed) | `{ confusion, roc?, lift? }` | Heatmap + LineChart · charts | `blocks/modeleval.tsx` | todo | next | 5 |
| pivot (proposed) | `{ rows, cols, cells, totals }` | PivotTable · tables | `blocks/pivot.tsx` | todo | next | 5 |
| profile (proposed) | `{ columns[] }` | ColumnProfile · charts | `blocks/profile.tsx` | todo | next | 5 |
| evidence (proposed) | `{ level, reason }` | EvidenceBadge · ui | `blocks/evidence.tsx` | todo | next | 5 |
| dumbbell (proposed) | `{ rows[label, a, b] }` | Dumbbell · charts | `blocks/dumbbell.tsx` | todo | next | 5 |
| quantiles (proposed) | `{ p10, p50, p90, unit }` | QuantileStrip · charts | `blocks/quantiles.tsx` | todo | today | 5 |
