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

export const Compact: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="w-[250px]">
        <SearchInput
          value={value}
          onChange={setValue}
          className="h-8 text-sm"
        />
      </div>
    );
  }
};

/**
 * Full-width search input.
 * Expands to fill container width, useful for main search areas.
 */
