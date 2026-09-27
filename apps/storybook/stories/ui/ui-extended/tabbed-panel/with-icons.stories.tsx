import type { Meta, StoryObj } from '@storybook/react-vite';
import { TabbedPanel } from '@invana/ui';
import {
  Folder,
  Search,
  GitBranch,
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

export const WithIcons: Story = {
  args: {
    tabs: [
      {
        value: 'files',
        label: 'Files',
        icon: Folder,
        content: <div className="p-4">File browser content</div>,
      },
      {
        value: 'search',
        label: 'Search',
        icon: Search,
        content: <div className="p-4">Search results</div>,
      },
      {
        value: 'git',
        label: 'Git',
        icon: GitBranch,
        content: <div className="p-4">Git changes</div>,
      },
    ],
    defaultTab: 'files',
    className: 'w-[600px] h-[400px]',
  },
};

/**
 * Panel with header actions.
 * Demonstrates adding action buttons to the header using NavHorizontal items.
 */
