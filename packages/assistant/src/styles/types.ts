import type * as React from "react"

import type { PresetRegistry } from "../conversations/registry"
import type { ConversationEvent, ConversationEventType } from "../protocol/events"
import type { PatchSource } from "../protocol/stream"
import type { AnswerState, ConversationSpec } from "../protocol/types"

/** `cli` is the console: caret prompts, status-dotted replies, step rows, a Tasks view. `web` is the chat: labelled turns, answer cards. */
export type ChatSessionVariant = "cli" | "web"

/** The event of one type — `ChatSessionEventOf<"reply">` is `{ type: "reply"; turn; value }`. */
export type ChatSessionEventOf<T extends ConversationEventType> = Extract<ConversationEvent, { type: T }>

type Camel<S extends string> = S extends `${infer Head}-${infer Rest}` ? `${Head}${Capitalize<Camel<Rest>>}` : S

/**
 * One typed callback per event: `onPrompt`, `onReply`, `onAction`,
 * `onOpenRun`, `onRate`, `onStop`, … Each receives exactly its event. They are
 * derived from {@link ConversationEvent}, so an event added to the protocol
 * gets its callback here with no other change.
 */
export type ChatSessionHandlers = {
  [T in ConversationEventType as `on${Capitalize<Camel<T>>}`]?: (event: ChatSessionEventOf<T>) => void
}

/**
 * The glyphs the session draws. The kit ships no icon set: pass your own nodes
 * (`{ send: <ArrowUp /> }`); anything left out falls back to a text glyph.
 */
export interface ChatSessionIcons {
  send: React.ReactNode
  stop: React.ReactNode
  attach: React.ReactNode
  close: React.ReactNode
  retry: React.ReactNode
  copy: React.ReactNode
  steps: React.ReactNode
  rateUp: React.ReactNode
  rateDown: React.ReactNode
}

/**
 * The actions on a settled answer, beside its time. `retry` is sent as
 * `retry`, `copy` as `copy` (and written to the clipboard), `steps` as
 * `toggle-steps`, `rate` as `rate`.
 */
export type ChatSessionBuiltInAction = "retry" | "copy" | "steps" | "rate"

/** An action of your own on a settled answer, sent as an `action` event with its `id`. */
export interface ChatSessionCustomAction {
  id: string
  /** Its accessible name and tooltip. */
  label: string
  icon: React.ReactNode
  /** Only on answers in these states. Every settled state when left out. */
  states?: AnswerState[]
}

export type ChatSessionAnswerAction = ChatSessionBuiltInAction | ChatSessionCustomAction

export const DEFAULT_ANSWER_ACTIONS: ChatSessionAnswerAction[] = ["retry", "copy", "steps", "rate"]

/** What the CLI variant shows: the thread, or every step of every reply. */
export type ChatSessionView = "chat" | "tasks"

export interface ChatSessionProps extends ChatSessionHandlers {
  /**
   * The whole conversation, as JSON — what the API sends. Controlled: apply
   * patches to it (`applyPatch`, `useChatSession`) and pass the result, or
   * hand the patches over as `stream`.
   */
  spec: ConversationSpec
  /** @default "web" */
  variant?: ChatSessionVariant
  /**
   * Every event, whatever its type, after its own callback — the one place to
   * forward everything to an API.
   */
  onEvent?: (event: ConversationEvent) => void
  /**
   * Patches to apply as they arrive — a streaming fetch (`fromNdjson`), an
   * EventSource (`fromEventSource`), a generator, or a recorded script
   * (`playScript`). The session draws `spec` with them applied; a new `spec`
   * starts over from it. Stopping ends the stream and records how far it got.
   *
   * Pass a function, `(signal) => source`, to open the source afresh each time
   * the session mounts — a generator can be read only once. Keep it stable
   * (module scope, `useCallback`): a new one starts a new stream.
   */
  stream?: PatchSource | ((signal: AbortSignal) => PatchSource) | null
  /** The stream ended; `spec` is the conversation as it left it. */
  onStreamEnd?: (spec: ConversationSpec) => void
  /** A patch did not apply, or the source failed. The stream stops there. */
  onStreamError?: (error: unknown) => void
  /** Renderers and traits of your own asks and blocks, merged over the built-ins. */
  registry?: PresetRegistry
  icons?: Partial<ChatSessionIcons>
  /**
   * The actions beside a settled answer's time, in order — the built-ins by
   * name, yours as `{ id, label, icon }`. `[]` shows none.
   * @default ["retry", "copy", "steps", "rate"]
   */
  actions?: ChatSessionAnswerAction[]
  /**
   * The clock, in ms. Left out, the session ticks while anything runs so
   * elapsed times move; a story passes a fixed one to read the same every run.
   */
  now?: number
  /** Shows a close control in the header. */
  onClose?: () => void
  /** Draw the header — title, turn count, close. @default true when the spec has a title */
  header?: boolean
  /** Shown when the spec has no turns yet. */
  emptyState?: React.ReactNode
  /** The CLI's view, controlled. */
  view?: ChatSessionView
  /** @default "chat" */
  defaultView?: ChatSessionView
  onViewChange?: (view: ChatSessionView) => void
  className?: string
}

/** What a parent can do to a session it holds a ref to. */
export interface ChatSessionHandle {
  /** Scroll a turn into view. */
  scrollToTurn: (turnId: string) => void
  /** Open or fold an answer's steps. */
  showSteps: (turnId: string, open?: boolean) => void
  /** Open one step's record — what went in and came out. */
  openStep: (turnId: string, stepId: string) => void
  setView: (view: ChatSessionView) => void
  /** Focus the composer. */
  focusComposer: () => void
}
