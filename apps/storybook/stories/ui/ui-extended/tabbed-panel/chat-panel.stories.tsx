import type { Meta, StoryObj } from '@storybook/react-vite';
import { TabbedPanel, TypographyH5 } from '@invana/ui';
import {
  MessageSquare,
  Plus,
  Settings,
  MoreHorizontal,
  Maximize2,
  X,
} from 'lucide-react';

const meta: Meta<typeof TabbedPanel> = {
  title: 'UI/UI Extended/TabbedPanel',
  component: TabbedPanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};


const ChatContent = () => (
  <div className="flex flex-col h-full">
    <div className="p-3 border-b">
      <div className="text-sm font-semibold text-muted-foreground uppercase">Recent Sessions</div>
    </div>
    <div className="flex-1 p-2 space-y-2">
      <div className="p-3 rounded-lg hover:bg-accent cursor-pointer">
        <div className="flex items-start gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
          <div className="flex-1">
            <div className="text-base font-medium">Running a Python script in Docker</div>
            <div className="text-sm text-muted-foreground mt-1">Finished</div>
          </div>
          <div className="text-sm text-muted-foreground">Local • 3 wks</div>
        </div>
      </div>
      <button className="w-full text-base text-center py-2 hover:bg-accent rounded">
        Show All Sessions
      </button>
    </div>
    <div className="flex-1 flex items-center justify-center flex-col p-6 text-center">
      <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
      <TypographyH5 className="mb-2">Build with Agent</TypographyH5>
      <p className="text-base text-muted-foreground mb-4">AI responses may be inaccurate.</p>
      <button className="text-base text-primary hover:underline">
        Generate Agent Instructions
      </button>
    </div>
  </div>
);

// ===== BASIC EXAMPLES =====

/**
 * Basic tabbed panel with simple content.
 * Demonstrates the fundamental usage with multiple tabs.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const ChatPanel: Story = {
  args: {
    tabs: [
      {
        value: 'chat',
        label: 'CHAT',
        content: <ChatContent />,
      },
    ],
    defaultTab: 'chat',
    headerActions: [
      {
        name: 'new-chat',
        icon: Plus,
        onClick: () => console.log('New chat'),
        tooltip: 'New Chat',
      },
      {
        name: 'settings',
        icon: Settings,
        onClick: () => console.log('Settings'),
        tooltip: 'Settings',
      },
      {
        name: 'more',
        icon: MoreHorizontal,
        onClick: () => console.log('More'),
        tooltip: 'More Options',
      },
      {
        name: 'expand',
        icon: Maximize2,
        onClick: () => console.log('Expand'),
        tooltip: 'Expand',
        showSeperator: true,
      },
      {
        name: 'close',
        icon: X,
        onClick: () => console.log('Close'),
        tooltip: 'Close',
      },
    ],
    className: 'w-[400px] h-[700px]',
    bodyClassName: 'p-0',
    headerClassName: 'bg-muted/30',
  },
};

/**
 * Bottom Panel (VS Code style).
 * Replicates the bottom panel with problems, terminal, output, etc.
 */
