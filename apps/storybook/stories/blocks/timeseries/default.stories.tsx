import type { Meta, StoryObj } from '@storybook/react-vite';
import { TimeseriesBlock } from '@invana/blocks';

const meta: Meta<typeof TimeseriesBlock> = {
  title: 'Blocks/Timeseries',
  component: TimeseriesBlock,
  parameters: { layout: 'padded' },
  // The chat's middle width; a block fills whatever its shell gives it.
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A measure over time: the line, its forecast from `forecastFrom`, the range it is judged
 * against, and the periods that stand out ringed in their tone.
 */
export const Default: Story = {
  args: {
    spec: {
      unit: 'units',
      series: [
        {
          name: 'Weekly demand',
          points: [
            ['Jul', 6800],
            ['Aug', 7400],
            ['Sep', 8200],
            ['Oct', 8900],
            ['Nov', 9600],
            ['Dec', 10400],
          ],
        },
      ],
      band: {
        label: '80% interval',
        lower: 8000,
        upper: 11000,
      },
      forecastFrom: 'Oct',
      forecastLabel: 'today',
      marks: [
        {
          at: 'Aug',
          tone: 'warn',
        },
      ],
    },
  },
};
