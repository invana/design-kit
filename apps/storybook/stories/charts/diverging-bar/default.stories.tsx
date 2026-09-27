import type { Meta, StoryObj } from '@storybook/react-vite';
import { DivergingBar } from '@invana/charts';

const meta: Meta<typeof DivergingBar> = {
  title: 'Charts/DivergingBar',
  component: DivergingBar,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Provisional. Polarity around a real zero. The status colours are right here because
 * the two directions are good and bad, not two categories.
 */
export const Default: Story = {
  render: () => (
    <DivergingBar
      caption="net learning weight · 90 d"
      data={[
        { label: 'gap-continuation', value: 11 },
        { label: 'macro-to-sector', value: 7 },
        { label: 'theme-early', value: 5 },
        { label: 'theme-late', value: -4 },
        { label: 'event-day-entry', value: -6 },
        { label: 'gap-no-delivery', value: -9 },
      ]}
    />
  ),
};
