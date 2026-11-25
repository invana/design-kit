import * as React from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { PlayButton, StepperDots, type Stepper } from "./stepper"

/** One step a presenter shows: its title, and what is said over it. */
export interface PresenterStep {
  id: string
  title: React.ReactNode
  /** What is said over the step — a story's caption, a playbook's narration. */
  narration?: React.ReactNode
}

export interface PresenterProps {
  /** The walk: from `useStepper`, or a host's stepper over its own engine. */
  stepper: Stepper
  steps: PresenterStep[]
  /**
   * `deck` (default): the step's title and narration at reading size, `Step n / N`, ◀ Previous ·
   * the dots · Next ▶, Play, ✕. `compact`: the title as the prompt it answers, the narration
   * beside an icon, the dots — the moves are a `StepperControls` elsewhere (a toolbar).
   */
  variant?: "deck" | "compact"
  /** One dot per step. Default `true`. */
  showDots?: boolean
  /** Deck: Play / Pause. Default: when the stepper can play. */
  showPlay?: boolean
  /** Deck: leave presenting. Omit it and there is no ✕. */
  onClose?: () => void
  /** Compact: what leads the title. */
  renderTitleIcon?: (step: PresenterStep) => React.ReactNode
  /** Compact: the icon beside the narration. */
  narrationIcon?: React.ReactNode
  /** The presenter's accessible name. */
  label?: string
  emptyLabel?: string
  /** Shown before the first step, when the stepper has a position before it. */
  startLabel?: string
  previousLabel?: string
  nextLabel?: string
  closeLabel?: string
  className?: string
}

/**
 * A script presented step by step — a board's story, a canvas playbook: the step's title and
 * narration, where the walk is, and the moves. It draws a `Stepper` and knows nothing of what a
 * step changes; the host does that in the stepper's `onMove`. ← → step while focus is inside it.
 */
export function Presenter({
  stepper,
  steps,
  variant = "deck",
  showDots = true,
  showPlay = stepper.canPlay,
  onClose,
  renderTitleIcon,
  narrationIcon,
  label = "Presenter",
  emptyLabel = "No steps",
  startLabel = "Start",
  previousLabel = "Previous",
  nextLabel = "Next",
  closeLabel = "Close",
  className,
}: PresenterProps) {
  const { index, count, busy, error } = stepper
  const current = index >= 0 ? steps[index] : undefined
  const idle = count === 0 ? emptyLabel : startLabel
  const dots = showDots ? (
    <StepperDots
      stepper={stepper}
      labels={steps.map((s) => (typeof s.title === "string" ? s.title : ""))}
      className="flex-1"
    />
  ) : (
    <div className="flex-1" />
  )

  if (variant === "compact") {
    return (
      <Card
        role="group"
        aria-label={label}
        tabIndex={0}
        onKeyDown={stepper.onKeyDown}
        className={cn("flex flex-col gap-2 p-3 outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
      >
        {current ? (
          <>
            <div className="flex items-center gap-2" aria-live="polite">
              {renderTitleIcon?.(current)}
              <span className="rounded-sm bg-accent px-2 py-1">{current.title}</span>
            </div>
            {current.narration && (
              <div className={cn("flex items-start gap-2", busy && "opacity-50")}>
                {narrationIcon}
                <div className="line-clamp-4 leading-relaxed">{current.narration}</div>
              </div>
            )}
          </>
        ) : (
          <span className="text-muted-foreground">{idle}</span>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {dots}
      </Card>
    )
  }

  return (
    <Card
      role="group"
      aria-label={label}
      tabIndex={0}
      onKeyDown={stepper.onKeyDown}
      className={cn("flex flex-col gap-2 p-3 outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
    >
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1" aria-live="polite">
          <span className="font-semibold">{current ? current.title : idle}</span>
          {current?.narration && <div className="leading-relaxed text-muted-foreground">{current.narration}</div>}
        </div>
        <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
          {count === 0 ? "" : index < 0 ? `${count} steps` : `Step ${index + 1} / ${count}`}
        </span>
        {onClose && (
          <Button variant="ghost" size="icon-xs" aria-label={closeLabel} onClick={onClose} className="-mr-1 -mt-1">
            <X />
          </Button>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!stepper.canPrevious}
          onClick={() => void stepper.previous()}
        >
          <ChevronLeft />
          {previousLabel}
        </Button>
        {dots}
        {showPlay && <PlayButton stepper={stepper} />}
        <Button variant="outline" size="sm" disabled={!stepper.canNext} onClick={() => void stepper.next()}>
          {nextLabel}
          <ChevronRight />
        </Button>
      </div>
    </Card>
  )
}
