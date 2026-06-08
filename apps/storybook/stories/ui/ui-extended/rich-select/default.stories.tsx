import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { RichSelect } from '@invana/ui';
import { LayoutGrid, Network, GitFork, Circle } from 'lucide-react';

const meta: Meta<typeof RichSelect> = {
  title: 'UI/UI Extended/RichSelect',
  component: RichSelect,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Single-select with rich rows — each option carries an icon and a muted
 * description. The trigger reflects the active option's icon + label.
 */
export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<string>('force');
    return (
      <div className="w-[280px]">
        <RichSelect
          label="Layout"
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
        <p className="text-sm text-muted-foreground mt-3">Selected: {value}</p>
      </div>
    );
  },
};
