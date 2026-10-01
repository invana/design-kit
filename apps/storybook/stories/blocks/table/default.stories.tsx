import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { TableBlock } from '@invana/blocks';

const meta: Meta<typeof TableBlock> = {
  title: 'Blocks/Table',
  component: TableBlock,
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
 * The first rows of a longer table and how many there are. `Open all` sends the `open` action;
 * the shell decides what opening means.
 */
export const Default: Story = {
  args: {
    spec: {
      columns: [
        {
          key: 'store',
          label: 'Store',
        },
        {
          key: 'margin',
          label: 'Margin',
          align: 'right',
        },
        {
          key: 'delta',
          label: 'Δ pts',
          align: 'right',
        },
      ],
      rows: [
        {
          store: 'North Mall',
          margin: '11.4%',
          delta: {
            value: '−3.1',
            tone: 'bad',
          },
        },
        {
          store: 'Northgate',
          margin: '12.0%',
          delta: {
            value: '−2.6',
            tone: 'bad',
          },
        },
        {
          store: 'Riverside',
          margin: '15.8%',
          delta: {
            value: '+0.4',
            tone: 'good',
          },
        },
      ],
      total: 214,
      noun: 'stores',
    },
    onAction: fn(),
  },
};
