import type { Meta, StoryObj } from '@storybook/react-vite';
import { TabbedPanel } from '@invana/ui';
import {
  FileCode,
  Settings,
  Bug,
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

export const CustomStyling: Story = {
  args: {
    tabs: [
      {
        value: 'tab1',
        label: 'Custom Tab 1',
        icon: FileCode,
        content: <div className="p-4 text-center">Styled content area</div>,
      },
      {
        value: 'tab2',
        label: 'Custom Tab 2',
        icon: Bug,
        content: <div className="p-4 text-center">Another styled area</div>,
      },
    ],
    defaultTab: 'tab1',
    headerActions: [
      {
        name: 'action',
        icon: Settings,
        onClick: () => console.log('Action'),
      },
    ],
    className: 'w-[600px] h-[400px] border-2 border-primary/20 rounded-lg',
    headerClassName: 'bg-primary/5 border-b-2 border-primary/20',
    bodyClassName: 'bg-muted/20',
  },
};

/**
 * With Disabled Tab.
 * Shows how to disable specific tabs.
 */
