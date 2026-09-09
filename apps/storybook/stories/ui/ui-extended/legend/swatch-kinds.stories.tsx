import type { Meta, StoryObj } from '@storybook/react-vite';
import { Legend, LegendItem } from '@invana/ui';

const meta: Meta<typeof Legend> = {
  title: 'UI/UI Extended/Legend',
  component: Legend,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A legend has to draw what the canvas draws. A dependency rendered as a dashed
 * arrow needs a dashed arrow here, or the legend describes a different picture.
 */
export const SwatchKinds: Story = {
  render: () => (
    <div className="w-[320px] border border-border bg-card p-2">
      <Legend orientation="column">
        <LegendItem kind="dot" color="var(--color-success)" label="agent · active" />
        <LegendItem kind="ring" label="not yet run" />
        <LegendItem kind="line" color="var(--color-primary)" label="runs on success" />
        <LegendItem kind="dashed" label="proposed — does not exist yet" />
        <LegendItem kind="arrow" color="var(--color-data-7)" label="delegation" />
      </Legend>
    </div>
  ),
};
