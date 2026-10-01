import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ScopeBlock } from '@invana/blocks';

const meta: Meta<typeof ScopeBlock> = {
  title: 'Blocks/Scope',
  component: ScopeBlock,
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
 * Period, filters, population and freshness, each edited in place and sent as the `scope`
 * action with `{ part, value }`.
 */
export const Default: Story = {
  args: {
    spec: {
      parts: ['Q3 2026', 'vs Q2', 'Stores, Online', '214 stores', 'as of 06:00'],
      hint: 'Click any part to change it and re-run',
    },
    onAction: fn(),
  },
};
