import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { CitationsBlock } from '@invana/blocks';

const meta: Meta<typeof CitationsBlock> = {
  title: 'Blocks/Citations',
  component: CitationsBlock,
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
 * The sources an answer rests on, numbered as its markers cite them, with record counts and
 * what each is. The shell may light the row a marker points at.
 */
export const Default: Story = {
  args: {
    spec: {
      sources: [
        {
          label: 'General ledger, Q3',
          count: 12408,
          detail: 'table · loaded 28 Sep 06:00',
        },
        {
          label: 'Carrier invoices',
          count: 3911,
          detail: 'file · uploaded 26 Sep',
        },
        {
          label: 'Store master',
          count: 214,
          detail: 'table · loaded 1 Sep',
        },
      ],
    },
    onAction: fn(),
  },
};
