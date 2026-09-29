# Components tracker

Status of every component planned in the [Assistant Package RFC](https://claude.ai/artifact/9phFHPT243XVFihvVt62wr), across packages. The contract it follows is [Analyst Flow Grammar](https://claude.ai/artifact/JQyqjKUTyrADw5vFvsFVzo).

**Update the row in the same commit that changes the component.** Edit only the `Status` cell unless the design changes; a design change goes to the RFC or the grammar first.

- **Change:** `stays` · `move in` · `move out` · `extend` · `new` · `compose` (preset from existing parts, story only) · `later` (needs a dependency)
- **Status:** `done` (in the repo and matches the row) · `partial` (exists, change not made) · `todo` (not started)
- **Tier:** `today` · `next` · `later`, as in the RFC
- **Slice** (preset registry): 0 contract · 1 supply-chain · 2 health · 3 trader · 4 breeder · 5 statistics
- Folders are relative to the repo root; renderer files in the preset registry are relative to `packages/assistant/src/`.


## @invana/assistant

Everything here is only meaningful relative to a prompt. Conversation is the parent that assembles the rest from JSON. The package adds no external dependency.


### Parent, protocol and grammar

| Component | Folder | Change | Status | Tier |
| --- | --- | --- | --- | --- |
| Conversation | `packages/assistant/src/conversations/conversation.tsx` | new | done | today |
| ConversationTurn | `packages/assistant/src/conversations/conversation-turn.tsx` | new | done | today |
| Preset registry | `packages/assistant/src/conversations/registry.ts` | new | done | today |
| Protocol types | `packages/assistant/src/protocol/types.ts` | new | done | today |
| Events | `packages/assistant/src/protocol/events.ts` | new | done | today |
| applyPatch | `packages/assistant/src/protocol/reduce.ts` | new | done | today |
| validate | `packages/assistant/src/protocol/validate.ts` | new | done | today |
| Grammar ids | `packages/assistant/src/grammar/` | new | done | today |
| Session fixtures | `packages/assistant/src/fixtures/sessions/` | new | done | today |
| Placeholder | `packages/assistant/src/conversations/placeholder.tsx` | new | done | today |

### Thread parts, moved from ui into conversations/

| Component | Folder | Change | Status | Tier |
| --- | --- | --- | --- | --- |
| ChatSession | `packages/assistant/src/conversations/chat-session.tsx` | move in | done | today |
| ChatSessionPromptRow | `packages/assistant/src/conversations/chat-session-prompt-row.tsx` | move in | done | today |
| ChatSessionMessage | `packages/assistant/src/conversations/chat-session-message.tsx` | move in | done | today |
| ChatSessionMessageOptions | `packages/assistant/src/conversations/chat-session-message-options.tsx` | move in | done | today |
| ChatSessionActivityRow | `packages/assistant/src/conversations/chat-session-activity-row.tsx` | move in | done | today |
| ChatSessionProgressLine | `packages/assistant/src/conversations/chat-session-progress-line.tsx` | move in | done | today |
| ChatSessionDisclosure | `packages/assistant/src/conversations/chat-session-disclosure.tsx` | move in | done | today |
| ChatSessionComposer | `packages/assistant/src/conversations/chat-session-composer.tsx` | move in | done | today |
| ChatSessionContextChip | `packages/assistant/src/conversations/chat-session-context-chip.tsx` | move in | done | today |
| ChatSessionStatusBar | `packages/assistant/src/conversations/chat-session-status-bar.tsx` | move in | done | today |
| ChatSessionTaskRow | `packages/assistant/src/conversations/chat-session-task-row.tsx` | move in | done | today |

### Asks: shells the ask presets render into

| Component | Folder | Change | Status | Tier |
| --- | --- | --- | --- | --- |
| ClarifyCard | `packages/assistant/src/asks/clarify-card.tsx` | move in | done | today |
| ClarifyCard states (on ClarifyCard) | `packages/assistant/src/asks/clarify-card.tsx` | extend | done | today |
| ConfirmCard | `packages/assistant/src/asks/confirm-card.tsx` | new | todo | today |
| InterpretationStrip | `packages/assistant/src/asks/interpretation-strip.tsx` | new | todo | today |
| InterpretationFork | `packages/assistant/src/asks/interpretation-fork.tsx` | new | todo | next |
| PlanPreview | `packages/assistant/src/asks/plan-preview.tsx` | new | todo | next |
| ModelSpec | `packages/assistant/src/asks/model-spec.tsx` | new | todo | next |
| Ask renderers (20) | `packages/assistant/src/asks/presets/` | new | todo | today |

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
| Block renderers (42) | `packages/assistant/src/answers/blocks/` | new | todo | today |

### Follow-ups

| Component | Folder | Change | Status | Tier |
| --- | --- | --- | --- | --- |
| SuggestionChips | `packages/assistant/src/followups/suggestion-chips.tsx` | new | done | today |
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
| BarChartV groups and target (on BarChartV) | `packages/charts/src/bar-chart-v.tsx` | extend | partial | next |
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
| DataTable | `packages/tables/src/data-table.tsx` | stays | done | today |
| DataTablePagination | `packages/tables/src/data-table-pagination.tsx` | stays | done | today |
| DataTableToolbar | `packages/tables/src/data-table-toolbar.tsx` | stays | done | today |
| EditableCell | `packages/tables/src/editable-cell.tsx` | stays | done | today |

### Extensions

| Component | Folder | Change | Status | Tier |
| --- | --- | --- | --- | --- |
| DataTable preview mode (on DataTable) | `packages/tables/src/data-table.tsx` | extend | done | today |
| DataTable column scale (on DataTable) | `packages/tables/src/data-table.tsx` | extend | partial | today |

### New

| Component | Folder | Change | Status | Tier |
| --- | --- | --- | --- | --- |
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
| @invana/dashboard | Panel kinds for the new charts | `packages/dashboard/src/panels/` | extend | partial | next |
| @invana/editor | Rendered markdown | `packages/editor/src/` | later | todo | later |
| @invana/themes | None | `packages/themes/src/` | stays | done | today |
| apps/storybook | Assistant section | `apps/storybook/stories/assistant/` | new | done | today |
| release.yml | dist-branches matrix | `.github/workflows/release.yml` | extend | done | today |

## Preset registry

One renderer file per preset id in `assistant/src/`. `proposed` ids are added to Analyst Flow Grammar before they are built.


### Ask presets

| Preset | Returns / reads | Renders with | Renderer file | Status | Tier | Slice |
| --- | --- | --- | --- | --- | --- | --- |
| confirm | `boolean` | ConfirmCard · assistant | `asks/presets/confirm.tsx` | todo | today | 2 |
| single | `string` | ClarifyCard · assistant | `asks/presets/single.tsx` | done | today | 1 |
| multi | `string[]` | ClarifyCard, multiple · assistant | `asks/presets/multi.tsx` | todo | today | 2 |
| quick | `string` | SegmentedControl · ui | `asks/presets/quick.tsx` | todo | today | 2 |
| period | `{ from, to, label }` | PeriodPicker · ui | `asks/presets/period.tsx` | todo | today | – |
| number | `number` | Questionnaire input with unit · ui | `asks/presets/number.tsx` | todo | today | 4 |
| short | `string` | Questionnaire input · ui | `asks/presets/short.tsx` | todo | today | – |
| long | `string` | Questionnaire freeform · ui | `asks/presets/long.tsx` | todo | today | – |
| entity | `id[]` | RichSelect + SearchInput · ui | `asks/presets/entity.tsx` | todo | next | 4 |
| scale | `1–5` | RatingControl · ui | `asks/presets/scale.tsx` | todo | today | – |
| multistep | `Record<askId, value>` | Questionnaire · ui; each step is an ask | `asks/presets/multistep.tsx` | done | today | 1 |
| form | `Record<field, value>` | ObjectField · forms | `asks/presets/form.tsx` | done | next | 1 |
| weights | `Record<objective, 0–100>` | WeightControl · ui | `asks/presets/weights.tsx` | todo | today | 4 |
| approval | `approve \| reject` | ProposalCard · ui | `asks/presets/approval.tsx` | todo | today | – |
| interpretation (proposed) | `Record<slot, value>` | InterpretationStrip · assistant | `asks/presets/interpretation.tsx` | todo | today | 5 |
| fork (proposed) | `readingId` | InterpretationFork · assistant | `asks/presets/fork.tsx` | todo | next | 5 |
| plan (proposed) | `stepId[]` | PlanPreview · assistant | `asks/presets/plan.tsx` | todo | next | 5 |
| modelspec (proposed) | `{ outcome, predictors[], group?, controls[] }` | ModelSpec · assistant | `asks/presets/modelspec.tsx` | todo | next | 5 |
| hypothesis (proposed) | `{ test, tails, alpha }` | ClarifyCard + SegmentedControl + number | `asks/presets/hypothesis.tsx` | todo | next | 5 |
| range (proposed) | `{ min, max }` | RangeInput · ui | `asks/presets/range.tsx` | todo | next | 5 |

### Block presets

| Preset | Returns / reads | Renders with | Renderer file | Status | Tier | Slice |
| --- | --- | --- | --- | --- | --- | --- |
| narrative | `{ text, cites? }` | Prose with CitationMarker · assistant | `answers/blocks/narrative.tsx` | done | today | 1 |
| metric | `{ label, value, delta, compare }` | MetricTile · ui | `answers/blocks/metric.tsx` | todo | today | 2 |
| grid | `{ tiles[] }` | MetricGrid · ui | `answers/blocks/grid.tsx` | done | today | 1 |
| table | `{ columns, rows, total }` | DataTable preview · tables | `answers/blocks/table.tsx` | done | today | 1 |
| attr | `{ columns[scale, dir], rows }` | DataTable column scale · tables | `answers/blocks/attr.tsx` | todo | today | 4 |
| record | `{ rows[label, value] }` | PropertyList · ui | `answers/blocks/record.tsx` | done | today | 1 |
| ranked | `{ items[label, value] }` | BarChartH ranked · charts | `answers/blocks/ranked.tsx` | todo | today | 2 |
| timeseries | `{ series, band?, forecastFrom?, forecastLabel?, marks? }` | LineChart · charts | `answers/blocks/timeseries.tsx` | done | today | 1 |
| bars | `{ groups, series, target? }` | BarChartV · charts | `answers/blocks/bars.tsx` | todo | next | 2 |
| waterfall | `{ start, steps[], end }` | Waterfall · charts | `answers/blocks/waterfall.tsx` | todo | next | 3 |
| matrix | `{ rows, cols, values, scale }` | Heatmap · charts | `answers/blocks/matrix.tsx` | todo | next | – |
| funnel | `{ steps[label, count] }` | Funnel · charts | `answers/blocks/funnel.tsx` | todo | next | – |
| histogram | `{ bins \| values, threshold?, outliers? }` | Histogram · charts | `answers/blocks/histogram.tsx` | todo | next | 4 |
| timeline | `{ events[when, text, tone] }` | TimelineList · ui | `answers/blocks/timeline.tsx` | done | today | 1 |
| subgraph | `{ nodes, edges }` | @invana/canvas | `answers/blocks/subgraph.tsx` | todo | later | – |
| method | `{ label, code, meta }` | ChatSessionDisclosure · assistant | `answers/blocks/method.tsx` | todo | today | 2 |
| citations | `{ sources[] }` | CitationList · ui | `answers/blocks/citations.tsx` | todo | today | 2 |
| files | `{ files[name, size, digest] }` | ArtifactTable · ui | `answers/blocks/files.tsx` | done | today | 1 |
| proposal | `{ rows, consequence, actions[] }` | ProposalCard · ui | `answers/blocks/proposal.tsx` | done | today | 1 |
| cannot | `{ reason, remedy, nearest? }` | CannotAnswerCard · ui | `answers/blocks/cannot.tsx` | todo | today | 3 |
| caveat | `{ label, text }` | CaveatNote · ui | `answers/blocks/caveat.tsx` | done | today | 1 |
| scope | `{ parts[] }` | ScopeLine · ui | `answers/blocks/scope.tsx` | done | today | 1 |
| checks | `{ rows[label, ok, count] }` | CheckList · ui | `answers/blocks/checks.tsx` | todo | next | – |
| suggestions | `{ items[] }` | SuggestionChips · assistant | `answers/blocks/suggestions.tsx` | done | today | 1 |
| trace | `{ steps[] }` | TraceList · ui | `answers/blocks/trace.tsx` | todo | today | 3 |
| test (proposed) | `{ test, statistic, p, effect, ci, assumptions, verdict }` | TestResult · assistant | `answers/blocks/test.tsx` | todo | next | 5 |
| coef (proposed) | `{ terms[term, est, se, lo, hi, p] }` | CoefficientTable · tables | `answers/blocks/coef.tsx` | todo | next | 5 |
| forest (proposed) | `{ rows[label, est, lo, hi], nullAt }` | ForestPlot · charts | `answers/blocks/forest.tsx` | todo | next | 5 |
| scatter (proposed) | `{ points, fit?, r2? }` | ScatterPlot · charts | `answers/blocks/scatter.tsx` | todo | next | 5 |
| box (proposed) | `{ groups[label, q1, median, q3, whiskers, outliers] }` | BoxPlot · charts | `answers/blocks/box.tsx` | todo | next | 5 |
| correlation (proposed) | `{ vars, values }` | Heatmap, diverging · charts | `answers/blocks/correlation.tsx` | todo | next | 5 |
| control (proposed) | `{ series, centre, ucl, lcl, breaches }` | ControlChart · charts | `answers/blocks/control.tsx` | todo | next | 5 |
| pareto (proposed) | `{ items[label, value] }` | ParetoChart · charts | `answers/blocks/pareto.tsx` | todo | next | 5 |
| survival (proposed) | `{ curves[], atRisk }` | SurvivalCurve · charts | `answers/blocks/survival.tsx` | todo | next | 5 |
| tornado (proposed) | `{ base, inputs[label, low, high] }` | Tornado · charts | `answers/blocks/tornado.tsx` | todo | next | 5 |
| decomposition (proposed) | `{ trend, seasonal, residual }` | SmallMultiples · charts | `answers/blocks/decomposition.tsx` | todo | next | 5 |
| modeleval (proposed) | `{ confusion, roc?, lift? }` | Heatmap + LineChart · charts | `answers/blocks/modeleval.tsx` | todo | next | 5 |
| pivot (proposed) | `{ rows, cols, cells, totals }` | PivotTable · tables | `answers/blocks/pivot.tsx` | todo | next | 5 |
| profile (proposed) | `{ columns[] }` | ColumnProfile · charts | `answers/blocks/profile.tsx` | todo | next | 5 |
| evidence (proposed) | `{ level, reason }` | EvidenceBadge · ui | `answers/blocks/evidence.tsx` | todo | next | 5 |
| dumbbell (proposed) | `{ rows[label, a, b] }` | Dumbbell · charts | `answers/blocks/dumbbell.tsx` | todo | next | 5 |
| quantiles (proposed) | `{ p10, p50, p90, unit }` | QuantileStrip · charts | `answers/blocks/quantiles.tsx` | todo | today | 5 |
