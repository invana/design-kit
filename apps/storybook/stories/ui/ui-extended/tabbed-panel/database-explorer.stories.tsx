import type { Meta, StoryObj } from '@storybook/react-vite';
import { TabbedPanel } from '@invana/ui';
import {
  Settings,
  FileText,
  Database,
  RefreshCw,
  Clock,
} from 'lucide-react';

const meta: Meta<typeof TabbedPanel> = {
  title: 'UI/UI Extended/TabbedPanel',
  component: TabbedPanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};


// ===== BASIC EXAMPLES =====

/**
 * Basic tabbed panel with simple content.
 * Demonstrates the fundamental usage with multiple tabs.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const DatabaseExplorer: Story = {
  args: {
    tabs: [
      {
        value: 'tables',
        label: 'Tables',
        icon: Database,
        content: (
          <div className="p-2 space-y-1">
            <div className="p-2 rounded hover:bg-accent cursor-pointer text-base">users</div>
            <div className="p-2 rounded hover:bg-accent cursor-pointer text-base">products</div>
            <div className="p-2 rounded hover:bg-accent cursor-pointer text-base">orders</div>
            <div className="p-2 rounded hover:bg-accent cursor-pointer text-base">categories</div>
          </div>
        ),
      },
      {
        value: 'queries',
        label: 'Queries',
        icon: FileText,
        content: (
          <div className="p-2 space-y-1">
            <div className="p-2 rounded hover:bg-accent cursor-pointer text-base">Get all users</div>
            <div className="p-2 rounded hover:bg-accent cursor-pointer text-base">Recent orders</div>
            <div className="p-2 rounded hover:bg-accent cursor-pointer text-base">Top products</div>
          </div>
        ),
      },
      {
        value: 'history',
        label: 'History',
        icon: Clock,
        content: (
          <div className="p-2 space-y-2">
            <div className="p-2 rounded hover:bg-accent cursor-pointer">
              <div className="text-base font-mono">SELECT * FROM users</div>
              <div className="text-sm text-muted-foreground mt-1">2 minutes ago</div>
            </div>
            <div className="p-2 rounded hover:bg-accent cursor-pointer">
              <div className="text-base font-mono">SELECT COUNT(*) FROM orders</div>
              <div className="text-sm text-muted-foreground mt-1">5 minutes ago</div>
            </div>
          </div>
        ),
      },
    ],
    defaultTab: 'tables',
    headerActions: [
      {
        name: 'refresh',
        icon: RefreshCw,
        onClick: () => console.log('Refresh'),
        tooltip: 'Refresh',
      },
      {
        name: 'settings',
        icon: Settings,
        onClick: () => console.log('Settings'),
        tooltip: 'Settings',
      },
    ],
    className: 'w-[400px] h-[500px]',
  },
};

/**
 * Customized Styling.
 * Demonstrates using className props to customize the panel appearance.
 */
