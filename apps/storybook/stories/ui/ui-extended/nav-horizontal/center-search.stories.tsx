import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Play,
  Save,
  Share2,
  History,
  Download,
  FileJson,
  FileSpreadsheet,
  Copy,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import { NavHorizontal, TooltipProvider, SearchInput } from '@invana/ui';

const meta: Meta<typeof NavHorizontal> = {
  title: 'UI/UI Extended/NavHorizontal',
  component: NavHorizontal,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The three slots in full: `left` for brand chrome, `center` for arbitrary
 * content that gets the flexible middle (a search box here — the `center`
 * section is what stops the end items being pushed by the start ones), and
 * `rightNavItems` for actions.
 *
 * Two of those actions carry `menuItems`: an export menu whose rows name their
 * formats, and a `…` overflow ending in a `destructive` row.
 */
export const CenterSearch: Story = {
  render: () => <CenterSearchDemo />,
};

const CenterSearchDemo = () => {
  const [query, setQuery] = useState('');

  return (
    <TooltipProvider>
      <NavHorizontal
        className="h-12 rounded-md border bg-card px-3 text-card-foreground"
        left={<span className="mr-2 font-semibold">Explorer</span>}
        leftNavItems={[
          { name: 'Run query', label: 'Run', icon: Play, onClick: () => {} },
          { name: 'Save query', icon: Save, onClick: () => {} },
        ]}
        center={
          <div className="w-full max-w-sm px-4">
            <SearchInput
              inputSize="sm"
              value={query}
              onChange={setQuery}
              placeholder="Search nodes, edges, saved queries…"
            />
          </div>
        }
        rightNavItems={[
          { name: 'Query history', icon: History, onClick: () => {} },
          {
            name: 'Export',
            icon: Download,
            menuItems: [
              { id: 'json', label: 'Export as JSON', icon: FileJson },
              { id: 'csv', label: 'Export as CSV', icon: FileSpreadsheet },
              {
                id: 'clipboard',
                label: 'Copy result to clipboard',
                icon: Copy,
                shortcut: '⌘⇧C',
                separatorBefore: true,
              },
            ],
          },
          { name: 'Share', icon: Share2, onClick: () => {} },
          {
            name: 'More options',
            icon: MoreHorizontal,
            menuItems: [
              { id: 'duplicate', label: 'Duplicate query', icon: Copy },
              {
                id: 'delete',
                label: 'Delete query',
                icon: Trash2,
                destructive: true,
                separatorBefore: true,
              },
            ],
          },
        ]}
      />
    </TooltipProvider>
  );
};
