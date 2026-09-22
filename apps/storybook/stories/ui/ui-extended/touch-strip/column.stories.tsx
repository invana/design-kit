import type { Meta, StoryObj } from '@storybook/react-vite';
import { Eyebrow, TouchStrip, type LayerPalette } from '@invana/ui';

const meta: Meta<typeof TouchStrip> = {
  title: 'UI/UI Extended/TouchStrip/Column',
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
 * The same summary, read down a 420px panel — one line per layer, the note
 * right-aligned. The label is struck on a refusal and dimmed when nothing
 * reached for it, exactly as the row form marks them.
 */
export const Column: Story = {
  render: () => (
    <div className="flex w-[360px] flex-col gap-1.5">
      <Eyebrow aside="1 refused">What it touched</Eyebrow>
      <TouchStrip
        orientation="column"
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
    </div>
  ),
};
