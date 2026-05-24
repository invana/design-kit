import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SearchInput } from '@invana/ui';

const meta: Meta<typeof SearchInput> = {
  title: 'UI/UI Extended/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
} satisfies Meta<typeof SearchInput>;


/**
 * Default search input with placeholder text.
 * Basic usage for simple search functionality.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const WithInitialValue: Story = {
  render: () => {
    const [value, setValue] = useState('Initial search text');
    return (
      <div className="w-[400px]">
        <SearchInput value={value} onChange={setValue} />
        <p className="text-sm text-muted-foreground mt-2">Current value: {value}</p>
      </div>
    );
  }
};

/**
 * Compact search input for toolbars.
 * Smaller size for use in headers or sidebars.
 */
