import * as React from "react"
import { useStreamedSpec } from "@invana/blocks"

import { resolveRegistry } from "../conversations/registry"
import type { ConversationEvent } from "../protocol/events"
import { applyPatches } from "../protocol/reduce"
import { stopPatches } from "../protocol/stream"
import { useStopKey } from "./base/chrome"
import {
  ChatSessionContext,
  type ChatSessionContextValue,
  DEFAULT_ICONS,
  useClock,
  useViewState,
} from "./base/context"
import { isAnswer, runOutcome, turnDomId } from "./base/model"
import { CliSession } from "./cli/cli-session"
import { type ChatSessionHandle, type ChatSessionProps, type ChatSessionView, DEFAULT_ANSWER_ACTIONS } from "./types"
import { WebSession } from "./web/web-session"

/** `open-run` → `onOpenRun`: the callback prop an event goes to. */
const handlerName = (type: string) =>
  `on${type.replace(/(^|-)([a-z])/g, (_, __, c: string) => c.toUpperCase())}`

/**
 * A conversation with the assistant, drawn from JSON alone, in one of two
 * variants: `cli`, the console, or `web`, the chat.
 *
 * The API sends a {@link ConversationSpec}, then patches — pass the patched
 * spec, or the patches themselves as `stream`. Every ask and block is drawn by
 * the block registry, so templates of your own draw exactly like the
 * built-ins; the session itself knows no block. Everything the analyst does
 * comes back as a typed event: to its own callback (`onReply`, `onAction`,
 * `onOpenRun`, …) and then to `onEvent`.
 */
export const ChatSession = React.forwardRef<ChatSessionHandle, ChatSessionProps>(function ChatSession(
  props,
  ref,
) {
  const {
    spec,
    variant = "web",
    stream,
    onStreamEnd,
    onStreamError,
    registry,
    icons,
    now: fixedNow,
    onClose,
    header,
    emptyState,
    view: controlledView,
    defaultView = "chat",
    actions = DEFAULT_ANSWER_ACTIONS,
    className,
  } = props

  // Read as every shell reads its stream; stopping records how far it got.
  const { live, stop: stopStream } = useStreamedSpec(spec, stream, applyPatches, {
    onEnd: onStreamEnd,
    onError: onStreamError,
    stopPatches,
  })
  // A run held on the analyst's answer is not in flight: the composer takes
  // their words, and there is nothing to stop.
  const running = live.turns.some((t) => isAnswer(t) && runOutcome(t) === "live")
  const now = useClock(fixedNow, running)
  const resolved = React.useMemo(() => resolveRegistry(registry), [registry])
  const resolvedIcons = React.useMemo(() => ({ ...DEFAULT_ICONS, ...icons }), [icons])
  const viewState = useViewState()
  const [uncontrolledView, setUncontrolledView] = React.useState<ChatSessionView>(defaultView)
  const view = controlledView ?? uncontrolledView
  const root = React.useRef<HTMLDivElement>(null)
  const composer = React.useRef<HTMLDivElement | null>(null)
  const setComposer = React.useCallback((element: HTMLDivElement | null) => {
    composer.current = element
  }, [])

  // The latest props and spec, so `emit` and the rest stay one function for the session's life.
  const latest = React.useRef(props)
  const liveRef = React.useRef(live)
  React.useLayoutEffect(() => {
    latest.current = props
    liveRef.current = live
  })
  const emit = React.useCallback((event: ConversationEvent) => {
    const handler = (latest.current as unknown as Record<string, unknown>)[handlerName(event.type)]
    if (typeof handler === "function") handler(event)
    latest.current.onEvent?.(event)
  }, [])

  const stop = React.useCallback(() => {
    stopStream()
    emit({ type: "stop" })
  }, [stopStream, emit])
  useStopKey(running, stop)

  const setView = React.useCallback(
    (next: ChatSessionView) => {
      if (latest.current.view === undefined) setUncontrolledView(next)
      latest.current.onViewChange?.(next)
    },
    [],
  )

  const scrollToTurn = React.useCallback((turnId: string) => {
    // After the frame's own follow-the-bottom, which a step list opening would trigger.
    setTimeout(() => {
      const id = turnDomId(liveRef.current, turnId)
      root.current
        ?.querySelector(`[id="${CSS.escape(id)}"]`)
        ?.scrollIntoView({ block: "start", behavior: "smooth" })
    }, 80)
  }, [])
  const focusComposer = React.useCallback(() => {
    composer.current?.querySelector("textarea")?.focus()
  }, [])

  React.useImperativeHandle(
    ref,
    () => ({
      scrollToTurn,
      showSteps: (turnId, open = true) => viewState.toggleSteps(turnId, open),
      openStep: (turnId, stepId) => {
        viewState.toggleSteps(turnId, true)
        viewState.toggleRecord(turnId, stepId, true)
        scrollToTurn(turnId)
      },
      setView,
      focusComposer,
    }),
    [scrollToTurn, setView, focusComposer, viewState],
  )

  const context: ChatSessionContextValue = {
    spec: live,
    registry: resolved,
    emit,
    icons: resolvedIcons,
    now,
    opensRuns: typeof props.onOpenRun === "function",
    stepsOpen: viewState.stepsOpen,
    toggleSteps: viewState.toggleSteps,
    setSteps: (turnId, open) => {
      viewState.toggleSteps(turnId, open)
      emit({ type: "toggle-steps", turn: turnId, open })
    },
    actions,
    recordOpen: viewState.recordOpen,
    toggleRecord: viewState.toggleRecord,
    rating: viewState.rating,
    rate: viewState.setRating,
    view,
    setView,
    scrollToTurn,
    focusComposer,
    setComposer,
  }

  const shared = {
    running,
    onStop: stop,
    header: header === undefined ? !!live.title : header,
    onClose,
    emptyState,
    className,
  }
  return (
    <ChatSessionContext.Provider value={context}>
      <div ref={root} data-variant={variant} className="contents">
        {variant === "cli" ? <CliSession {...shared} /> : <WebSession {...shared} />}
      </div>
    </ChatSessionContext.Provider>
  )
})
