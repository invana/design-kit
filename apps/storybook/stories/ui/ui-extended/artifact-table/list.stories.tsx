import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArtifactTable } from '@invana/ui';

const meta: Meta<typeof ArtifactTable> = {
  title: 'UI/UI Extended/ArtifactTable',
  component: ArtifactTable,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** `list`: name, size and digest in bare rows, for the few files an answer hands over. */
export const List: Story = {
  args: {
    variant: 'list',
    files: [
      { name: 'margin-bridge-q3.xlsx', size: '48 KB', digest: 'a91f03c2' },
      { name: 'rejected-rows.csv', size: '6 KB', digest: '77be1d0e' },
      { name: 'chart-freight.png', size: '112 KB', digest: 'c0d45a9b' },
    ],
  },
};
