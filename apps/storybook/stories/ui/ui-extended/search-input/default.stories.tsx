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
};


/**
 * Default search input with placeholder text.
 * Basic usage for simple search functionality.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="w-[400px]">
        <SearchInput value={value} onChange={setValue} />
        <p className="text-sm text-muted-foreground mt-2">Search value: {value || '(empty)'}</p>
      </div>
    );
  }
};

/**
 * Search input with initial value.
 * Use this when you want to pre-populate the search field.
 */
