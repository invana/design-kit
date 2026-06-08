import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Toaster } from '@invana/ui';
import { toast } from 'sonner';

const meta: Meta<typeof Toaster> = {
  title: 'UI/UI/Sonner',
  component: Toaster,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" onClick={() => toast('Event has been created')}>
        Show toast
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.success('Changes saved', {
            description: 'Your profile has been updated.',
          })
        }
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.error('Something went wrong', {
            description: 'Please try again later.',
          })
        }
      >
        Error
      </Button>
      <Toaster />
    </div>
  ),
};
