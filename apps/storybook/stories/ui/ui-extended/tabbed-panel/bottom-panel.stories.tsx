import type { Meta, StoryObj } from '@storybook/react-vite';
import { TabbedPanel } from '@invana/ui';
import {
  X,
  Filter,
  Copy,
  Trash2,
} from 'lucide-react';

const meta: Meta<typeof TabbedPanel> = {
  title: 'UI/UI Extended/TabbedPanel',
  component: TabbedPanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};


const ProblemsContent = () => (
  <div className="p-4">
    <div className="text-base text-muted-foreground">
      No problems have been detected in the workspace.
    </div>
  </div>
);

const TerminalContent = () => (
  <div className="p-3 font-mono text-sm bg-black text-green-400 h-full">
    <div>$ npm run dev</div>
    <div className="text-muted-foreground mt-1">&gt; design-kit@1.0.0 dev</div>
    <div className="text-muted-foreground">&gt; vite</div>
    <div className="mt-2 text-blue-400">  VITE v5.0.0  ready in 234 ms</div>
    <div className="mt-1">  ➜  Local:   http://localhost:5173/</div>
    <div>  ➜  Network: http://192.168.1.100:5173/</div>
    <div className="mt-2 text-yellow-400">  press h + enter to show help</div>
    <div className="mt-2 animate-pulse">█</div>
  </div>
);

// ===== BASIC EXAMPLES =====

/**
 * Basic tabbed panel with simple content.
 * Demonstrates the fundamental usage with multiple tabs.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const BottomPanel: Story = {
  args: {
    tabs: [
      {
        value: 'problems',
        label: 'PROBLEMS',
        content: <ProblemsContent />,
      },
      {
        value: 'output',
        label: 'OUTPUT',
        content: <div className="p-4 font-mono text-sm">Build output...</div>,
      },
      {
        value: 'debug',
        label: 'DEBUG CONSOLE',
        content: <div className="p-4 font-mono text-sm">Debug console...</div>,
      },
      {
        value: 'terminal',
        label: 'TERMINAL',
        content: <TerminalContent />,
      },
      {
        value: 'queries',
        label: 'QUERY RESULTS',
        content: <div className="p-4">Query results...</div>,
      },
    ],
    defaultTab: 'problems',
    headerActions: [
      {
        name: 'clear',
        icon: Trash2,
        onClick: () => console.log('Clear'),
        tooltip: 'Clear All',
      },
      {
        name: 'copy',
        icon: Copy,
        onClick: () => console.log('Copy'),
        tooltip: 'Copy',
      },
      {
        name: 'filter',
        icon: Filter,
        onClick: () => console.log('Filter'),
        tooltip: 'Filter',
      },
      {
        name: 'close',
        icon: X,
        onClick: () => console.log('Close'),
        tooltip: 'Close Panel',
        showSeperator: true,
      },
    ],
    className: 'w-[1200px] h-[250px]',
    bodyClassName: 'p-0',
    headerClassName: 'bg-muted/20',
  },
};

/**
 * Database Explorer Panel.
 * Shows a database explorer with tables, queries, and history tabs.
 */
