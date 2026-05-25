import * as React from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

import { cn } from "../../lib/utils"
import { Badge, badgeVariants } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { Separator } from "../ui/separator"
import { ErrorBoundary } from "./error-boundary"

/**
 * A single clickable/displayed reference shown in a step's
 * "REFERENCED COMPONENTS" row.
 */
export interface TourReference {
  label: string
  /** Optional leading icon (e.g. a Lucide component). */
  icon?: React.ElementType
  /** When set, the chip becomes a button. */
  onClick?: () => void
}

/**
 * A single step of a {@link Tour}. Provide the typed fields for the standard
 * layout, or use {@link TourStep.content} as an escape hatch to render a fully
 * custom body.
 */
export interface TourStep {
  id?: string
  title: React.ReactNode
  body?: React.ReactNode
  /** Highlighted callout box, e.g. label "LANGUAGE LESSON". */
  callout?: { label?: string; content: React.ReactNode }
  /** Chip row, e.g. label "REFERENCED COMPONENTS". */
  references?: { label?: string; items: TourReference[] }
  /** Replaces the typed body/callout/references region when provided. */
  content?: React.ReactNode
}

/** Step state + navigation handlers, produced by {@link useTour}. */
export interface TourController {
  step: TourStep | undefined
  /** 0-based index of the active step. */
  current: number
  total: number
  isFirst: boolean
  isLast: boolean
  next: () => void
  prev: () => void
  goTo: (index: number) => void
  exit: () => void
}

export interface UseTourOptions {
  steps: TourStep[]
  /** Initial 0-based step index. Default `0`. */
  initialStep?: number
  /** Wrap around at the ends instead of stopping. Default `false`. */
  loop?: boolean
  onStepChange?: (index: number) => void
  /** Called when `next` is pressed on the last step (and not looping). */
  onComplete?: () => void
  /** Called when `exit` is invoked. */
  onExit?: () => void
}

/**
 * Headless controller for a {@link Tour}. Owns the current step index and
 * exposes navigation handlers. Pass the result to `<Tour controller={...} />`,
 * or let `<Tour steps={...} />` manage its own controller internally.
 */
export function useTour(options: UseTourOptions): TourController {
  const {
    steps,
    initialStep = 0,
    loop = false,
    onStepChange,
    onComplete,
    onExit,
  } = options

  const [current, setCurrent] = React.useState(initialStep)
  const total = steps.length
  const lastIndex = Math.max(total - 1, 0)
  const clamped = Math.min(Math.max(current, 0), lastIndex)

  const goTo = React.useCallback(
    (index: number) => {
      setCurrent((prev) => {
        const next = Math.min(Math.max(index, 0), lastIndex)
        if (next !== prev) onStepChange?.(next)
        return next
      })
    },
    [lastIndex, onStepChange]
  )

  const next = React.useCallback(() => {
    setCurrent((prev) => {
      if (prev >= lastIndex) {
        if (loop && total > 0) {
          onStepChange?.(0)
          return 0
        }
        onComplete?.()
        return prev
      }
      onStepChange?.(prev + 1)
      return prev + 1
    })
  }, [lastIndex, total, loop, onComplete, onStepChange])

  const prev = React.useCallback(() => {
    setCurrent((p) => {
      if (p <= 0) {
        if (loop && total > 0) {
          onStepChange?.(lastIndex)
          return lastIndex
        }
        return p
      }
      onStepChange?.(p - 1)
      return p - 1
    })
  }, [lastIndex, total, loop, onStepChange])

  const exit = React.useCallback(() => {
    onExit?.()
  }, [onExit])

  return React.useMemo<TourController>(
    () => ({
      step: steps[clamped],
      current: clamped,
      total,
      isFirst: clamped <= 0,
      isLast: clamped >= lastIndex,
      next,
      prev,
      goTo,
      exit,
    }),
    [steps, clamped, total, lastIndex, next, prev, goTo, exit]
  )
}

type TourPosition =
  | "static"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center"

const positionClasses: Record<TourPosition, string> = {
  static: "",
  "top-left": "fixed left-4 top-4 z-50",
  "top-right": "fixed right-4 top-4 z-50",
  "bottom-left": "fixed bottom-4 left-4 z-50",
  "bottom-right": "fixed bottom-4 right-4 z-50",
  center: "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
}

export interface TourProps {
  /** External controller from {@link useTour}. Omit to self-manage from `steps`. */
  controller?: TourController
  /** Steps used to build an internal controller when `controller` is omitted. */
  steps?: TourStep[]
  onExit?: () => void
  onComplete?: () => void

  badgeLabel?: string
  prevLabel?: string
  nextLabel?: string
  /** Label for the Next button on the last step. */
  finishLabel?: string
  exitLabel?: string
  showExit?: boolean
  /** Show the "{current} / {total}" counter. Default `true`. */
  showCounter?: boolean
  /** Show a slim progress bar under the header. Default `false`. */
  showProgressBar?: boolean
  position?: TourPosition
  className?: string
}

/**
 * A self-contained, step-through tour panel: header with a label badge, step
 * counter and exit action; a body with title, copy, an accented callout and a
 * row of reference chips; and Prev / Next footer controls.
 *
 * @example
 * ```tsx
 * <Tour steps={steps} onExit={close} onComplete={close} />
 * ```
 * @example
 * ```tsx
 * const tour = useTour({ steps, onExit: close });
 * <Tour controller={tour} position="bottom-right" />
 * ```
 */
export function Tour({
  controller,
  steps,
  onExit,
  onComplete,
  badgeLabel = "TOUR",
  prevLabel = "Prev",
  nextLabel = "Next",
  finishLabel = "Finish",
  exitLabel = "Exit Tour",
  showExit = true,
  showCounter = true,
  showProgressBar = false,
  position = "static",
  className,
}: TourProps) {
  // Hooks must run unconditionally; the internal controller is ignored when an
  // external `controller` is supplied.
  const internal = useTour({ steps: steps ?? [], onExit, onComplete })
  const ctrl = controller ?? internal

  const { step, current, total, isFirst, isLast } = ctrl

  if (!step) return null

  const progress = total > 0 ? ((current + 1) / total) * 100 : 0

  return (
    <ErrorBoundary>
      <Card
        className={cn(
          "w-80 gap-0 border-border bg-popover p-0 text-popover-foreground shadow-xl",
          positionClasses[position],
          className
        )}
        role="dialog"
        aria-label={typeof badgeLabel === "string" ? badgeLabel : undefined}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3">
          <div className="flex items-center gap-2">
            <Badge variant="soft" className="tracking-wider">
              {badgeLabel}
            </Badge>
            {showCounter && (
              <span className="text-xs text-muted-foreground">
                {current + 1} / {total}
              </span>
            )}
          </div>
          {showExit && (
            <Button
              variant="ghost"
              size="sm"
              className="-mr-1 h-7 gap-1 px-2 text-xs text-muted-foreground [&_svg]:size-3.5"
              onClick={ctrl.exit}
            >
              <X />
              {exitLabel}
            </Button>
          )}
        </CardHeader>

        {showProgressBar && (
          <div className="mx-3 h-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <CardContent className="space-y-4 p-3 pt-2">
          <h3 className="text-base font-semibold leading-snug">{step.title}</h3>

          {step.content ?? (
            <>
              {step.body && (
                <div className="text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </div>
              )}

              {step.callout && (
                <div className="rounded-r-md border-l-2 border-primary bg-muted/40 p-3">
                  {step.callout.label && (
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                      {step.callout.label}
                    </div>
                  )}
                  <div className="text-sm leading-relaxed">
                    {step.callout.content}
                  </div>
                </div>
              )}

              {step.references && step.references.items.length > 0 && (
                <div className="space-y-2">
                  {step.references.label && (
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {step.references.label}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {step.references.items.map((item, i) => {
                      const Icon = item.icon
                      return item.onClick ? (
                        <button
                          key={`${item.label}-${i}`}
                          type="button"
                          onClick={item.onClick}
                          className={cn(
                            badgeVariants({ variant: "secondary" }),
                            "cursor-pointer gap-1 transition-colors hover:bg-accent hover:text-accent-foreground"
                          )}
                        >
                          {Icon && <Icon className="size-3" />}
                          {item.label}
                        </button>
                      ) : (
                        <Badge
                          key={`${item.label}-${i}`}
                          variant="secondary"
                          className="gap-1"
                        >
                          {Icon && <Icon className="size-3" />}
                          {item.label}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>

        <Separator />

        <CardFooter className="justify-between p-3">
          <Button
            variant="outline"
            size="sm"
            onClick={ctrl.prev}
            disabled={isFirst}
            className="gap-1 [&_svg]:size-4"
          >
            <ChevronLeft />
            {prevLabel}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={ctrl.next}
            className="gap-1 [&_svg]:size-4"
          >
            {isLast ? finishLabel : nextLabel}
            <ChevronRight />
          </Button>
        </CardFooter>
      </Card>
    </ErrorBoundary>
  )
}
