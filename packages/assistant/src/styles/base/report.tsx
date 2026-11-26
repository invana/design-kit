import { Button, cn } from "@invana/ui"
import { colorVarByString } from "@invana/styling/color"

import type { RunFigure, RunReport } from "../../protocol/types"
import { formatDuration } from "./format"
import { LABEL } from "./steps"

const n = (value: number) => value.toLocaleString("en-GB")
const k = (value: number) => `${(value / 1000).toFixed(1)}k`

const TONE = { error: "bg-destructive", warning: "bg-warning", success: "bg-success" } as const

/** A heading inside the report. */
function Heading({ children, first }: { children: string; first?: boolean }) {
  return <div className={cn(LABEL, "px-2.5 pb-1", first ? "pt-2.5" : "pt-3")}>{children}</div>
}

/** A connection's dot: its colour is its name's, so it is the same wherever it is drawn. */
function Dot({ name }: { name: string }) {
  return <span aria-hidden className="size-[9px] shrink-0 rounded-full" style={{ background: colorVarByString(name) }} />
}

export interface RunReportViewProps {
  report: RunReport
  /** The model that ran it — the LLM calls' caption. */
  model?: string
  /** Export JSON was pressed. */
  onExport?: () => void
  /** A problem's `See the step` was pressed. */
  onOpenStep?: (step: string | undefined) => void
}

/**
 * A run in counters, under its answer: a strip saying where it stands, the
 * figures with a line each, what each connection did, what went wrong or
 * needed the analyst, what left for the LLM and what did not, and the
 * connections it could have reached and did not. Every figure is the API's;
 * this only writes it.
 */
export function RunReportView({ report, model, onExport, onOpenStep }: RunReportViewProps) {
  const caption = (figure: RunFigure) => report.captions?.[figure]
  const tiles: { figure: RunFigure; label: string; value: string; tone?: string }[] = [
    { figure: "calls", label: "Tool calls", value: n(report.calls) },
    { figure: "reads", label: "Reads", value: n(report.reads) },
    { figure: "writes", label: "Writes", value: n(report.writes) },
    { figure: "failed", label: "Failed", value: n(report.failed), tone: report.failed ? "text-destructive" : undefined },
    { figure: "approved", label: "Approved by you", value: n(report.approved) },
    { figure: "rows", label: "Rows read", value: n(report.rows) },
    ...(report.files !== undefined ? [{ figure: "files" as const, label: "Files read", value: n(report.files) }] : []),
    ...(report.connections ? [{ figure: "connections" as const, label: "Connections", value: n(report.connections.filter((c) => !c.tokens).length) }] : []),
    ...(report.llmCalls !== undefined ? [{ figure: "llmCalls" as const, label: "LLM calls", value: n(report.llmCalls) }] : []),
    { figure: "tokensIn", label: "Tokens in", value: k(report.tokens.in) },
    { figure: "tokensOut", label: "Tokens out", value: k(report.tokens.out) },
    ...(report.duration !== undefined
      ? [{ figure: "duration" as const, label: "Took", value: formatDuration(report.duration) }]
      : []),
  ]
  const captionOf = (figure: RunFigure) =>
    caption(figure) ??
    (figure === "llmCalls" ? model : undefined) ??
    (figure === "duration" && report.waited ? `${formatDuration(report.waited)} waiting for you` : undefined)
  const final = report.final !== false
  const connections = report.connections ?? []
  const issues = report.issues ?? []
  return (
    <section aria-label="Run report" className="flex min-w-0 flex-col border border-border bg-card">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 border-b border-border bg-chrome py-1.5 pr-1.5 pl-2.5">
        <span className={LABEL}>Run report</span>
        <span className="text-sm text-muted-foreground">
          {[final ? "final" : "so far", report.id ? `run ${report.id}` : undefined, report.writes ? undefined : "read only"]
            .filter(Boolean)
            .join(" · ")}
        </span>
        <span className="grow" />
        {onExport ? (
          <Button variant="ghost" size="xs" onClick={onExport}>
            Export JSON
          </Button>
        ) : null}
      </div>
      <div className="grid grid-cols-2 @md:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.figure} className="flex flex-col gap-0.5 border-r border-b border-border px-3 py-2.5">
            <span className="text-xs text-muted-foreground">{t.label}</span>
            <span className={cn("text-[20px] leading-[26px] font-semibold tabular-nums", t.tone)}>{t.value}</span>
            {captionOf(t.figure) ? <span className="text-xs text-muted-foreground">{captionOf(t.figure)}</span> : null}
          </div>
        ))}
      </div>
      {connections.length ? (
        <>
          <Heading>What each connection did</Heading>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm tabular-nums">
              <thead>
                <tr className="border-b border-border text-xs tracking-[0.06em] text-muted-foreground uppercase">
                  <th className="px-2.5 py-1 text-left font-normal">Connection</th>
                  {["Calls", "Reads", "Writes", "Failed", "Read", "Returned"].map((h) => (
                    <th key={h} className="px-2.5 py-1 text-right font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {connections.map((c) => (
                  <tr key={c.name} className="border-b border-border">
                    <td className="px-2.5 py-[7px]">
                      <span className="flex items-center gap-2">
                        <Dot name={c.name} />
                        <span className="font-semibold">{c.name}</span>
                      </span>
                    </td>
                    <td className="px-2.5 text-right">{n(c.calls)}</td>
                    <td className="px-2.5 text-right">{c.tokens ? "—" : n(c.reads ?? c.calls)}</td>
                    <td className="px-2.5 text-right">{c.tokens ? "—" : n(c.writes ?? 0)}</td>
                    <td className="px-2.5 text-right">{n(c.failed ?? 0)}</td>
                    <td className="px-2.5 text-right">
                      {c.tokens ? `↑ ${k(c.tokens.in)}` : c.files !== undefined ? `${n(c.files)} files` : n(c.rows)}
                    </td>
                    <td className="px-2.5 text-right">
                      {c.tokens ? `↓ ${k(c.tokens.out)}` : c.returned !== undefined ? n(c.returned) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
      <Heading>What went wrong or needed you</Heading>
      <div className="flex flex-col gap-2 border-b border-border px-2.5 pt-1.5 pb-3">
        {issues.length ? (
          issues.map((issue, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onOpenStep?.(issue.step)}
              className="flex items-start gap-2 text-left leading-[18px]"
            >
              <span aria-hidden className={cn("mt-[5px] size-2 shrink-0 rounded-full", TONE[issue.tone])} />
              <span>
                {issue.text} <span className="text-info">See the step</span>
              </span>
            </button>
          ))
        ) : (
          <span className="text-muted-foreground">Nothing so far.</span>
        )}
      </div>
      <Heading>What left for the LLM</Heading>
      <div className="grid grid-cols-1 gap-3 border-b border-border px-2.5 pt-1.5 pb-3 @md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <span className="text-xs tracking-[0.06em] text-success uppercase">Sent</span>
          {(report.sent ?? []).map((s) => (
            <span key={s.label}>
              {s.label}
              {s.count !== undefined ? (
                <span className="text-muted-foreground tabular-nums">
                  {" "}
                  · {n(s.count)}
                  {s.chars !== undefined ? ` · ${n(s.chars)} characters` : ""}
                </span>
              ) : null}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs tracking-[0.06em] text-muted-foreground uppercase">Not sent</span>
          {(report.notSent?.length ? report.notSent : ["Nothing held back"]).map((x) => (
            <span key={x} className="text-muted-foreground">
              {x}
            </span>
          ))}
        </div>
      </div>
      {report.untouched?.length ? (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 p-2.5 text-sm text-muted-foreground">
          <span>Allowed in this World, not touched:</span>
          {report.untouched.map((u) => (
            <span key={u} className="rounded-control border border-dashed border-border px-1.5">
              {u}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  )
}
