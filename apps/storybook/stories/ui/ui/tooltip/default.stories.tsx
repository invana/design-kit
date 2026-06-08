import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Button,
} from '@invana/ui';
import { Plus } from 'lucide-react';

const meta: Meta<typeof Tooltip> = {
  title: 'UI/UI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add item</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add a new item</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
