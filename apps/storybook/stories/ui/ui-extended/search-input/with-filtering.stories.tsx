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

export const WithFiltering: Story = {
  render: () => {
    const [searchValue, setSearchValue] = useState('');
    const items = [
      'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry',
      'Fig', 'Grape', 'Honeydew', 'Kiwi', 'Lemon'
    ];

    const filteredItems = items.filter(item =>
      item.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
      <div className="w-[400px]">
        <SearchInput value={searchValue} onChange={setSearchValue} />
        <div className="mt-4 space-y-1">
          <p className="text-sm font-medium">Results ({filteredItems.length}):</p>
          <div className="border rounded-md p-2 max-h-[200px] overflow-auto">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, idx) => (
                <div key={idx} className="text-sm py-1 px-2 hover:bg-muted rounded">
                  {item}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No results found</p>
            )}
          </div>
        </div>
      </div>
    );
  }
};

/**
 * Search with clear button functionality.
 * Shows how to add a clear action to reset the search.
 */
