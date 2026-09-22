import type { Meta, StoryObj } from '@storybook/react-vite';
import { PanelBox, TouchStrip, type LayerPalette } from '@invana/ui';

const meta: Meta<typeof TouchStrip> = {
  title: 'UI/UI Extended/TouchStrip',
  component: TouchStrip,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const PALETTE: LayerPalette = {
  graph_data: { swatch: 'bg-data-1' },
  llm: { swatch: 'bg-data-7' },
  third_party: { swatch: 'bg-data-8' },
  cache: { swatch: 'bg-data-3' },
  human: { swatch: 'bg-data-6' },
};

/**
 * What one run touched at all, in one line above its trace.
 *
 * *What did this reach for* is a question asked once for a whole run, so it
 * costs one line and not an axis: a step spends exactly one layer, so six bands
 * down a trace would be a matrix one sixth full.
 *
 * The two states that are not *touched* are the ones worth the ink. `cache`
 * is dimmed — allowed, and nothing reached for it, which is an invitation to
 * narrow the world. `third party` is struck — a guardrail said no, which is an
 * invitation to widen it or to accept that the graph cannot answer.
 */
export const Default: Story = {
  render: () => (
    <div className="w-[860px]">
      <PanelBox
        title="What it touched"
        aside="declared 4 · touched 4 · refused 1"
      >
        <TouchStrip
          palette={PALETTE}
          items={[
            { layer: 'llm', note: '3 calls' },
            { layer: 'graph_data', note: '1,284 rows' },
            { layer: 'agent', note: '2 checks' },
            { layer: 'human', note: 'asked + approved' },
            { layer: 'third_party', note: 'refused', refused: true },
            { layer: 'cache', note: 'miss', dim: true },
          ]}
        />
      </PanelBox>
    </div>
  ),
};
