import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from '@invana/ui';

const meta: Meta<typeof Skeleton> = {
  title: 'UI/UI/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex w-[320px] flex-col gap-4 rounded-lg border border-border p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="size-12 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-[160px]" />
          <Skeleton className="h-3 w-[100px]" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-[80%]" />
      </div>
      <Skeleton className="h-32 w-full rounded-md" />
    </div>
  ),
};
