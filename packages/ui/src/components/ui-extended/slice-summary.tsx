import * as React from "react"

import { cn } from "../../lib/utils"

/** A slice along the axes the matched model **declared**. */
export interface RuleSelect {
  time?: { axis: string; from?: string; to?: string }
  geo?: { axis: string; vocab?: string; in: string[] }
  dims?: Record<string, string[]>
}

/**
 * What a published model version says may be narrowed.
 *
 * Empty is the default and means *nothing is selectable* — the model can still
 * be allowed or denied whole, it simply cannot be sliced. Nothing is inferred
 * from a property's name or type, because that would make *which rows did this
 * run see* depend on a guess.
 */
export interface DeclaredAxes {
  time?: { property: string }
  geo?: { property: string; vocab?: string }
  dims?: string[]
}

export interface SliceLine {
  /** `time` · `geo` · a dimension's own name. */
  axisKind: string
  text: string
  /** The model declared no such axis — this slice would be refused at save. */
  undeclared?: boolean
}

/**
 * One slice, as lines, with **the axis always named**.
 *
 * `time 2026-01-01 → 2026-06-30 · axis signed_at`. The axis is never implied: a
 * model declares which property carries valid time, two models in one Graph
 * declare different ones, and *which rows did this run see* must not depend on
 * the reader guessing which was used.
 *
 * When `declared` is given, a slice along an axis the model never declared is
 * marked — that is the refusal the authoring form has to show before a save,
 * naming the model **and** the axis.
 */
export function describeSlice(
  select: RuleSelect,
  declared?: DeclaredAxes,
): SliceLine[] {
  const out: SliceLine[] = []

  if (select.time) {
    const { axis, from, to } = select.time
    out.push({
      axisKind: "time",
      text: `time ${from ?? "…"} → ${to ?? "…"} · axis ${axis}`,
      undeclared: declared ? declared.time == null : undefined,
    })
  }
  if (select.geo) {
    const { axis, vocab, in: values } = select.geo
    out.push({
      axisKind: "geo",
      text: `geo ${values.join(", ")} · axis ${axis}${vocab ? ` · ${vocab}` : ""}`,
      undeclared: declared ? declared.geo == null : undefined,
    })
  }
  for (const [dim, values] of Object.entries(select.dims ?? {})) {
    out.push({
      axisKind: dim,
      text: `${dim} ${values.join(", ")}`,
      undeclared: declared ? !(declared.dims ?? []).includes(dim) : undefined,
    })
  }
  return out
}

export interface SliceSummaryProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  select?: RuleSelect
  /**
   * The matched model version's declared axes. Given, the summary can mark a
   * slice the model cannot support; omitted, it states the slice and claims
   * nothing about whether it is legal.
   */
  declaredAxes?: DeclaredAxes
  /** Which model is being sliced — named in the undeclared-axis refusal. */
  modelLabel?: string
  /** `line` sits under a `RuleRow`; `block` stands alone on W3 and R2. */
  variant?: "line" | "block"
}

/**
 * What a rule narrows to, stated so the axis is never in doubt.
 *
 * **The axis is always named.** See {@link describeSlice} — this is the one
 * rule the component exists to hold, and it is why a slice is a component
 * rather than a template string at each call site.
 *
 * **An undeclared axis is shown, not hidden.** A lens asking for an axis a
 * model never declared is refused at save naming the model and the axis, so the
 * form has to render the illegal state on the way to being told about it.
 * Silently dropping the line would make the refusal arrive from nowhere.
 *
 * `variant="line"` is what a `RuleRow` renders — the same description, so the
 * two never drift into two accounts of one slice.
 */
export const SliceSummary = React.forwardRef<HTMLDivElement, SliceSummaryProps>(
  (
    { select, declaredAxes, modelLabel, variant = "line", className, ...props },
    ref,
  ) => {
    const lines = select ? describeSlice(select, declaredAxes) : []

    if (!lines.length) {
      return (
        <div
          ref={ref}
          className={cn("text-meta text-muted-foreground/70", className)}
          {...props}
        >
          not sliced — the whole model
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex min-w-0 flex-col gap-0.5",
          variant === "block" && "rounded-control border border-border p-2",
          className,
        )}
        {...props}
      >
        {lines.map((line) => (
          <div key={line.axisKind} className="flex min-w-0 flex-col">
            <span
              className={cn(
                "truncate text-meta",
                line.undeclared
                  ? "text-destructive line-through decoration-destructive/50"
                  : "text-muted-foreground",
              )}
            >
              {line.text}
            </span>
            {line.undeclared ? (
              <span className="text-meta text-destructive">
                {modelLabel ?? "this model"} declares no {line.axisKind} axis, so
                it cannot be sliced by one. Declaring one is a modelling act.
              </span>
            ) : null}
          </div>
        ))}
      </div>
    )
  },
)
SliceSummary.displayName = "SliceSummary"
