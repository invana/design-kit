import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Badge,
  Button,
  FilterChip,
  PropertyList,
  PropertyRow,
  SearchInput,
  SegmentedControl,
  Tabs,
  TabsList,
  TabsTrigger,
  Toggle,
} from '@invana/ui';
import { Input } from '@invana/forms';
import { Settings2 } from 'lucide-react';

const meta: Meta = {
  title: 'Others/Control Sizes',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const OPTIONS = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
];

/**
 * One size name, one height, in every component — the control scale from
 * `@invana/styling` (`--spacing-control-*`). Each row lines its controls up on
 * one baseline; a control taller or shorter than its row is a component that
 * has stopped reading the scale. The `default` row passes no size at all —
 * every control's default is `md`.
 */
export const Scale: Story = {
  render: function Render() {
    const [q, setQ] = React.useState('');
    return (
      <PropertyList labelWidth="auto">
        <PropertyRow label="xs · 22px">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="outline">Button</Button>
            <Button size="icon-xs" variant="ghost" aria-label="Settings">
              <Settings2 />
            </Button>
            <Badge size="xs" variant="outline">badge</Badge>
            <SegmentedControl size="xs" aria-label="Range" options={OPTIONS} />
          </div>
        </PropertyRow>
        <PropertyRow label="sm · 26px">
          <div className="flex items-center gap-2">
            <SearchInput inputSize="sm" className="w-40" value={q} onChange={setQ} placeholder="Search" />
            <Input inputSize="sm" className="w-32" placeholder="Input" />
            <FilterChip label="kind" />
            <Button size="sm" variant="outline">Button</Button>
            <Button size="icon-sm" variant="ghost" aria-label="Settings">
              <Settings2 />
            </Button>
            <Badge size="sm" variant="outline">badge</Badge>
            <SegmentedControl size="sm" aria-label="Range" options={OPTIONS} />
            <Tabs size="sm" defaultValue="day">
              <TabsList>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
              </TabsList>
            </Tabs>
            <Toggle size="sm" variant="outline">B</Toggle>
          </div>
        </PropertyRow>
        <PropertyRow label="default · 32px">
          <div className="flex items-center gap-2">
            <SearchInput className="w-40" value={q} onChange={setQ} placeholder="Search" />
            <Input className="w-32" placeholder="Input" />
            <Button variant="outline">Button</Button>
            <Button size="icon" variant="ghost" aria-label="Settings">
              <Settings2 />
            </Button>
            <SegmentedControl aria-label="Range" options={OPTIONS} />
            <Tabs defaultValue="day">
              <TabsList>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
              </TabsList>
            </Tabs>
            <Toggle variant="outline">B</Toggle>
          </div>
        </PropertyRow>
        <PropertyRow label="lg · 40px">
          <div className="flex items-center gap-2">
            <SearchInput inputSize="lg" className="w-40" value={q} onChange={setQ} placeholder="Search" />
            <Input inputSize="lg" className="w-32" placeholder="Input" />
            <Button size="lg" variant="outline">Button</Button>
            <Toggle size="lg" variant="outline">B</Toggle>
          </div>
        </PropertyRow>
      </PropertyList>
    );
  },
};
