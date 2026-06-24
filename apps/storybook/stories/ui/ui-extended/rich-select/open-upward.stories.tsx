import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { RichSelect } from '@invana/ui';
import { LayoutGrid, Network, GitFork, Circle } from 'lucide-react';

const meta: Meta<typeof RichSelect> = {
  title: 'UI/UI Extended/RichSelect',
  component: RichSelect,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `side="top"` opens the options upward — useful when the trigger sits in a
 * footer or near the bottom of the viewport. Radix still flips to the opposite
 * side automatically if the chosen side lacks space.
 */
export const OpenUpward: Story = {
  render: () => {
    const [value, setValue] = useState<string>('force');
    return (
      <div className="flex h-screen flex-col">
        <div className="flex-1 p-4 text-sm text-muted-foreground">
          Footer-anchored RichSelect — opens upward via <code>side=&quot;top&quot;</code>.
        </div>
        <footer className="flex items-center justify-between border-t bg-background p-3">
          <span className="text-sm text-muted-foreground">Selected: {value}</span>
          <RichSelect
            label="Layout"
            side="top"
            align="end"
            value={value}
            onChange={(v) => setValue(v as string)}
            options={[
              {
                value: 'force',
                label: 'Force-directed',
                description: 'Physics-based, organic clusters',
                icon: Network,
              },
              {
                value: 'grid',
                label: 'Grid',
                description: 'Evenly spaced rows and columns',
                icon: LayoutGrid,
              },
              {
                value: 'tree',
                label: 'Hierarchy',
                description: 'Top-down parent → child tree',
                icon: GitFork,
              },
              {
                value: 'circular',
                label: 'Circular',
                description: 'Nodes arranged on a ring',
                icon: Circle,
              },
            ]}
          />
        </footer>
      </div>
    );
  },
};
