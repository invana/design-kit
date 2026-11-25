import * as React from "react"
import { ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "../ui/button"

/**
 * The one base every stepped walk is built on — a `Tour` of the interface, a `Presenter` of a
 * script (a board's story, a canvas playbook). It knows no step's content: only how many there
 * are, where the walk is, and how to move.
 *
 * - **Held or hosted.** Omit `index` and the stepper holds the position; pass it and the host
 *   does (a canvas playbook whose position lives in the engine), and `onMove` is asked to move.
 * - **One move at a time.** `onMove` may return a promise — playing a canvas step lays it out
 *   and glides the camera — and the stepper is `busy` until it settles. A move asked for while
 *   busy (a held key, a double click) is dropped, never queued. A move that throws is `error`.
 * - **Before the first.** `before` adds position `-1`: nothing played yet, as a playbook starts.
 * - **Play.** With `playEvery`, `play` steps on by itself at that pace and stops at the last
 *   step; any key or click anywhere stops it, so a reader always has the walk back.
 */
export interface UseStepperOptions {
  /** How many steps there are. */
  count: number
  /** The position, when the host holds it; omit to let the stepper hold it. */
  index?: number
  /** Where a stepper that holds the position starts. Default the lowest position. */
  initial?: number
  /** A position before the first step exists, `-1`. Default `false`. */
  before?: boolean
  /** Wrap around at the ends instead of stopping. Default `false`. */
  loop?: boolean
  /** Asked to move to `to`; may return a promise, and the stepper is busy until it settles. */
  onMove?: (to: number) => void | Promise<void>
  /** `next` on the last step, not looping. */
  onComplete?: () => void
  /** Play's pace in ms. Omit it and the walk cannot play. */
  playEvery?: number
}

/** A stepper's state and its moves, from {@link useStepper}. */
export interface Stepper {
  /** The position: `0`-based, `-1` before the first step. */
  index: number
  count: number
  /** At the lowest position (`0`, or `-1` with `before`). */
  isFirst: boolean
  /** At the last step. */
  isLast: boolean
  canNext: boolean
  canPrevious: boolean
  /** A move is in flight. */
  busy: boolean
  /** Why the last move failed, until the next one. */
  error: string | null
  /** The walk can play (`playEvery` given, and there are steps). */
  canPlay: boolean
  playing: boolean
  next: () => Promise<void>
  previous: () => Promise<void>
  goTo: (index: number) => Promise<void>
  /** Step on by itself; from the last step, start over. */
  play: () => void
  pause: () => void
  /** ← → and PageUp / PageDown step, for the element the reader focuses. */
  onKeyDown: (event: React.KeyboardEvent) => void
}

const NEXT_KEYS = new Set(["ArrowRight", "PageDown"])
const PREVIOUS_KEYS = new Set(["ArrowLeft", "PageUp"])

/** A stepper over `count` steps. Headless: `StepperControls`, `StepperDots`, `Tour` and `Presenter` draw it. */
export function useStepper(options: UseStepperOptions): Stepper {
  const { count, before = false, loop = false, playEvery } = options
  const lowest = before ? -1 : 0
  const last = Math.max(count - 1, lowest)
  const clamp = React.useCallback((i: number) => Math.min(Math.max(i, lowest), last), [lowest, last])

  const [held, setHeld] = React.useState(options.initial ?? lowest)
  const hosted = options.index !== undefined
  const index = clamp(hosted ? (options.index as number) : held)

  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [playing, setPlaying] = React.useState(false)

  // What the moves read: the latest commit's position and callbacks, synced before any event
  // reaches a handler, so a callback fires once per move and never from inside a state updater.
  const at = React.useRef(index)
  const busyNow = React.useRef(false)
  const callbacks = React.useRef({ onMove: options.onMove, onComplete: options.onComplete })
  React.useLayoutEffect(() => {
    at.current = index
    callbacks.current = { onMove: options.onMove, onComplete: options.onComplete }
  })

  const move = React.useCallback(
    async (to: number) => {
      const target = clamp(to)
      if (target === at.current || busyNow.current) return
      busyNow.current = true
      setBusy(true)
      setError(null)
      try {
        if (!hosted) {
          at.current = target
          setHeld(target)
        }
        await callbacks.current.onMove?.(target)
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
        setPlaying(false)
      } finally {
        busyNow.current = false
        setBusy(false)
      }
    },
    [clamp, hosted]
  )

  const next = React.useCallback(async () => {
    if (at.current < last) return move(at.current + 1)
    if (loop && count > 0) return move(lowest)
    callbacks.current.onComplete?.()
  }, [count, last, loop, lowest, move])

  const previous = React.useCallback(async () => {
    if (at.current > lowest) return move(at.current - 1)
    if (loop && count > 0) return move(last)
  }, [count, last, loop, lowest, move])

  const canPlay = playEvery !== undefined && count > 0
  const play = React.useCallback(() => {
    if (!canPlay) return
    if (at.current >= last && !loop) void move(lowest)
    setPlaying(true)
  }, [canPlay, last, loop, lowest, move])
  const pause = React.useCallback(() => setPlaying(false), [])

  // Playing: one step per `playEvery`, each after the last has settled; stop at the end.
  React.useEffect(() => {
    if (!playing || busy || playEvery === undefined) return
    const timer = setTimeout(async () => {
      const to = at.current + 1
      await next()
      if (to >= last && !loop) setPlaying(false)
    }, playEvery)
    return () => clearTimeout(timer)
  }, [playing, busy, index, last, loop, next, playEvery])

  // Any key or click stops playing. A Play / Pause button stops its own pointerdown reaching here.
  React.useEffect(() => {
    if (!playing) return
    const stop = () => setPlaying(false)
    window.addEventListener("keydown", stop)
    window.addEventListener("pointerdown", stop)
    return () => {
      window.removeEventListener("keydown", stop)
      window.removeEventListener("pointerdown", stop)
    }
  }, [playing])

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (NEXT_KEYS.has(event.key)) {
        event.preventDefault()
        void next()
      } else if (PREVIOUS_KEYS.has(event.key)) {
        event.preventDefault()
        void previous()
      }
    },
    [next, previous]
  )

  return React.useMemo<Stepper>(
    () => ({
      index,
      count,
      isFirst: index <= lowest,
      isLast: index >= last,
      canNext: count > 0 && (index < last || loop),
      canPrevious: count > 0 && (index > lowest || loop),
      busy,
      error,
      canPlay,
      playing,
      next,
      previous,
      goTo: move,
      play,
      pause,
      onKeyDown,
    }),
    [index, count, lowest, last, loop, busy, error, canPlay, playing, next, previous, move, play, pause, onKeyDown]
  )
}

export interface StepperControlsProps {
  stepper: Stepper
  /** Show Play / Pause. Default: when the stepper can play. */
  showPlay?: boolean
  /** Leave the walk. Omit it and there is no ✕. */
  onClose?: () => void
  previousLabel?: string
  nextLabel?: string
  closeLabel?: string
  className?: string
}

/**
 * ◀ · `n/N` · ▶ (· Play) (· ✕) — a stepper's moves at toolbar size. Every button carries a
 * name, and ← → step while focus is inside it.
 */
export function StepperControls({
  stepper,
  showPlay = stepper.canPlay,
  onClose,
  previousLabel = "Previous step",
  nextLabel = "Next step",
  closeLabel = "Close",
  className,
}: StepperControlsProps) {
  const { index, count, busy } = stepper
  return (
    <div
      role="group"
      aria-label="Steps"
      aria-busy={busy}
      onKeyDown={stepper.onKeyDown}
      className={cn("inline-flex items-center gap-0.5", className)}
    >
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={previousLabel}
        disabled={!stepper.canPrevious}
        onClick={() => void stepper.previous()}
      >
        <ChevronLeft />
      </Button>
      <span className="min-w-8 text-center text-sm tabular-nums text-muted-foreground" aria-live="polite">
        {`${Math.max(index + 1, 0)}/${count}`}
      </span>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={nextLabel}
        disabled={!stepper.canNext}
        onClick={() => void stepper.next()}
      >
        <ChevronRight />
      </Button>
      {showPlay && <PlayButton stepper={stepper} />}
      {onClose && (
        <Button variant="ghost" size="icon-sm" aria-label={closeLabel} onClick={onClose}>
          <X />
        </Button>
      )}
    </div>
  )
}

/** Play or Pause; its own click and Enter / Space never reach the stepper's "any key or click stops it". */
export function PlayButton({ stepper, className }: { stepper: Stepper; className?: string }) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={stepper.playing ? "Pause" : "Play"}
      aria-pressed={stepper.playing}
      disabled={!stepper.canPlay}
      className={className}
      onPointerDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        // Its own activation keys toggle it; every other key still stops playing.
        if (e.key === "Enter" || e.key === " ") e.stopPropagation()
      }}
      onClick={() => (stepper.playing ? stepper.pause() : stepper.play())}
    >
      {stepper.playing ? <Pause /> : <Play />}
    </Button>
  )
}

export interface StepperDotsProps {
  stepper: Stepper
  /** Each step's name, for its dot's tooltip and accessible name. */
  labels?: string[]
  className?: string
}

/** One dot per step — done, current, to come; a click moves there, and ← → step while focus is on one. */
export function StepperDots({ stepper, labels = [], className }: StepperDotsProps) {
  const { index, count, busy } = stepper
  return (
    <div
      role="group"
      aria-label="Step dots"
      aria-busy={busy}
      onKeyDown={stepper.onKeyDown}
      className={cn("flex min-w-0 flex-wrap items-center justify-center gap-0.5", className)}
    >
      {Array.from({ length: count }, (_, i) => {
        const name = labels[i] ? `${i + 1}. ${labels[i]}` : `${i + 1}`
        return (
          <Button
            key={i}
            variant="ghost"
            size="icon-xs"

            title={name}
            aria-label={`Go to step ${name}`}
            aria-current={i === index ? "step" : undefined}
            onClick={() => {
              if (i !== index) void stepper.goTo(i)
            }}
          >
            <span
              className={cn(
                "size-2 rounded-full",
                i === index ? "bg-primary" : i < index ? "bg-primary/40" : "bg-muted-foreground/30"
              )}
            />
          </Button>
        )
      })}
    </div>
  )
}
