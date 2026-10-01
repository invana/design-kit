import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetricGrid, MetricTile } from '@invana/ui';

const meta: Meta<typeof MetricGrid> = {
  title: 'UI/UI Extended/MetricTile',
  component: MetricGrid,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `variant="figure"`: a band of figures inside an answer. Boxed like a tile, set like a
 * small hero — the label in sentence case, the value in a larger sans, the caption in mono.
 */
export const Figure: Story = {
  render: () => (
    <MetricGrid joined>
      <MetricTile variant="figure" label="Friday" value="8.2%" caption="n = 1,061" />
      <MetricTile variant="figure" label="Mon–Thu" value="6.1%" caption="n = 3,322" />
      <MetricTile variant="figure" label="Unadjusted OR" value="1.38" caption="95% CI 1.08–1.76" />
    </MetricGrid>
  ),
};
