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

export const FullWidth: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="w-[600px]">
        <SearchInput value={value} onChange={setValue} />
      </div>
    );
  }
};

/**
 * Search with real-time filtering example.
 * Demonstrates filtering a list based on search input.
 */
