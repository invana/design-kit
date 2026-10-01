import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { CaveatBlock } from '@invana/blocks';

const meta: Meta<typeof CaveatBlock> = {
  title: 'Blocks/Caveat',
  component: CaveatBlock,
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
 * What was excluded, imputed or assumed. A caveat with rows behind it links to them, sent as
 * its action's id.
 */
export const Default: Story = {
  args: {
    spec: {
      label: 'excluded',
      text: '4 stores with incomplete September data.',
      action: {
        id: 'show-excluded',
        label: 'Show the 4 stores',
      },
    },
    onAction: fn(),
  },
};
