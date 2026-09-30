/**
 * Everything the analyst can do, as data. The component never acts on a
 * conversation itself: it reports an event, and the API answers with patches.
 *
 * Every event but `prompt`, `stop` and `setting` names the turn it came from.
 */
export type ConversationEvent =
  /**
   * A prompt. `settings` is what the composer's controls held — `{ mode: "nl",
   * model: "qwen" }`; `files` what was attached, as the browser gave them.
   */
  | { type: "prompt"; text: string; context?: string[]; settings?: Record<string, string>; files?: File[] }
  /** An ask was answered. `value` has the type its preset fixes. */
  | { type: "reply"; turn: string; value: unknown }
  /** An ask was skipped; its default is used and recorded. */
  | { type: "skip"; turn: string }
  /** An answered ask was changed. Re-runs from that turn, not from scratch. */
  | { type: "change"; turn: string; value: unknown }
  /** A proposal or approval action — `approve`, `create-drafts`. */
  | { type: "action"; turn: string; action: string }
  /** One part of an answer's scope line was edited. */
  | { type: "scope"; turn: string; part: number; value: unknown }
  /**
   * Open a block's records in full — the rows a table previews. `block` is its
   * index in the turn's `blocks`.
   */
  | { type: "open"; turn: string; block: number }
  /** Render the same records as another preset. */
  | { type: "template"; turn: string; preset: string }
  /** Change the current answer in place — `by-region`. */
  | { type: "refine"; turn: string; refine: string }
  | { type: "rate"; turn: string; value: number }
  | { type: "stop" }
  | { type: "retry"; turn: string }
  /** Open the whole run behind an answer — its elapsed time was clicked. `step` when one step was. */
  | { type: "open-run"; turn: string; step?: string }
  /** A composer control changed — the mode, the model, the timeout. */
  | { type: "setting"; id: string; value: string }

export type ConversationEventType = ConversationEvent["type"]

/** The event types, in the grammar's order. `grammar.test.ts` checks the union against it. */
export const EVENT_TYPES = [
  "prompt",
  "reply",
  "skip",
  "change",
  "action",
  "scope",
  "open",
  "template",
  "refine",
  "rate",
  "stop",
  "retry",
  "open-run",
  "setting",
] as const satisfies readonly ConversationEventType[]
