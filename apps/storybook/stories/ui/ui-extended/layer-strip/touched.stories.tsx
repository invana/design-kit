import type { Meta, StoryObj } from '@storybook/react-vite';
import { LayerStrip, type LayerBand, type LayerItem } from '@invana/ui';

const meta: Meta<typeof LayerStrip> = {
  title: 'UI/UI Extended/LayerStrip',
  component: LayerStrip,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const BANDS: LayerBand[] = [
  { layer: 'human', note: 'never asked' },
  { layer: 'agent' },
  {
    layer: 'cache',
    note: '1 hit',
    parts: [{ id: 'result', label: 'cache/result/*' }],
  },
  {
    layer: 'llm',
    note: '2 calls',
    parts: [
      { id: 'local', label: 'llm/ollama-local/llama-3.1-8b' },
    ],
  },
  {
    layer: 'graph_data',
    note: '1 read · 1 refused',
    parts: [
      { id: 'deals', label: 'graph_data/model/Deals@1.0.0' },
      { id: 'stitch', label: 'graph_data/stitch/tweet_article@about' },
    ],
  },
  {
    layer: 'third_party',
    note: 'refused',
    parts: [{ id: 'clearbit', label: 'third_party/api/clearbit.com' }],
  },
];

const ITEMS: LayerItem[] = [
  { id: 'plan', label: 'plan', layer: 'agent', start: 0, end: 900, state: 'out' },
  {
    id: 'plan-llm',
    label: 'plan',
    layer: 'llm',
    part: 'local',
    start: 140,
    end: 880,
    state: 'out',
  },
  {
    id: 'fetch',
    label: 'fetch',
    layer: 'graph_data',
    part: 'deals',
    start: 900,
    end: 2400,
    state: 'in',
  },
  {
    id: 'fetch-cache',
    label: 'fetch',
    layer: 'cache',
    part: 'result',
    start: 900,
    end: 1100,
    state: 'in',
  },
  {
    id: 'link',
    label: 'link',
    layer: 'graph_data',
    part: 'stitch',
    start: 2400,
    end: 2600,
    state: 'refused',
    ruleMatched: 'graph_data/stitch/*',
  },
  {
    id: 'enrich',
    label: 'enrich',
    layer: 'third_party',
    part: 'clearbit',
    start: 2600,
    end: 2800,
    state: 'refused',
    ruleMatched: 'third_party/**',
  },
  {
    id: 'decide',
    label: 'decide',
    layer: 'llm',
    part: 'local',
    start: 2800,
    end: 4600,
    state: 'out',
  },
  {
    id: 'decide-human',
    label: 'decide',
    layer: 'human',
    start: 4600,
    end: 4800,
    state: 'skipped',
  },
  {
    id: 'answer',
    label: 'answer',
    layer: 'agent',
    start: 4600,
    end: 4900,
    state: 'out',
  },
];

/**
 * The same drawing in the **touched** tense — one run, on the wall clock.
 *
 * `elapsed` is the only thing that changes: the axis counts milliseconds from
 * the run opening instead of steps, so a reader sees that `fetch` cost 1.5s and
 * `decide` cost 1.8s, which a column per step cannot say. Bands, parts and bars
 * are the plan's, and *declared versus touched* stays a comparison rather than
 * two vocabularies to learn.
 *
 * **Refusals are struck in place, never filtered out.** `link` and `enrich` are
 * the point: a stitch the world denied and a third party the guardrail denied,
 * each keeping its moment on the axis. Removing them would leave a gap
 * indistinguishable from time that never reached for that layer — and *the
 * bound bit here* is the most important thing the drawing can say. `skipped` is
 * a third state: `decide` never asked a person, which is not being refused one.
 */
export const Touched: Story = {
  render: () => (
    <div className="w-[760px]">
      <LayerStrip
        bands={BANDS}
        items={ITEMS}
        scale="elapsed"
        selectedItem="link"
        onSelectItem={() => {}}
      />
    </div>
  ),
};
