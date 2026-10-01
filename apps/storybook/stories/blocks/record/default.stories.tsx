import type { Meta, StoryObj } from '@storybook/react-vite';
import { RecordBlock } from '@invana/blocks';

import { RECORD } from '../_fixtures';

const meta: Meta<typeof RecordBlock> = {
  title: 'Blocks/Record',
  component: RecordBlock,
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
 * One entity as label/value pairs, with who it is and its state above them.
 */
export const Default: Story = {
  args: {
    spec: RECORD,
  },
};
