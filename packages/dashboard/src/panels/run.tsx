import * as React from "react"
import {
  ArtifactTable,
  AttemptClock,
  ExchangeRecord,
  LayerSection,
  LayerStrip,
  MarkChip,
  ParticipantRow,
  TouchStrip,
  TraceGate,
  TraceList,
  TraceLoop,
  TraceStep,
  type Artifact,
  type AttemptRow,
  type Layer,
  type LayerBand,
  type LayerBracket,
  type LayerItem,
  type LayerPalette,
  type LayerScale,
  type LayerSeam,
  type LensUsage,
  type Narrowing,
  type TouchItem,
} from "@invana/ui"

import type { PanelRendererProps } from "../types"

/**
 * The panels a **run page** is made of.
 *
 * They are not in `BUILT_IN_PANELS`, and that is deliberate: the built-in list
 * is eleven kinds two unrelated surfaces each need, and these seven are one
 * surface family's — a run read in order, what it touched, a step's clock, the
 * files it left, the layers it spent, what governed it, and the ask it settled.
 * Shipping them here rather than in the default registry keeps a consumer that
 * only wanted tiles and a log from carrying the run vocabulary, while keeping
 * the adapter in the kit rather than copied into every product that draws runs.
 *
 * ```ts
 * <Dashboard spec={spec} registry={RUN_PANELS} />
 * ```
 */

/** One row of a trace — a step, a loop that holds rows, or a gate between them. */
export type TraceEntry =
  | {
      kind?: "step"
      seq?: number | string
      name: string
      description?: string
      layer?: string
      role?: string
      duration?: string
      note?: string
      /** The exception this row carries — `↺ 2 of 3`, `live`, `↳ delegates`. */
      mark?: string
      markTone?: React.ComponentProps<typeof MarkChip>["tone"]
      depth?: number
      dim?: boolean
      struck?: boolean
      /** Fired as `selectAction` with `{ stepId }`. */
      id?: string
    }
  | {
      kind: "loop"
      label: string
      summary?: string
      tone?: "warning" | "info" | "muted"
      rounds: TraceEntry[]
    }
  | {
      kind: "gate"
      label: string
      note?: string
      tone?: "destructive" | "warning" | "muted"
      edge?: "before" | "after"
    }

export interface TraceOptions {
  entries: TraceEntry[]
  palette?: LayerPalette
  /** Which step is open elsewhere. */
  selectedId?: string | null
  /** Dispatched with `{ stepId }` when a row is picked. */
  selectAction?: string
}

export interface TouchedOptions {
  items: TouchItem[]
  palette?: LayerPalette
}

export interface AttemptsOptions {
  rows: AttemptRow[]
  summary?: string
}


/**
 * One file a step left, as **data**.
 *
 * `ArtifactTable`'s own `Artifact` types every cell as a `ReactNode`, which a
 * spec cannot be. These are strings: a dashboard is fetched, stored beside a
 * plan and diffed, and a `ReactNode` survives none of that.
 */
export interface ArtifactSpec {
  name: string
  kind?: string
  size?: string
  /** The address — eight characters, drawn mono ([SR58]). */
  digest?: string
  written?: string
  /** Retention took the bytes. The row stays, struck. */
  gone?: boolean
}

export interface ArtifactsOptions {
  files: ArtifactSpec[]
  /** Dispatched with `{ digest, name, index }`. Omitted, the column is absent. */
  openAction?: string
  downloadAction?: string
}

export interface LayersOptions {
  bands: LayerBand[]
  items: LayerItem[]
  /** `"seq"` reads a plan's order, `"elapsed"` a run's wall clock. */
  scale?: LayerScale
  domain?: [number, number]
  ticks?: number[]
  brackets?: LayerBracket[]
  seams?: LayerSeam[]
  palette?: LayerPalette
  defaultCollapsed?: Layer[]
  labelWidth?: number
  /**
   * The narrowest the track is drawn before it scrolls, in `rem`. A run whose
   * work is seconds inside a wait of minutes needs a wider track than its panel
   * — past this the strip scrolls rather than squeezing bars under their own
   * names.
   */
  minTrackWidth?: number
  selectedItem?: string | null
  /** Dispatched with `{ itemId }` when a bar is picked. */
  selectAction?: string
}

/** One lens row under the layer it narrows. */
export interface LensRowSpec {
  name: string
  narrows?: Narrowing[]
  usage?: LensUsage
}

/** One participant the world allowed, and what the run did with it ([SR53]). */
export interface ParticipantSpec {
  address: string
  /** `touched` · `never touched` · `refused` · `miss` — any word the engine writes. */
  verdict: string
  /** What came back, or why nothing did — `1,284 rows · step 7`. */
  note?: string
}

export interface LensSectionSpec {
  layer: Layer
  summary?: string
  count?: number
  /** Nothing narrows this layer. Drawn dim rather than dropped. */
  dim?: boolean
  /**
   * **A section carries one of two readings, and they are different questions.**
   * `participants` is a *run's* lens — every address the world allowed, each
   * marked with what this execution did with it. `rows` is a *world's* — the
   * lenses that narrow this layer, as they read in the Govern drawer. A section
   * that gives both draws both, participants first.
   */
  participants?: ParticipantSpec[]
  rows?: LensRowSpec[]
}

export interface LensOptions {
  sections: LensSectionSpec[]
  palette?: LayerPalette
  /** Which lens is open elsewhere, by name. */
  selected?: string | null
  /** Dispatched with `{ lens }` when a row is picked. */
  selectAction?: string
}

export interface ClarificationOption {
  label: string
  /** The one that was taken. */
  chosen?: boolean
}

export interface ClarificationOptions {
  /** Who asked — `the agent asks`. */
  asker?: string
  question: string
  /** Why it had to ask, in the step's own terms. */
  why?: string
  options?: ClarificationOption[]
  answerer?: string
  answer?: string
  /** What it cost and what happened next — `after 41.2s · resumed on round 2`. */
  answerNote?: string
}

/**
 * The seven kinds, as a type argument for `DashboardSpec`.
 *
 * A `type` and not an `interface`: `ExtraPanels` is `Record<string, unknown>`,
 * which an interface never satisfies — it has no implicit index signature — so
 * an interface here would compile everywhere except at the one call site that
 * matters.
 */
export type RunPanelOptions = {
  trace: TraceOptions
  touched: TouchedOptions
  attempts: AttemptsOptions
  artifacts: ArtifactsOptions
  layers: LayersOptions
  lens: LensOptions
  clarification: ClarificationOptions
}

export function TracePanel({
  panel,
  options,
  onAction,
}: PanelRendererProps<TraceOptions>) {
  const step = (entry: Extract<TraceEntry, { kind?: "step" }>, key: string) => (
    <TraceStep
      key={key}
      seq={entry.seq}
      name={entry.name}
      description={entry.description}
      layer={entry.layer}
      role={entry.role}
      duration={entry.duration}
      note={entry.note}
      mark={
        entry.mark ? (
          <MarkChip tone={entry.markTone}>{entry.mark}</MarkChip>
        ) : undefined
      }
      palette={options.palette}
      depth={entry.depth}
      dim={entry.dim}
      struck={entry.struck}
      selected={entry.id != null && entry.id === options.selectedId}
      onSelect={
        options.selectAction && entry.id
          ? () =>
              onAction(options.selectAction as string, {
                panelId: panel.id,
                stepId: entry.id,
              })
          : undefined
      }
    />
  )

  const draw = (entry: TraceEntry, key: string): React.ReactNode => {
    if (entry.kind === "gate")
      return (
        <TraceGate
          key={key}
          label={entry.label}
          note={entry.note}
          tone={entry.tone}
          edge={entry.edge}
        />
      )
    if (entry.kind === "loop")
      return (
        <TraceLoop
          key={key}
          label={entry.label}
          summary={entry.summary}
          tone={entry.tone}
        >
          {entry.rounds.map((round, i) => draw(round, `${key}-${i}`))}
        </TraceLoop>
      )
    return step(entry, key)
  }

  return <TraceList>{options.entries.map((entry, i) => draw(entry, `${i}`))}</TraceList>
}

export function TouchedPanel({ options }: PanelRendererProps<TouchedOptions>) {
  return <TouchStrip items={options.items} palette={options.palette} />
}

export function AttemptsPanel({ options }: PanelRendererProps<AttemptsOptions>) {
  return <AttemptClock rows={options.rows} summary={options.summary} />
}

/** Merge into a dashboard's registry to draw a run — see the note above. */
export const RUN_PANELS = {
  trace: TracePanel,
  touched: TouchedPanel,
  attempts: AttemptsPanel,
  artifacts: ArtifactsPanel,
  layers: LayersPanel,
  lens: LensPanel,
  clarification: ClarificationPanel,
}

// ── the renderers for the four kinds above ───────────────────────────────

export function ArtifactsPanel({
  panel,
  options,
  onAction,
}: PanelRendererProps<ArtifactsOptions>) {
  return (
    <ArtifactTable
      files={options.files as Artifact[]}
      onOpen={
        options.openAction
          ? (file) =>
              onAction(options.openAction as string, {
                panelId: panel.id,
                itemId: String(file.digest ?? file.name),
              })
          : undefined
      }
      onDownload={
        options.downloadAction
          ? (file) =>
              onAction(options.downloadAction as string, {
                panelId: panel.id,
                itemId: String(file.digest ?? file.name),
              })
          : undefined
      }
    />
  )
}

export function LayersPanel({
  panel,
  options,
  onAction,
}: PanelRendererProps<LayersOptions>) {
  return (
    <LayerStrip
      bands={options.bands}
      items={options.items}
      seams={options.seams}
      brackets={options.brackets}
      scale={options.scale ?? "elapsed"}
      domain={options.domain}
      ticks={options.ticks}
      palette={options.palette}
      labelWidth={options.labelWidth}
      minTrackWidth={options.minTrackWidth}
      defaultCollapsed={options.defaultCollapsed}
      collapsible={false}
      selectedItem={options.selectedItem ?? undefined}
      onSelectItem={
        options.selectAction
          ? (itemId) =>
              onAction(options.selectAction as string, {
                panelId: panel.id,
                itemId,
              })
          : undefined
      }
    />
  )
}

export function LensPanel({ options }: PanelRendererProps<LensOptions>) {
  return (
    <div className="flex flex-col gap-2">
      {options.sections.map((section) => (
        <LayerSection
          key={section.layer}
          layer={section.layer}
          summary={section.summary}
          palette={options.palette}
          count={section.count ?? section.participants?.length}
          dim={section.dim}
        >
          {(section.participants ?? []).map((participant) => (
            <ParticipantRow
              key={participant.address}
              address={participant.address}
              verdict={participant.verdict}
              note={participant.note}
            />
          ))}
        </LayerSection>
      ))}
    </div>
  )
}

export function ClarificationPanel({
  options,
}: PanelRendererProps<ClarificationOptions>) {
  return (
    <ExchangeRecord
      asker={options.asker}
      question={options.question}
      why={options.why}
      options={options.options}
      answerer={options.answerer}
      answer={options.answer}
      answerNote={options.answerNote}
    />
  )
}
