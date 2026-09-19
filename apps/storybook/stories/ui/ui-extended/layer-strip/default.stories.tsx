import type { Meta, StoryObj } from '@storybook/react-vite';
import { LayerStrip, type Band, type Step } from '@invana/ui';

const meta: Meta<typeof LayerStrip> = {
  title: 'UI/UI Extended/LayerStrip',
  component: LayerStrip,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const BANDS: Band[] = [
  { layer: 'graph_data' },
  { layer: 'llm' },
  { layer: 'third_party' },
  { layer: 'cache' },
  { layer: 'human' },
  { layer: 'agent' },
];

const STEPS: Step[] = [
  {
    id: 's1',
    label: 'plan',
    seq: 1,
    touches: [
      { layer: 'agent', direction: 'out' },
      { layer: 'llm', direction: 'out', address: 'llm/ollama-local/llama-3.1-8b' },
    ],
  },
  {
    id: 's2',
    label: 'read',
    seq: 2,
    touches: [
      { layer: 'agent', direction: 'out' },
      {
        layer: 'graph_data',
        direction: 'in',
        address: 'graph_data/model/Deals@1.0.0',
      },
      { layer: 'cache', direction: 'in', address: 'cache/result/*' },
    ],
  },
  {
    id: 's3',
    label: 'link',
    seq: 3,
    touches: [
      { layer: 'agent', direction: 'out' },
      {
        layer: 'graph_data',
        direction: 'refused',
        address: 'graph_data/stitch/tweet_article@about',
        ruleMatched: 'graph_data/stitch/*',
      },
    ],
  },
  {
    id: 's4',
    label: 'enrich',
    seq: 4,
    touches: [
      { layer: 'agent', direction: 'out' },
      {
        layer: 'third_party',
        direction: 'refused',
        address: 'third_party/api/clearbit.com',
        ruleMatched: 'third_party/**',
      },
    ],
  },
  {
    id: 's5',
    label: 'decide',
    seq: 5,
    touches: [
      { layer: 'agent', direction: 'out' },
      { layer: 'llm', direction: 'out', address: 'llm/ollama-local/llama-3.1-8b' },
      { layer: 'human', direction: 'skipped' },
    ],
  },
  {
    id: 's6',
    label: 'answer',
    seq: 6,
    touches: [
      { layer: 'agent', direction: 'out' },
      { layer: 'cache', direction: 'out', address: 'cache/answer/*' },
    ],
  },
];

/**
 * A run as six bands and one column per step — what it engaged, in `seq` order.
 *
 * Layers are the bands and steps are the columns, so *what did this run touch,
 * and when* is one band read across, and *what did this step do* is one column
 * read down. The two questions the run dashboard is asked, in one drawing.
 *
 * **Refusals are struck in place, not removed.** Steps 3 and 4 are the point:
 * a stitch the world denied and a third party the guardrail denied. An empty
 * cell there would be indistinguishable from a step that never reached for that
 * layer — and *the bound bit here* is the most important thing the drawing can
 * say. `skipped` is a third state again: step 5 never asked a person, which is
 * not the same as being refused one.
 *
 * **The spine band is always drawn.** The runtime's own dispatches are what the
 * other bands are timed against, and it is never governed.
 *
 * DOM over a fixed grid, not canvas: it binds to no canvas store, it lives in
 * `mainSection` where no canvas exists, and frozen row labels plus text
 * selection are free here and expensive there.
 */
export const Default: Story = {
  render: () => (
    <div className="w-[640px]">
      <LayerStrip bands={BANDS} steps={STEPS} selectedStep="s3" onSelectStep={() => {}} />
    </div>
  ),
};
