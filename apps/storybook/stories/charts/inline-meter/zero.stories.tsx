import type { Meta, StoryObj } from '@storybook/react-vite';
import { InlineMeter } from '@invana/charts';

const meta: Meta<typeof InlineMeter> = {
  title: 'Charts/InlineMeter',
  component: InlineMeter,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A model nobody has queried. Zero reads `—` with no track: an empty bar would look
 * like a measured share of nothing.
 */
export const Zero: Story = {
  render: () => (
    <InlineMeter value={0} label="share of queries" />
  ),
};
