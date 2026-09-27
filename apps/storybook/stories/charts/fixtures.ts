/**
 * Sample data for the chart stories, taken from the Plan page and the Model
 * page designs. Not a story — shared so each story file stays one story.
 */

/** Thirty days ending today — `28 Aug` … `26 Sep`, `today`. */
export const DAYS: string[] = Array.from({ length: 30 }, (_, i) => {
  if (i === 29) return 'today';
  const d = new Date(2026, 7, 28 + i);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
});

/** Weekly ticks over {@link DAYS}, ending on today. */
export const WEEKLY = [1, 8, 15, 22, 29];

export const seconds = (v: number) => `${Number.isInteger(v) ? v : v.toFixed(1)}s`;

// Plan page — Work p50 a day.
export const WORK_P50 = [
  6.3, 6.1, 6.4, 6.0, 5.9, 6.2, 6.1, 6.6, 6.2, 6.0, 6.1, 5.8, 5.9, 6.0, 6.2, 6.1, 6.0, 9.4, 8.1, 6.2,
  6.0, 5.9, 5.8, 6.0, 6.1, 5.9, 6.0, 5.8, 5.9, 6.0,
];

// Model page — p95 a day, one model.
export const MODEL_P95 = [
  1.6, 1.95, 1.75, 1.55, 1.9, 1.4, 1.75, 1.85, 1.65, 2.0, 1.8, 1.6, 1.65, 1.45, 1.55, 1.9, 1.7, 3.45,
  2.65, 1.35, 1.7, 1.8, 1.6, 1.95, 1.75, 1.55, 1.6, 1.4, 2.05, 1.85,
];

// Plan page — Runs a day.
const SERVED = [
  33, 36, 40, 28, 22, 38, 43, 44, 38, 41, 43, 30, 24, 42, 44, 47, 40, 38, 46, 32, 26, 44, 48, 50, 46,
  43, 45, 30, 24, 44,
];
const FAILED = [1, 2, 1, 1, 0, 2, 1, 3, 1, 1, 2, 1, 0, 1, 2, 1, 1, 6, 4, 1, 0, 1, 1, 2, 1, 1, 1, 0, 1, 1];

export const RUN_SERIES = [
  { key: 'served', label: 'served or answered', color: 'var(--color-success)' },
  { key: 'failed', label: 'failed', color: 'var(--color-destructive)' },
];

export const RUNS = DAYS.map((label, i) => ({
  label,
  values: { served: SERVED[i], failed: FAILED[i] },
}));

// Model page — callers, in the fixed order every caller chart and bar shares.
export const CALLERS = [
  { key: 'agent', label: 'agent', color: 'var(--color-data-7)' },
  { key: 'plan', label: 'plan', color: 'var(--color-data-5)' },
  { key: 'explorer', label: 'Explorer', color: 'var(--color-data-6)' },
  { key: 'api', label: 'API', color: 'var(--color-data-4)' },
];

const AGENT = [
  1130, 960, 1260, 1090, 920, 960, 790, 880, 1180, 1010, 1310, 1130, 710, 1010, 1090, 920, 1220,
  1050, 880, 920, 750, 1310, 1130, 960, 1260, 1090, 660, 960, 1050, 880,
];

export const QUERIES = DAYS.map((label, i) => ({
  label,
  values: {
    agent: AGENT[i],
    plan: Math.round(AGENT[i] * 0.35),
    explorer: Math.round(AGENT[i] * 0.21),
    api: 10 + ((i * 7) % 31),
  },
}));

// Model page — the models, each on its own data-palette slot.
export const MODELS = [
  { key: 'airroutes', label: 'AirRoutes', color: 'var(--color-data-1)' },
  { key: 'news', label: 'NewsArticles', color: 'var(--color-data-2)' },
  { key: 'twitter', label: 'Twitter', color: 'var(--color-data-3)' },
  { key: 'deals', label: 'Deals', color: 'var(--color-data-4)' },
];

/** A count that steps to each value on the day given, flat in between. */
const stepped = (start: number, steps: [day: number, value: number][]) =>
  DAYS.map((_, i) => steps.reduce((v, [day, to]) => (i >= day ? to : v), start));

const AIRROUTES = stepped(52900, [[24, 54120]]);
const NEWS = stepped(31200, [[4, 33100], [10, 35000], [22, 36900], [24, 38700]]);
const TWITTER = stepped(13220, [[17, 35300]]);

export const GROWTH = DAYS.map((label, i) => ({
  label,
  values: { airroutes: AIRROUTES[i], news: NEWS[i], twitter: TWITTER[i], deals: 0 },
}));

export const WRITES = [
  { index: 4, label: 'import' },
  { index: 10, label: 'import' },
  { index: 17, label: 'Twitter import' },
  { index: 22, label: 'import' },
  { index: 24, label: 'stitch commit' },
];

// Model page — one model's records, by node type.
export const TYPES = [
  { key: 'route', label: 'route', color: 'var(--color-data-1)' },
  { key: 'airport', label: 'airport', color: 'var(--color-data-2)' },
  { key: 'country', label: 'country', color: 'var(--color-data-3)' },
  { key: 'contains', label: 'contains', color: 'var(--color-data-4)' },
];

const ROUTE = stepped(36100, [[24, 37020]]);
const AIRPORT = stepped(12400, [[24, 12650]]);

export const GROWTH_BY_TYPE = DAYS.map((label, i) => ({
  label,
  values: { route: ROUTE[i], airport: AIRPORT[i], country: 3100, contains: 1350 },
}));
