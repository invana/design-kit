import type { Meta, StoryObj } from '@storybook/react-vite';
import { LineChart } from '@invana/charts';
import { PanelBox } from '@invana/ui';

import { seconds } from '../fixtures';

const meta: Meta<typeof LineChart> = {
  title: 'Charts/LineChart',
  component: LineChart,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A plan that has run on one day. One value draws one point, centred, on an axis
 * from zero to a clean number above it — not a flat line, and not a point pinned
 * to the top of the plot.
 */
export const SinglePoint: Story = {
  render: () => (
    <PanelBox title="Work p50, a day" aside="6.0s today">
      <LineChart values={[6]} labels={['today']} format={seconds} />
    </PanelBox>
  ),
};
