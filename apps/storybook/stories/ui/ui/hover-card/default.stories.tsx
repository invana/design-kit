import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  Button,
} from '@invana/ui';
import { CalendarDays } from 'lucide-react';

const meta: Meta<typeof HoverCard> = {
  title: 'UI/UI/HoverCard',
  component: HoverCard,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@invana</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted font-semibold">
            IN
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@invana</h4>
            <p className="text-sm text-muted-foreground">
              The open-source graph visualization and analytics platform.
            </p>
            <div className="flex items-center pt-2 text-xs text-muted-foreground">
              <CalendarDays className="mr-2 h-4 w-4" />
              Joined December 2021
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};
