import type { ConversationSpec } from "../protocol/types"
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
