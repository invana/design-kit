import type { PatchScript } from "../protocol/stream"
import type { ConversationSpec } from "../protocol/types"
import agentConsole from "./conversations/agent-console.json"
import graphExpansions from "./conversations/graph-expansions.json"
import methodDisclosure from "./conversations/method-disclosure.json"
import streaming from "./conversations/streaming.json"
import streamingScript from "./conversations/streaming.script.json"
import taskDashboard from "./conversations/task-dashboard.json"
import turnLabels from "./conversations/turn-labels.json"
import equityTrader from "./sessions/equity-trader.json"
import healthResearcher from "./sessions/health-researcher.json"
import plantBreeder from "./sessions/plant-breeder.json"
import productDataScientist from "./sessions/product-data-scientist.json"
import supplyChainPlanner from "./sessions/supply-chain-planner.json"

/*
 * The research sessions of Analyst Flow Grammar, as the API would send them.
 * They are the acceptance tests and the story data: a slice is done when its
 * session renders with no placeholders.
 *
 * JSON widens every string, so these cannot be checked by the compiler; the
 * cast is honest only because `fixtures.test.ts` runs `validate()` on each.
 */
export const SESSIONS = {
  plantBreeder: plantBreeder as unknown as ConversationSpec,
  equityTrader: equityTrader as unknown as ConversationSpec,
  healthResearcher: healthResearcher as unknown as ConversationSpec,
  supplyChainPlanner: supplyChainPlanner as unknown as ConversationSpec,
  productDataScientist: productDataScientist as unknown as ConversationSpec,
}

export type SessionId = keyof typeof SESSIONS

/*
 * The conversation stories' data: each a whole thread as the API would send
 * it, drawn by <ChatSession>. `streaming` is sent part-written; its words
 * arrive as `STREAMING_SCRIPT`, a recorded run of `append-text` patches.
 * Validated like the sessions, by `fixtures.test.ts`.
 */
export const CONVERSATIONS = {
  graphExpansions: graphExpansions as unknown as ConversationSpec,
  agentConsole: agentConsole as unknown as ConversationSpec,
  taskDashboard: taskDashboard as unknown as ConversationSpec,
  streaming: streaming as unknown as ConversationSpec,
  methodDisclosure: methodDisclosure as unknown as ConversationSpec,
  turnLabels: turnLabels as unknown as ConversationSpec,
}

export type ConversationId = keyof typeof CONVERSATIONS

export const STREAMING_SCRIPT = streamingScript as unknown as PatchScript

/*
 * Recorded runs, as the API would stream them: the airports session of the
 * Session Task Trace walkthrough, and the API's side of it. Stories play them
 * into a <ChatSession>.
 */
export * from "./scripts/airports"
