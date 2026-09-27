import type { Meta, StoryObj } from '@storybook/react-vite';
import { TabbedPanel } from '@invana/ui';
import {
  FileCode,
  Terminal,
  AlertCircle,
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

export const WithDisabledTab: Story = {
  args: {
    tabs: [
      {
        value: 'enabled1',
        label: 'Enabled Tab',
        icon: FileCode,
        content: <div className="p-4">This tab is enabled</div>,
      },
      {
        value: 'disabled',
        label: 'Disabled Tab',
        icon: AlertCircle,
        content: <div className="p-4">This content won't show</div>,
        disabled: true,
      },
      {
        value: 'enabled2',
        label: 'Another Enabled',
        icon: Terminal,
        content: <div className="p-4">This tab is also enabled</div>,
      },
    ],
    defaultTab: 'enabled1',
    className: 'w-[600px] h-[400px]',
  },
};
