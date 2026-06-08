import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from '@invana/ui';

const meta: Meta<typeof Spinner> = {
  title: 'UI/UI/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-6 text-primary">
      <Spinner className="size-4" />
      <Spinner className="size-6" />
      <Spinner className="size-8" />
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner className="size-4" />
        Loading…
      </div>
    </div>
  ),
};
