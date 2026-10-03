import sessions from '../../../fixtures/data-tables/sessions.json';
import evaluations from '../../../fixtures/data-tables/evaluations.json';

/**
 * Story-only types and formatters for the Agent boards' sessions table (Monitoring) and
 * evaluation stream (Governance). The rows are JSON — `fixtures/data-tables/sessions.json` and
 * `evaluations.json`, frozen at one moment of the board's live feed. Not a story file, so
 * Storybook does not index it.
 */

export type SessionState = 'running' | 'waiting' | 'failed' | 'idle';

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

/** The six layers a session can light, in the board's order; `swatch` is the class that paints one. */
export const LAYERS: { id: string; label: string; swatch: string }[] = sessions.layers;

export const SESSIONS = sessions.sessions as Session[];

/** What a policy evaluation came to. Routine allows are summed elsewhere; these travel one by one. */
export type Verdict = 'denied' | 'egress' | 'warn' | 'masked' | 'allow' | 'approved';

export interface Evaluation {
  at: string;
  verdict: Verdict;
  policy: string;
  sid: string;
  text: string;
}

export const EVALUATIONS = evaluations as Evaluation[];

export function formatRate(r: number): string {
  if (r <= 0) return '—';
  if (r >= 1000) return `${(r / 1000).toFixed(1).replace(/\.0$/, '')}K/s`;
  return `${Math.round(r)}/s`;
}

export function formatCount(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 1e5 ? 0 : 1).replace(/\.0$/, '')}k`;
  return String(n);
}

export function formatRuntime(sec: number): string {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}
