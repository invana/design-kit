import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { MethodBlock } from '@invana/blocks';

const meta: Meta<typeof MethodBlock> = {
  title: 'Blocks/Method',
  component: MethodBlock,
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
 * The query, formula or model behind a figure, folded to one line until opened.
 */
export const Default: Story = {
  args: {
    spec: {
      label: 'query',
      meta: '12,408 rows · 18 ms',
      open: true,
      code: "**SELECT** region,\n  sum(op_income) / sum(net_rev) **AS** margin\n**FROM** ledger\n**WHERE** quarter = '2026-Q3'\n**GROUP BY** region",
    },
    onAction: fn(),
  },
};
