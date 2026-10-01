import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { TraceBlock } from '@invana/blocks';

const meta: Meta<typeof TraceBlock> = {
  title: 'Blocks/Trace',
  component: TraceBlock,
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
 * What a run is doing, step by step, and the record of it after.
 */
export const Default: Story = {
  args: {
    spec: {
      steps: [
        {
          id: 'gl',
          label: 'Read general ledger',
          detail: '12,408 rows',
          state: 'done',
        },
        {
          id: 'inv',
          label: 'Joined carrier invoices',
          detail: '3,911 rows',
          state: 'done',
        },
        {
          id: 'dec',
          label: 'Decomposing the change',
          detail: '2.1 s',
          state: 'running',
        },
        {
          id: 'sum',
          label: 'Write summary',
          state: 'pending',
        },
      ],
    },
    onAction: fn(),
  },
};
