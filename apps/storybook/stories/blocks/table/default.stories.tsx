import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { TableBlock } from '@invana/blocks';

import { TABLE } from '../_fixtures';

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
    spec: TABLE,
    onAction: fn(),
  },
};
