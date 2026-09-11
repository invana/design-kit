import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TabbedPanel, PropertyList, PropertyRow, Badge } from '@invana/ui';
import {
  Info,
  Settings,
  Paintbrush,
  Layers,
  History,
  Search,
  MousePointerClick,
  ScanSearch,
  Filter,
  Network,
  Users,
} from 'lucide-react';

/**
 * `overflow` — the tabs that don't fit fold into a `…` menu instead of setting
 * the panel's minimum width.
 *
 * A panel whose width the user controls (a resizable inspector, a side panel)
 * used to have two bad options: let the strip overflow and scroll the whole
 * panel sideways, or cap how many tabs it could carry. `overflow` measures the
 * header and folds the remainder, so the panel narrows cleanly and every tab
 * stays reachable.
 *
 * Drag the slider — or the panel's own bottom-right corner — and watch the
 * strip fold. Three things to look for:
 *
 * - **The active tab never folds.** Select a late tab from the `…` menu and it
 *   moves onto the strip, displacing whichever tab fits least well.
 * - **The keyboard reaches everything.** Focus a tab and press ← / → : selection
 *   follows focus, and arrowing onto a folded tab brings it back onto the strip.
 * - **`keepMounted` keeps the panels alive** — type in the Find box, switch tab,
 *   come back. Off by default; this story turns it on.
 */
const meta: Meta<typeof TabbedPanel> = {
  title: 'UI/UI Extended/TabbedPanel',
  component: TabbedPanel,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TabbedPanel>;

/** A panel body with enough in it to tell the tabs apart. */
const Body = ({ title, note }: { title: string; note: string }) => (
  <div className="flex flex-col gap-4 p-3">
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Badge variant="outline" size="xs">
          panel
        </Badge>
        <span className="font-semibold">{title}</span>
      </div>
      <p className="text-meta text-muted-foreground">{note}</p>
    </div>
    <PropertyList>
      <PropertyRow label="nodes">10</PropertyRow>
      <PropertyRow label="edges">14</PropertyRow>
      <PropertyRow label="layout" mono>
        graph-force
      </PropertyRow>
    </PropertyList>
  </div>
);

/** One panel that keeps state, to show `keepMounted` doing its job. */
const FindBody = () => {
  const [q, setQ] = React.useState('');
  return (
    <div className="flex flex-col gap-3 p-3">
      <label className="flex flex-col gap-1">
        <span className="text-meta text-muted-foreground">Find in canvas</span>
        <input
          id="overflow-story-find"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Type, then switch tabs and come back"
          className="h-7 border border-input bg-background px-2 rounded-control
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </label>
      <p className="text-meta text-muted-foreground">
        {q ? `Searching for “${q}” — this survives a tab switch.` : 'Nothing searched yet.'}
      </p>
    </div>
  );
};

const TABS = [
  { value: 'canvas', label: 'Canvas', icon: Info, content: <Body title="Canvas" note="What this board is." /> },
  { value: 'settings', label: 'Settings', icon: Settings, content: <Body title="Settings" note="Every live layer, behaviour and layout." /> },
  { value: 'styling', label: 'Styling', icon: Paintbrush, content: <Body title="Styling" note="Colour and label key, per type." /> },
  { value: 'layers', label: 'Layers', icon: Layers, content: <Body title="Layers" note="The scene as a file tree." /> },
  { value: 'snapshots', label: 'Snapshots', icon: History, content: <Body title="Snapshots" note="Saved states, with thumbnails." /> },
  { value: 'find', label: 'Find', icon: Search, content: <FindBody /> },
  { value: 'selection', label: 'Selection', icon: MousePointerClick, content: <Body title="Selection" note="What is selected right now." /> },
  { value: 'element', label: 'Element', icon: ScanSearch, content: <Body title="Element" note="The clicked node or edge, in detail." /> },
  { value: 'filters', label: 'Filters', icon: Filter, content: <Body title="Filters" note="Elements parked out of the board." /> },
  { value: 'schema', label: 'Schema', icon: Network, content: <Body title="Schema" note="Types and their relationships." /> },
  { value: 'people', label: 'People', icon: Users, content: <Body title="People" note="Who else is on this board." /> },
];

export const WithOverflow: Story = {
  name: 'With overflow',
  render: () => {
    const [width, setWidth] = React.useState(400);
    const [count, setCount] = React.useState(9);
    const [tab, setTab] = React.useState('snapshots');
    const tabs = TABS.slice(0, count);

    // Selecting a tab, then dropping the count below it, would leave the panel
    // pointing at a tab that is no longer there.
    React.useEffect(() => {
      if (!tabs.some((t) => t.value === tab)) setTab(tabs[tabs.length - 1]!.value);
    }, [count]);

    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-6">
          <label className="flex flex-col gap-1" htmlFor="overflow-story-width">
            <span className="text-meta text-muted-foreground">
              Panel width — <span className="font-mono tabular-nums">{width}px</span>
            </span>
            <input
              id="overflow-story-width"
              type="range"
              min={240}
              max={720}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-[420px] accent-primary"
            />
          </label>

          <label className="flex flex-col gap-1" htmlFor="overflow-story-count">
            <span className="text-meta text-muted-foreground">
              Tabs — <span className="font-mono tabular-nums">{count}</span>
            </span>
            <input
              id="overflow-story-count"
              type="range"
              min={3}
              max={TABS.length}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-[160px] accent-primary"
            />
          </label>
        </div>

        {/* `resize-x` so the panel can also be dragged by its corner — the same
            thing a resizable side panel does in an app shell. */}
        <div
          className="resize-x overflow-hidden border border-dashed border-border p-px"
          style={{ width, height: 320 }}
        >
          <TabbedPanel
            overflow
            keepMounted
            tabs={tabs}
            activeTab={tab}
            onTabChange={setTab}
            bodyClassName="p-0"
          />
        </div>

        <p className="max-w-[70ch] text-meta text-muted-foreground">
          Without <code className="font-mono">overflow</code> the strip would set this panel's
          minimum width and the dashed box would scroll sideways instead of narrowing.
        </p>
      </div>
    );
  },
};
