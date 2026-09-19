import * as React from "react"

import { cn } from "../../lib/utils"
import { LayerChip, type Layer } from "./layer-chip"

/** The four roles a plan may name. Fixed — `tier` would not survive a re-cast. */
export type CastRole = "extract" | "decide" | "judge" | "embed"

/**
 * One thing a lens does to the world it is read against.
 *
 * A closed set, because the drawer's job is *what does this narrow* answered at
 * a glance, and a free-text summary is a sentence each caller writes
 * differently. Empty means the lens narrows nothing — which is a real state and
 * the row says so in words, never with a blank.
 */
export type Narrowing =
  | { kind: "allow"; count: number }
  | { kind: "deny"; count: number }
  | { kind: "sliced" }
  | { kind: "excludes"; properties: string[] }
  | { kind: "closes"; layers: Layer[] }
  | { kind: "casts"; roles: CastRole[] }

export interface LensUsage {
  /** How many runs opened under this lens. `0` is printed, not hidden. */
  runs: number
  /** Already humanised — `2h ago`. The row does not own a clock. */
  lastUsed?: string
}

export interface LensRowProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "onSelect"> {
  name: string
  narrows?: Narrowing[]
  usage?: LensUsage
  selected?: boolean
  onSelect?: (name: string) => void
}

function describe(n: Narrowing): React.ReactNode {
  switch (n.kind) {
    case "allow":
      return `${n.count} allow`
    case "deny":
      return `${n.count} deny`
    case "sliced":
      return "sliced"
    case "excludes":
      return `excludes ${n.properties.join(", ")}`
    case "casts":
      return `casts ${n.roles.join(", ")}`
    case "closes":
      return (
        <span className="inline-flex items-center gap-1">
          closes
          {n.layers.map((layer) => (
            <LayerChip key={layer} layer={layer} />
          ))}
        </span>
      )
  }
}

/**
 * One world in the Worlds drawer: its name, what it narrows, and how used it is.
 *
 * **What it narrows is chips, not prose.** A world is picked by comparing it
 * with the four above it, and four sentences do not compare — six fixed kinds
 * of narrowing do. `closes` renders its layers as `LayerChip`s because *which*
 * layer is closed is the part being compared.
 *
 * **A world that narrows nothing says so in words.** `Everything` is a real
 * world and the default one; a blank row would read as a world whose summary
 * failed to load, which is the opposite of the reassurance it is there to give.
 *
 * **Usage is a fact, not a ranking.** `used in 34 runs · last 2h ago` tells a
 * reader whether they are about to edit something live. It never sorts the list
 * — a world used once may be the one that matters, and a list that reorders
 * itself under you cannot be scanned twice.
 */
export const LensRow = React.forwardRef<HTMLDivElement, LensRowProps>(
  (
    { name, narrows = [], usage, selected, onSelect, className, ...props },
    ref,
  ) => {
    const interactive = Boolean(onSelect)

    return (
      <div
        ref={ref}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-pressed={interactive ? Boolean(selected) : undefined}
        onClick={interactive ? () => onSelect?.(name) : undefined}
        onKeyDown={
          interactive
            ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  onSelect?.(name)
                }
              }
            : undefined
        }
        className={cn(
          "flex min-w-0 flex-col gap-0.5 rounded-control px-2 py-1.5",
          interactive && "cursor-pointer hover:bg-accent",
          selected && "bg-accent",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          className,
        )}
        {...props}
      >
        <div className="flex min-w-0 items-baseline gap-2">
          <span className="min-w-0 truncate text-sm font-medium text-foreground">
            {name}
          </span>
          {usage ? (
            <span className="ml-auto shrink-0 text-meta text-muted-foreground">
              used in {usage.runs} run{usage.runs === 1 ? "" : "s"}
              {usage.lastUsed ? ` · last ${usage.lastUsed}` : ""}
            </span>
          ) : null}
        </div>

        {narrows.length ? (
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-meta text-muted-foreground">
            {narrows.map((n, i) => (
              <React.Fragment key={`${n.kind}-${i}`}>
                {i > 0 ? <span aria-hidden className="opacity-40">·</span> : null}
                <span className="inline-flex items-center">{describe(n)}</span>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <span className="text-meta text-muted-foreground/70">
            narrows nothing — the whole model, inside the guardrails
          </span>
        )}
      </div>
    )
  },
)
LensRow.displayName = "LensRow"
