import type { Meta, StoryObj } from '@storybook/react-vite';
import { Home, Search, LayoutGrid, Settings, User } from 'lucide-react';
import { NavVertical, TooltipProvider } from '@invana/ui';

const meta: Meta<typeof NavVertical> = {
  title: 'UI/UI Extended/NavVertical',
  component: NavVertical,
  parameters: {
    layout: 'fullscreen',
  },
  // tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Vertical sidebar navigation with icon-only items, tooltips on the right,
 * and a bottom-anchored section. Needs a parent with a fixed height.
 */
export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <div className="h-screen w-[45px] border-r bg-card text-card-foreground">
        <NavVertical
          topNavItems={[
            { name: 'Home', icon: Home, onClick: () => {} },
            { name: 'Search', icon: Search, href: '#search' },
            { name: 'Apps', icon: LayoutGrid, onClick: () => {}, showSeperator: true },
          ]}
          bottomNavItems={[
            { name: 'Settings', icon: Settings, onClick: () => {} },
            { name: 'Profile', icon: User, href: '#profile' },
          ]}
        />
      </div>
    </TooltipProvider>
  ),
};
