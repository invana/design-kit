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

export const MultipleSearchInputs: Story = {
  render: () => {
    const [nameSearch, setNameSearch] = useState('');
    const [emailSearch, setEmailSearch] = useState('');
    const [locationSearch, setLocationSearch] = useState('');

    return (
      <div className="w-[500px] space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Search by Name</label>
          <SearchInput value={nameSearch} onChange={setNameSearch} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Search by Email</label>
          <SearchInput value={emailSearch} onChange={setEmailSearch} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Search by Location</label>
          <SearchInput value={locationSearch} onChange={setLocationSearch} />
        </div>
        <div className="p-3 bg-muted rounded-md text-sm">
          <p className="font-medium mb-2">Active Filters:</p>
          {!nameSearch && !emailSearch && !locationSearch ? (
            <p className="text-muted-foreground">No filters applied</p>
          ) : (
            <ul className="space-y-1">
              {nameSearch && <li>• Name: "{nameSearch}"</li>}
              {emailSearch && <li>• Email: "{emailSearch}"</li>}
              {locationSearch && <li>• Location: "{locationSearch}"</li>}
            </ul>
          )}
        </div>
      </div>
    );
  }
};
