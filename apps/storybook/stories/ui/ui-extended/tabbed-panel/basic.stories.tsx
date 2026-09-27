import type { Meta, StoryObj } from '@storybook/react-vite';
import { TabbedPanel } from '@invana/ui';

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

export const Basic: Story = {
  args: {
    tabs: [
      {
        value: 'tab1',
        label: 'Tab 1',
        content: <div className="p-4">Content for Tab 1</div>,
      },
      {
        value: 'tab2',
        label: 'Tab 2',
        content: <div className="p-4">Content for Tab 2</div>,
      },
      {
        value: 'tab3',
        label: 'Tab 3',
        content: <div className="p-4">Content for Tab 3</div>,
      },
    ],
    defaultTab: 'tab1',
    className: 'w-[600px] h-[400px]',
  },
};

/**
 * Tabs with icons.
 * Shows how to add icons to tab labels for better visual identification.
 */
