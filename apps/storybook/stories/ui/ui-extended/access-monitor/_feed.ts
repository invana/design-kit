import {
  createAccessStore,
  type AccessDeclared,
  type AccessEvent,
  type AccessOp,
  type AccessWindow,
  type LayerPalette,
} from '@invana/ui';

/**
 * A pretend server: it sums a run's touches into windows, the way the real one
 * does, so the stories exercise exactly the shape Studio receives.
 *
 * Seeded, so the static stories draw the same frame every time.
 */

export const PALETTE: LayerPalette = {
  graph_data: { swatch: 'bg-data-1' },
  tasks: { swatch: 'bg-data-3' },
  third_party: { swatch: 'bg-data-8' },
  llm: { swatch: 'bg-data-7' },
  cache: { swatch: 'bg-data-5' },
};

/** What the playbook says it will touch. `Person` is declared and never reached. */
export const DECLARED: AccessDeclared[] = [
  { layer: 'graph_data', target: 'Company' },
  { layer: 'graph_data', target: 'Company.revenue' },
  { layer: 'graph_data', target: 'Filing' },
  { layer: 'graph_data', target: 'Filing.amount' },
  { layer: 'graph_data', target: 'Person' },
  { layer: 'graph_data', target: 'FILED_BY' },
  { layer: 'graph_data', target: 'OWNS' },
  { layer: 'tasks', target: 'websearch' },
  { layer: 'tasks', target: 'fetch_url' },
  { layer: 'tasks', target: 'code_exec' },
  { layer: 'third_party', target: 'api.crunchbase.com' },
  { layer: 'llm', target: 'claude-opus-5' },
  { layer: 'cache', target: 'filings-cache' },
];

type Share = [layer: string, target: string, op: AccessOp, weight: number];

interface Phase {
  id: string;
  label: string;
  windows: number;
  shares: Share[];
}

const PHASES: Phase[] = [
  {
    id: 'read',
    label: 'Read filings',
    windows: 24,
    shares: [
      ['graph_data', 'Filing', 'read', 5],
      ['graph_data', 'Filing.amount', 'read', 4],
      ['graph_data', 'FILED_BY', 'read', 3],
      ['graph_data', 'Company', 'read', 2],
      ['cache', 'filings-cache', 'read', 1],
    ],
  },
  {
    id: 'search',
    label: 'Search the web',
    windows: 24,
    shares: [
      ['tasks', 'websearch', 'read', 5],
      ['tasks', 'fetch_url', 'read', 3],
      ['llm', 'claude-opus-5', 'egress', 0.2],
      ['graph_data', 'Company', 'read', 1],
    ],
  },
  {
    id: 'enrich',
    label: 'Enrich companies',
    windows: 24,
    shares: [
      ['graph_data', 'Company', 'read', 3],
      ['graph_data', 'Company.revenue', 'write', 2],
      ['graph_data', 'OWNS', 'read', 1],
      ['third_party', 'api.crunchbase.com', 'egress', 0.5],
      ['tasks', 'code_exec', 'read', 1],
    ],
  },
  {
    id: 'summarise',
    label: 'Summarise',
    windows: 24,
    shares: [
      ['llm', 'claude-opus-5', 'egress', 0.3],
      ['graph_data', 'Company.revenue', 'read', 1],
      ['cache', 'filings-cache', 'write', 0.5],
    ],
  },
];

const CYCLE = PHASES.reduce((sum, p) => sum + p.windows, 0);

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Feed {
  /** The next window, at `rate` touches per second across the whole run. */
  next(rate: number): AccessWindow;
}

export function createFeed({
  seed = 7,
  windowMs = 250,
  start = Date.parse('2026-10-01T09:30:00Z'),
}: { seed?: number; windowMs?: number; start?: number } = {}): Feed {
  const random = mulberry32(seed);
  const seen = new Set<string>();
  let seq = 0;
  let eventId = 0;

  return {
    next(rate) {
      seq += 1;
      const at = new Date(start + (seq - 1) * windowMs).toISOString();

      // Which phase this window sits in, and how far through it.
      let offset = (seq - 1) % CYCLE;
      let phase = PHASES[0]!;
      for (const p of PHASES) {
        if (offset < p.windows) {
          phase = p;
          break;
        }
        offset -= p.windows;
      }

      const totalWeight = phase.shares.reduce((sum, s) => sum + s[3], 0);
      const budget = (rate * windowMs) / 1_000;
      const events: AccessEvent[] = [];
      const event = (e: Omit<AccessEvent, 'id' | 'at'>) =>
        events.push({ id: `e${++eventId}`, at, ...e });

      const counts = phase.shares.flatMap(([layer, target, op, weight]) => {
        const count = Math.round((budget * weight * (0.6 + random() * 0.8)) / totalWeight);
        if (count === 0) return [];
        const key = `${layer}/${target}`;
        if (!seen.has(key)) {
          seen.add(key);
          event({ kind: 'first_seen', layer, target, detail: op });
        }
        return [{ layer, target, op, count }];
      });

      if (phase.id === 'enrich' && offset % 6 === 2) {
        event({
          kind: 'egress',
          layer: 'third_party',
          target: 'api.crunchbase.com',
          detail: 'company names',
        });
      }
      if (phase.id === 'enrich' && offset === 10) {
        // Not declared: the board grows a tile for it rather than dropping it.
        event({
          kind: 'refused',
          layer: 'third_party',
          target: 'sec.gov/edgar',
          detail: 'bound: no-pii',
        });
      }
      if (phase.id === 'summarise' && offset === 4) {
        event({
          kind: 'egress',
          layer: 'llm',
          target: 'claude-opus-5',
          to: 'llm/anthropic-prod',
          detail: 'aggregates',
        });
      }

      return {
        seq,
        at,
        windowMs,
        counts,
        events,
        step: {
          id: `${phase.id}-${Math.floor((seq - 1) / CYCLE)}`,
          label: phase.label,
          state: offset === phase.windows - 1 ? 'closed' : 'open',
        },
      };
    },
  };
}

/** A store fed `windows` windows at `rate` — a frozen frame for a static story. */
export function primedStore(windows: number, rate = 8_000) {
  const store = createAccessStore({ declared: DECLARED });
  const feed = createFeed();
  for (let i = 0; i < windows; i++) store.push(feed.next(rate));
  return store;
}
