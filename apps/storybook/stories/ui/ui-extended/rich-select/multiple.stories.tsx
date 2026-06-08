import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { RichSelect, Badge } from '@invana/ui';
import { Bug, Zap, Database, Shield, Eye } from 'lucide-react';

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
 * Multi-select with checkboxes. The menu stays open while toggling, options
 * carry trailing count badges, and the trigger shows a running count.
 */
export const Multiple: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['errors', 'perf']);
    return (
      <div className="w-[300px]">
        <RichSelect
          multiple
          label="Filters"
          placeholder="All events"
          value={value}
          onChange={(v) => setValue(v as string[])}
          options={[
            {
              value: 'errors',
              label: 'Errors',
              description: 'Failed requests and exceptions',
              icon: Bug,
              badge: <Badge variant="destructive">128</Badge>,
            },
            {
              value: 'perf',
              label: 'Performance',
              description: 'Slow traces over threshold',
              icon: Zap,
              badge: <Badge variant="secondary">42</Badge>,
            },
            {
              value: 'db',
              label: 'Database',
              description: 'Queries and connections',
              icon: Database,
              badge: <Badge variant="secondary">17</Badge>,
            },
            {
              value: 'security',
              label: 'Security',
              description: 'Auth and access events',
              icon: Shield,
              badge: <Badge variant="secondary">3</Badge>,
            },
            {
              value: 'audit',
              label: 'Audit log',
              description: 'Read-only — coming soon',
              icon: Eye,
              disabled: true,
            },
          ]}
        />
        <p className="text-sm text-muted-foreground mt-3">
          Selected: {value.length ? value.join(', ') : '(none)'}
        </p>
      </div>
    );
  },
};
