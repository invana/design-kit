import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { FilesBlock } from '@invana/blocks';

const meta: Meta<typeof FilesBlock> = {
  title: 'Blocks/Files',
  component: FilesBlock,
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
 * The files an answer hands over; with `download`, each sends `download:<digest>`.
 */
export const Default: Story = {
  args: {
    spec: {
      files: [
        {
          name: 'margin-bridge-q3.xlsx',
          size: '48 KB',
          digest: '9f3a2c1e',
        },
        {
          name: 'store-margins.csv',
          size: '112 KB',
          digest: '4b7e90d2',
        },
        {
          name: 'method.md',
          size: '6 KB',
          digest: 'c1d84f07',
        },
      ],
      download: true,
    },
    onAction: fn(),
  },
};
