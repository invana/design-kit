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

export const WithClearButton: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="w-[400px]">
        <div className="relative">
          <SearchInput value={value} onChange={setValue} />
          {value && (
            <button
              onClick={() => setValue('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {value ? `Searching for: "${value}"` : 'Type to search...'}
        </p>
      </div>
    );
  }
};

/**
 * Multiple search inputs for advanced filtering.
 * Use this pattern for multi-field search forms.
 */
