import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { CannotBlock } from '@invana/blocks';

const meta: Meta<typeof CannotBlock> = {
  title: 'Blocks/Cannot',
  component: CannotBlock,
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
 * What the data does not hold and what would change it, then nearby questions it can answer;
 * each is sent as the `prompt` action with its words.
 */
export const Default: Story = {
  args: {
    spec: {
      reason: 'The ledger holds 2023–2026. 2021 and 2022 are not held.',
      remedy: 'Import the archive to extend it.',
      nearest: ['Compare 2023 with 2025', 'Trend since Jan 2023'],
    },
    onAction: fn(),
  },
};
