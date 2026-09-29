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
 * `joined`: one strip, the tiles divided by rules, for a band of figures that
 * belong to one answer. `captionTone` inks the change under a figure rather
 * than the figure itself.
 */
export const Joined: Story = {
  render: () => (
    <MetricGrid joined>
      <MetricTile label="Lead time" value="26 d" caption="▲ 8 d vs normal" captionTone="error" />
      <MetricTile label="On time" value="61%" caption="▼ 22 pts" captionTone="error" />
      <MetricTile label="Open POs" value="142" caption="£2.3M" />
    </MetricGrid>
  ),
};
