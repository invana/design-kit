import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetricGrid, MetricTile } from '@invana/ui';

const meta: Meta<typeof MetricTile> = {
  title: 'UI/UI Extended/MetricTile',
  component: MetricTile,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** The caption is not decoration — it supplies the denominator the number needs. */
export const Default: Story = {
  render: () => (
    <div className="w-[420px]">
      <MetricGrid>
        <MetricTile label="accepted" value="31 of 38" caption="tasks you reviewed" />
        <MetricTile label="rejected" value="7" caption="each a new Thought" />
        <MetricTile label="served" value="91%" caption="of thinkings" />
        <MetricTile label="avg thinking" value="9.6 s" caption="wall clock" />
      </MetricGrid>
    </div>
  ),
};
