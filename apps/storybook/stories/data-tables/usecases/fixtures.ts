/**
 * Story-only data for `Data Tables/Usecases` — the Agent dashboards' sessions
 * table (Monitoring) and evaluation stream (Governance), frozen at one moment
 * of the board's live feed. Not a story file, so Storybook does not index it.
 */

export type SessionState = "running" | "waiting" | "failed" | "idle";

/** The six layers a session can light, in the board's order. */
export const LAYERS = [
  { id: "graph", label: "Graph", swatch: "bg-data-1" },
  { id: "models", label: "Data models", swatch: "bg-data-2" },
  { id: "skills", label: "Skills", swatch: "bg-data-3" },
  { id: "llm", label: "LLM", swatch: "bg-data-4" },
  { id: "third", label: "Third party", swatch: "bg-data-5" },
  { id: "cache", label: "Cache", swatch: "bg-data-6" },
] as const;

export interface Session {
  id: string;
  user: string;
  title: string;
  /** The step line under the title — `step 2 of 5 · Find rounds`. */
  step: string;
  state: SessionState;
  /** How hard each layer is being hit right now, 0–1, in `LAYERS` order. */
  heat: number[];
  /** Operations per second over the last 15s, oldest first. */
  ops: number[];
  /** Share of the context window held, 0–1. */
  context: number;
  tokens: number;
  /** Seconds since the session's run started. */
  runtime: number;
}

/** A wobbling ops/s history ending near `base` — deterministic, so snapshots hold. */
function history(base: number, seed: number): number[] {
  if (base === 0) return Array.from({ length: 30 }, () => 0);
  return Array.from({ length: 30 }, (_, i) =>
    Math.round(base * (0.6 + 0.4 * Math.abs(Math.sin(seed + i * 0.7)))),
  );
}

export const SESSIONS: Session[] = [
  { id: "s-01", user: "mia.chen", title: "Top accounts that raised in 90d", step: "step 2 of 5 · Find rounds", state: "running", heat: [0.9, 0.3, 0.5, 0.6, 0.7, 0.2], ops: history(8200, 1), context: 0.49, tokens: 40_000, runtime: 20 },
  { id: "s-02", user: "r.okafor", title: "Q3 revenue movement — EMEA", step: "step 3 of 4 · Compare", state: "running", heat: [1, 0.4, 0.6, 0.4, 0, 0.5], ops: history(6100, 2), context: 0.26, tokens: 63_000, runtime: 37 },
  { id: "s-03", user: "j.patel", title: "Fund exposure to semiconductors", step: "step 4 of 6 · Aggregate", state: "running", heat: [1, 0.2, 0.7, 0.5, 0, 0.1], ops: history(9400, 3), context: 0.86, tokens: 186_000, runtime: 54 },
  { id: "s-04", user: "s.lindqvist", title: "Board pack: churn drivers", step: "step 2 · needs input", state: "waiting", heat: [0, 0, 0, 0, 0, 0], ops: history(0, 4), context: 0.23, tokens: 109_000, runtime: 71 },
  { id: "s-05", user: "a.moreau", title: "Who ultimately owns Northwind?", step: "step 3 of 4 · Check registries", state: "running", heat: [1, 0.2, 0.3, 0.4, 0.8, 0], ops: history(5300, 5), context: 0.6, tokens: 132_000, runtime: 88 },
  { id: "s-06", user: "k.tanaka", title: "Filings that mention layoffs", step: "step 2 of 4 · Extract passages", state: "running", heat: [0.8, 0.3, 0.9, 0.7, 0.3, 0.4], ops: history(3900, 6), context: 0.81, tokens: 155_000, runtime: 105 },
  { id: "s-07", user: "d.alvarez", title: "Supplier risk — tier 2", step: "step 3 of 4 · Score risk", state: "running", heat: [1, 0.3, 0.4, 0.3, 0.5, 0.2], ops: history(7200, 7), context: 0.34, tokens: 178_000, runtime: 122 },
  { id: "s-08", user: "l.novak", title: "Cash runway by subsidiary", step: "step 2 · needs input", state: "waiting", heat: [0, 0, 0, 0, 0, 0], ops: history(0, 8), context: 0.71, tokens: 201_000, runtime: 139 },
  { id: "s-09", user: "p.shah", title: "Pricing change impact", step: "step 3 of 4 · Model elasticity", state: "running", heat: [0.9, 0.4, 0.8, 0.5, 0, 0.6], ops: history(4600, 9), context: 0.48, tokens: 224_000, runtime: 156 },
  { id: "s-10", user: "t.brennan", title: "Competitor hiring signals", step: "step 2 · websearch 503 · retries exhausted", state: "failed", heat: [0, 0, 0, 0, 0, 0], ops: history(0, 10), context: 0.45, tokens: 247_000, runtime: 173 },
  { id: "s-11", user: "e.rossi", title: "Audit: revenue restatements", step: "last run 4 min ago", state: "idle", heat: [0, 0, 0, 0, 0, 0], ops: history(0, 11), context: 0.19, tokens: 270_000, runtime: 190 },
  { id: "s-12", user: "n.haddad", title: "Deal pipeline hygiene", step: "last run 4 min ago", state: "idle", heat: [0, 0, 0, 0, 0, 0], ops: history(0, 12), context: 0.56, tokens: 293_000, runtime: 207 },
];

export function formatRate(r: number): string {
  if (r <= 0) return "—";
  if (r >= 1000) return `${(r / 1000).toFixed(1).replace(/\.0$/, "")}K/s`;
  return `${Math.round(r)}/s`;
}

export function formatCount(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 1e5 ? 0 : 1).replace(/\.0$/, "")}k`;
  return String(n);
}

export function formatRuntime(sec: number): string {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}

/** What a policy evaluation came to. Routine allows are summed elsewhere; these travel one by one. */
export type Verdict = "denied" | "egress" | "warn" | "masked" | "allow" | "approved";

export interface Evaluation {
  at: string;
  verdict: Verdict;
  policy: string;
  sid: string;
  text: string;
}

export const EVALUATIONS: Evaluation[] = [
  { at: "10:16:02", verdict: "denied", policy: "no-pii", sid: "s-07", text: "Person.email (raw) — read refused" },
  { at: "10:16:01", verdict: "egress", policy: "egress-allowlist", sid: "s-01", text: "api.crunchbase.com · company names × 5" },
  { at: "10:15:59", verdict: "masked", policy: "no-pii", sid: "s-05", text: "Person.name read masked for ownership chain" },
  { at: "10:15:58", verdict: "warn", policy: "token-budget", sid: "s-03", text: "run at 82% of its token budget" },
  { at: "10:15:56", verdict: "allow", policy: "prefer-internal", sid: "s-02", text: "graph chosen before third party" },
  { at: "10:15:55", verdict: "denied", policy: "egress-allowlist", sid: "s-05", text: "sec.gov/edgar not on the allowlist" },
  { at: "10:15:53", verdict: "approved", policy: "egress-allowlist", sid: "s-01", text: "you · egress to api.crunchbase.com" },
  { at: "10:15:52", verdict: "egress", policy: "egress-allowlist", sid: "s-05", text: "companies-house.gov.uk · registry ids × 4" },
  { at: "10:15:50", verdict: "allow", policy: "review-threshold", sid: "s-09", text: "delivered without review · confidence 0.88" },
  { at: "10:15:49", verdict: "denied", policy: "sandbox", sid: "s-06", text: "code_exec tried network access" },
  { at: "10:15:47", verdict: "masked", policy: "no-pii", sid: "s-07", text: "Person.name read masked for ownership chain" },
  { at: "10:15:46", verdict: "warn", policy: "token-budget", sid: "s-06", text: "run at 82% of its token budget" },
  { at: "10:15:44", verdict: "denied", policy: "token-budget", sid: "s-03", text: "run would pass 1M tokens — capped" },
  { at: "10:15:43", verdict: "allow", policy: "prefer-internal", sid: "s-09", text: "graph chosen before third party" },
];
