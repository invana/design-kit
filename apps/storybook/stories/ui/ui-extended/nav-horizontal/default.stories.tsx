import type { Meta, StoryObj } from '@storybook/react-vite';
import { Home, LayoutGrid, Settings, Bell, User } from 'lucide-react';
import { NavHorizontal, TooltipProvider } from '@invana/ui';

const meta: Meta<typeof NavHorizontal> = {
  title: 'UI/UI Extended/NavHorizontal',
  component: NavHorizontal,
  parameters: {
    layout: 'padded',
  },
  // tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Horizontal header navigation with branded content on the left, nav items
 * with icons + labels, and icon-only actions on the right.
 */
export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <NavHorizontal
        className="h-12 rounded-md border bg-card px-3 text-card-foreground"
        left={<span className="mr-2 font-semibold">Invana</span>}
        leftNavItems={[
          { name: 'Home', label: 'Home', icon: Home, onClick: () => {} },
          { name: 'Apps', label: 'Apps', icon: LayoutGrid, href: '#apps' },
        ]}
        rightNavItems={[
          { name: 'Notifications', icon: Bell, onClick: () => {} },
          { name: 'Settings', icon: Settings, onClick: () => {} },
          { name: 'Profile', icon: User, href: '#profile' },
        ]}
      />
    </TooltipProvider>
  ),
};
