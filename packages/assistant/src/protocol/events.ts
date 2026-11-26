/**
 * Everything the analyst can do, as data. The component never acts on a
 * conversation itself: it reports an event, and the API answers with patches.
 *
 * Every event but `prompt`, `stop`, `setting`, `remove-context`, `history`, `new-conversation` and
 * `open-conversation` names the turn it came from.
 */
export type ConversationEvent =
  /**
   * A prompt. `settings` is what the composer's controls held — `{ mode: "nl",
   * model: "qwen" }`; `files` what was attached, as the browser gave them;
   * `context` the ids of the composer's context chips.
   */
  | { type: "prompt"; text: string; context?: string[]; settings?: Record<string, string>; files?: File[] }
  /** An ask was answered. `value` has the type its block fixes. */
  | { type: "reply"; turn: string; value: unknown }
  /** An ask was skipped; its default is used and recorded. */
  | { type: "skip"; turn: string }
  /** An answered ask was changed. Re-runs from that turn, not from scratch. */
  | { type: "change"; turn: string; value: unknown }
  /**
   * An action the answer's spec declares — `approve`, `create-drafts` — or one a
   * block names with what it carries: `select` with a table row's key,
   * `download` with a file's digest.
   */
  | { type: "action"; turn: string; action: string; value?: unknown }
  /** One part of an answer's scope line was edited. */
  | { type: "scope"; turn: string; part: number; value: unknown }
  /**
   * Open a block's records in full — the rows a table previews. `block` is its
   * index in the turn's `blocks`.
   */
  | { type: "open"; turn: string; block: number }
  /** Render the same records as another block. */
  | { type: "template"; turn: string; kind: string }
  /** Change the current answer in place — `by-region`. */
  | { type: "refine"; turn: string; refine: string }
  | { type: "rate"; turn: string; value: number }
  | { type: "stop" }
  | { type: "retry"; turn: string }
  /** Open the whole run behind an answer — its elapsed time was clicked. `step` when one step was. */
  | { type: "open-run"; turn: string; step?: string }
  /** A composer control changed — the mode, the model, the timeout. */
  | { type: "setting"; id: string; value: string }
  /** An answer's words were copied, as `text`. */
  | { type: "copy"; turn: string; text: string }
  /** An answer's steps were opened or folded. */
  | { type: "toggle-steps"; turn: string; open: boolean }
  /** A context chip's × was clicked: the host takes it out of `composer.context`. */
  | { type: "remove-context"; id: string }
  /** The header's History was clicked: the host shows its list of conversations, one step back. */
  | { type: "history" }
  /** The header's New, or the list's, was clicked: the host starts an empty conversation. */
  | { type: "new-conversation" }
  /** A conversation was picked from the list: the host opens it. */
  | { type: "open-conversation"; id: string }

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
  "copy",
  "toggle-steps",
  "remove-context",
  "history",
  "new-conversation",
  "open-conversation",
] as const satisfies readonly ConversationEventType[]
