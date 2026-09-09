import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Layers,
  SlidersHorizontal,
  Palette,
  History,
  Eye,
  EyeOff,
  MoreHorizontal,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { PanelStack } from '@invana/ui';

const meta: Meta<typeof PanelStack> = {
  title: 'UI/UI Extended/PanelStack',
  component: PanelStack,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const LAYERS = [
  { name: 'Nodes', count: 512 },
  { name: 'Edges', count: 1_284 },
  { name: 'Labels', count: 512 },
  { name: 'Clusters', count: 6 },
];

const FILTERS = [
  'degree ≥ 3',
  'confidence > 0.6',
  'updated in the last 7 days',
];

const LEGEND = [
  { name: 'Stock', color: 'var(--color-data-1)' },
  { name: 'Article', color: 'var(--color-data-2)' },
  { name: 'Observation', color: 'var(--color-data-3)' },
  { name: 'Learning', color: 'var(--color-data-4)' },
];

const EDITS = [
  'Hid 2 clusters',
  'Set confidence filter',
  'Pinned obs_20260908_bpcl_01',
  'Ran layout: force-directed',
];

/**
 * `icon` puts a component before the title, in the same muted colour as the
 * chevron — the section's identity at a glance, without spending the title on
 * it. It sits between the chevron and the title, so it survives a custom
 * `title` node too.
 *
 * The eye toggles below are ordinary body content: a section owns its body
 * completely, and the stack only owns the header row and the resizing.
 */
export const SectionIcons: Story = {
  render: () => <SectionIconsDemo />,
};

const SectionIconsDemo = () => {
  const [hidden, setHidden] = useState<string[]>(['Clusters']);
  const isHidden = (name: string) => hidden.includes(name);

  return (
    <div className="h-[560px] w-[300px] overflow-hidden rounded-md border border-border bg-background">
      <PanelStack
        sections={[
          {
            id: 'layers',
            title: 'Layers',
            icon: Layers,
            content: (
              <ul className="py-1">
                {LAYERS.map((layer) => (
                  <li
                    key={layer.name}
                    className="flex items-center gap-2 px-2 py-1 hover:bg-accent/50"
                  >
                    <button
                      type="button"
                      aria-label={`${isHidden(layer.name) ? 'Show' : 'Hide'} ${layer.name}`}
                      onClick={() =>
                        setHidden((prev) =>
                          prev.includes(layer.name)
                            ? prev.filter((n) => n !== layer.name)
                            : [...prev, layer.name]
                        )
                      }
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {isHidden(layer.name) ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <span
                      className={
                        isHidden(layer.name)
                          ? 'truncate text-muted-foreground line-through'
                          : 'truncate text-foreground'
                      }
                    >
                      {layer.name}
                    </span>
                    <span className="ml-auto text-meta tabular-nums text-muted-foreground">
                      {layer.count.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            ),
            headerActions: [
              {
                name: 'More options',
                icon: MoreHorizontal,
                menuItems: [
                  {
                    id: 'show-all',
                    label: 'Show all layers',
                    icon: Eye,
                    disabled: hidden.length === 0,
                    onSelect: () => setHidden([]),
                  },
                ],
              },
            ],
          },
          {
            id: 'filters',
            title: 'Filters',
            icon: SlidersHorizontal,
            content: (
              <ul className="py-1">
                {FILTERS.map((f) => (
                  <li
                    key={f}
                    className="truncate px-2 py-1 font-mono text-meta text-foreground hover:bg-accent/50"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            ),
            headerActions: [
              {
                name: 'More options',
                icon: MoreHorizontal,
                menuItems: [
                  { id: 'reset', label: 'Reset filters', icon: RotateCcw },
                  {
                    id: 'clear',
                    label: 'Remove all filters',
                    icon: Trash2,
                    destructive: true,
                    separatorBefore: true,
                  },
                ],
              },
            ],
          },
          {
            id: 'legend',
            title: 'Legend',
            icon: Palette,
            defaultCollapsed: true,
            content: (
              <ul className="py-1">
                {LEGEND.map((entry) => (
                  <li
                    key={entry.name}
                    className="flex items-center gap-2 px-2 py-1"
                  >
                    <span
                      aria-hidden
                      style={{ color: entry.color }}
                      className="size-2 shrink-0 rounded-full bg-current"
                    />
                    <span className="truncate text-foreground">{entry.name}</span>
                  </li>
                ))}
              </ul>
            ),
          },
          {
            id: 'history',
            title: 'History',
            icon: History,
            defaultCollapsed: true,
            content: (
              <ol className="py-1">
                {EDITS.map((edit) => (
                  <li
                    key={edit}
                    className="truncate px-2 py-1 text-foreground hover:bg-accent/50"
                  >
                    {edit}
                  </li>
                ))}
              </ol>
            ),
          },
        ]}
      />
    </div>
  );
};
