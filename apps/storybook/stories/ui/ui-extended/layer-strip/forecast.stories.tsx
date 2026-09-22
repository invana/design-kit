import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Legend,
  LegendItem,
  LayerStrip,
  PanelBox,
  type LayerBand,
  type LayerItem,
  type LayerSeam,
} from '@invana/ui';

import { LAYER_PALETTE } from './_run';

const meta: Meta<typeof LayerStrip> = {
  title: 'UI/UI Extended/LayerStrip',
  component: LayerStrip,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const BANDS: LayerBand[] = [
  { layer: 'human', note: '1 asked · 1 approved' },
  { layer: 'agent', note: '2 checks', spine: true },
  { layer: 'llm', note: '3 calls, all inside p95' },
  { layer: 'graph_data', note: '2 reads' },
  { layer: 'third_party', note: 'refused — never priced' },
];

/** Milliseconds from the run opening. `p50` is a duration, never a moment. */
const ITEMS: LayerItem[] = [
  {
    id: 'parse-1',
    label: 'parse_intent',
    layer: 'llm',
    start: 0,
    end: 900,
    state: 'in',
    forecast: { p50: 800 },
  },
  {
    id: 'ask',
    label: 'ask_user',
    layer: 'human',
    start: 900,
    end: 42_100,
    state: 'in',
    forecast: { p50: 26_000, note: '+58%' },
  },
  {
    id: 'parse-2',
    label: 'parse_intent',
    layer: 'llm',
    start: 42_100,
    end: 42_800,
    state: 'in',
    forecast: { p50: 800, note: '−12%' },
  },
  {
    id: 'resolve',
    label: 'resolve_schema',
    layer: 'graph_data',
    start: 42_800,
    end: 43_000,
    state: 'in',
    forecast: { p50: 300, note: '−33%' },
  },
  {
    id: 'build',
    label: 'build_query',
    layer: 'llm',
    start: 43_000,
    end: 44_400,
    state: 'in',
    forecast: { p50: 1_100, note: '+27%' },
  },
  {
    id: 'validate',
    label: 'validate_query',
    layer: 'agent',
    start: 44_400,
    end: 44_500,
    state: 'in',
  },
  {
    id: 'execute',
    label: 'execute_query',
    layer: 'graph_data',
    start: 168_000,
    end: 170_100,
    state: 'in',
    forecast: { p50: 1_900, note: '+11%' },
  },
  {
    id: 'clearbit',
    label: 'api/clearbit.com',
    layer: 'third_party',
    start: 44_500,
    end: 44_600,
    state: 'refused',
    ruleMatched: 'third_party/api/clearbit.com/**',
  },
  {
    id: 'summarise',
    label: 'summarise',
    layer: 'llm',
    start: 170_100,
    end: 171_000,
    state: 'in',
    forecast: { p50: 900 },
  },
];

const SEAMS: LayerSeam[] = [
  {
    id: 'approval',
    at: 44_600,
    label: 'approval — no estimate exists',
    note: '2m 04s actual · 72% of the run',
    edge: 'before',
    noEstimate: true,
  },
];

/**
 * The plan's median drawn **on the run's own axis**, so an overrun is something
 * a reader sees rather than something they work out.
 *
 * Every compute step here lands inside its forecast: the `p50` mark sits at
 * `start + p50`, and where the bar ends before it — `resolve_schema`, on a
 * cached schema — the step was *faster than usual*, which is as much a finding
 * as an overrun.
 *
 * On a linear clock the sub-second steps sit at their floor width — which is
 * the same reading `Layers` gives: a bar's width **is** how long it took, and
 * eight seconds of compute inside a three-minute run is what that looks like.
 *
 * **The one part nothing can forecast says so.** How long a person takes to say
 * yes is not in the record, so the approval gate is drawn dashed and its note
 * carries the actual instead of a comparison. Two minutes of this three-minute
 * run is a gate with no estimate — and drawing a guess there would be the one
 * dishonest mark on the strip.
 */
export const Forecast: Story = {
  render: () => (
    <div className="w-[980px]">
      <PanelBox
        title="Forecast against actual"
        aside="compare: p50 · 1,204 runs"
        flush
      >
        <div className="p-2">
          <LayerStrip
            scale="elapsed"
            bands={BANDS}
            items={ITEMS}
            seams={SEAMS}
            palette={LAYER_PALETTE}
            collapsible={false}
            minTrackWidth={88}
          />
        </div>
        <Legend className="border-t border-border px-3 py-1.5">
          <LegendItem kind="line" color="var(--color-data-1)" label="the bar is what this run did" />
          <LegendItem kind="dashed" label="p50 — the median of 1,204 runs, on the run's own axis" />
          <LegendItem kind="rule" label="a dashed gate has nothing to forecast" />
        </Legend>
      </PanelBox>
    </div>
  ),
};
