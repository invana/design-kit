import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { TableBlock } from '@invana/blocks';

import { STEPS_TABLE } from '../_fixtures';

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
 * Rows a reader picks from. `rowKey` names a row: a click sends `select` with its key, and
 * `selected` is drawn picked. Columns of ids and figures set `mono`.
 */
export const Selectable: Story = {
  args: {
    spec: STEPS_TABLE,
    onAction: fn(),
  },
};
