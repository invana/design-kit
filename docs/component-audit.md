# Component audit

Which components the new Invana UI uses, which it will reuse or extend, and which may go. **Nothing listed here is
deleted until the new design for its area is done and confirms it has no place.** A component moves out of *Maybe
delete* the moment a design uses it.

## How it was counted

Every exported component in `packages/*/src` (stories, tests and index files left out) was searched for in the new
Invana Studio (`invana/studio/apps`, `invana/studio/packages`) and in `canvas/packages`, as of 2026-11-23.

| Package | Used by Studio or canvas | Used only by other kit components | Used nowhere |
|---|---|---|---|
| ui | 119 | 111 | 112, of which about 70 are parts of primitives in use (`DialogTrigger`, `SheetClose`) and stay with them |
| forms | 17 | 15 | 27, mostly re-exports of `FormField` |
| boards | 3 (`Board`, `BoardPages`, `BlockPanel`) | 14 | 8 |
| blocks | 2 | 36 | 0 |
| charts | 0 | 7 | 6 |
| assistant | 0 | 36 | 8 |
| tables · themes · editor | 6 | 9 | 4 |

Re-run the count before acting on any row below; a later Studio change may have started using it.

## What the new designs use

The designs are on the Invana design canvas (Model, Explore, Tools and access, Shell pieces, Things to review).

| Need | Component | Decision |
|---|---|---|
| Two-column left side, header, status bar, right region | `AppLayoutV2` (`leftNav`, `leftSection`, `rightSection`, `header`, `footer`) | reuse |
| Views column: title, New, collapse, a picker card, views with icon and count, group labels, a 56px icon rail | `NavVertical` | extend: icon-only collapsed mode, counts, group labels, a slot under the title |
| Tree column: rows with icon, count and status dot, group headers, a filter | `TreeView` | extend: `meta`, a status tone, group headers |
| World or graph picker | `RichSelect` | reuse |
| Status bar | `AppStatusBar` | reuse |
| Connection page: header, tabs | `RecordHeader`, `TabbedPanel`, or the board's own header and tabs | reuse |
| Connection Overview and Usage | `Board` from a `board.yml` per connector family, with `metric`, `grid`, `table`, `ranked`, `timeseries` blocks | reuse |
| Tiles, meter | `MetricTile`, `MetricGrid` | reuse |
| Charts | `LineChart`, `BarChartH`, `Sparkline` | reuse |
| Connections list grouped by category | `RemotePaginatedTable` | extend if it lacks group rows |
| Records: pick rows, then Fix, Merge, Clear | `DataTable`, `TableGrid`, `DataTableToolbar` | extend: a selection bar (*n picked* and actions) |
| Filters | `FilterBar`, `FilterChip`, `AppliedFilters` | reuse |
| Record detail: *1 of 24*, Next | `RecordPager` | reuse |
| A record's values and what wrote each one | `PropertyList`, `PropertyRow` | extend: a meta slot |
| Record history, a load's steps | `TimelineList` | reuse |
| A load's changes, before and after | `DiffList`, `DiffRow` | reuse |
| Upload steps | `StageTrail` (used nowhere today) | reuse |
| Upload drop area | — | new: `FileDrop` in `@invana/forms`, with a story |
| LLM provider choice | `CatalogCard`, `CatalogItem` | reuse |
| API key or subscription token | `SegmentedControl` | reuse |
| A connection check | `CheckResult` | reuse |
| Empty, loading, failed | `EmptyState`, `Skeleton`, `Alert` | reuse |

## Overlap to settle

| Components | Overlap | Lean |
|---|---|---|
| `NavVertical` and shadcn `Sidebar` (with its `SidebarMenu*` parts) | both draw a vertical navigation with a collapsed mode | keep `NavVertical`, which Studio and canvas use; `Sidebar` moves to *Maybe delete* once `NavVertical` has its icon rail |
| `AppLayoutV1` and `AppLayoutV2` | two app layouts | keep V2 |

## Maybe delete

Used nowhere today and with no place in the designs so far. Each waits for the design of its area.

| Group | Components | Waits for |
|---|---|---|
| Runs and tasks | `RunRow`, `RunStatusText`, `TaskNode`, `LogCard`, `DiagnosisCard`, `RefusalCard`, `RetryNote`, `CastTable`, `GanttDetailCard` | the design of Work (projects, tasks, runs) |
| Board panels for runs | `ArtifactsPanel`, `AttemptsPanel`, `ClarificationPanel`, `LensPanel`, `TouchedPanel`, `TracePanel` | the design of Work |
| Assistant leftovers | `ClarifyCardGroup`, `ChatSessionTurn`, `MarkdownEditorBlock` | the design of the assistant |
| Other extended pieces | `MatchPreview`, `HeaderTrail`, `TemplatePicker`, `Tour` | the design of the shell's first-run and search |
| Charts | `DivergingBar`, `InlineMeter`, `SegmentedBar`, `SegmentedBarLegend`, `StackedAreaChart`, `StackedBarChartV` | the design of dashboards |
| Themes | `AppLayoutAgents`, `ThemeSettingsCard`, `ThemeSettingsActions`, `AppLayoutV1` | the design of Settings › Appearance |
| Typography | `TypographyH1`, `H2`, `H4`, `H5`, `H6`, `Lead`, `Large`, `Small`, `P`, `List`, `Pre`, `InlineCode`, `Blockquote` | a decision on headings in the 13/12/11 type scale |
| Unused shadcn primitives | `Menubar`, `NavigationMenu`, `Carousel` (every part of each) | — |

## Decide with the assistant's design

Used only by other kit components, mostly `@invana/assistant` and `@invana/blocks`, which the assistant will use. They
are neither kept nor marked for deletion until that design exists.

`AbsenceNote`, `AddressChip`, `AgentChip`, `AgentHeader`, `AnnotationCard`, `ArtifactTable`, `BoundChip`,
`CannotAnswerCard`, `CaveatNote`, `CitationList`, `ClarifyCard`, `ContextBar`, `DataReach`, `EgressList`, `EmissionCard`,
`ExchangeRecord`, `Gantt`, `KindChip`, `LayerChip`, `LayerSection`, `LensRow`, `MarkChip`, `ParticipantRow`,
`ProposalCard`, `RatingControl`, `RepairNote`, `RuleRow`, `ScopeLine`, `SliceSummary`, `TouchStrip`, `TraceList`,
`Workbook`, and the `blocks`, `assistant` and `boards` parts they compose.
