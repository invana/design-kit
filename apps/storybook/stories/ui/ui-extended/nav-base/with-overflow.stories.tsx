import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { NavItems } from '@invana/ui';
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
  Pencil,
  Copy,
  Trash2,
} from 'lucide-react';

/**
 * `NavItems` as a **responsive strip** — the three things a strip of items in
 * this kit now shares, shown on one width.
 *
 * - **`overflow`** folds what doesn't fit into a `…` menu, instead of the strip
 *   setting its container's minimum width. Off by default: a toolbar that would
 *   rather scroll, or one whose items must all stay visible, is unaffected.
 * - **`variant`** picks the treatment — `nav` is the capsule nav items have
 *   always worn, `underline` is a panel's tab strip, `folder` is a workbook's.
 * - **`selectionMode="tabs"`** makes the strip a real tab list: one tab stop,
 *   `role="tab"` + `aria-selected` per item, and ← → Home End moving between
 *   items with selection following focus.
 *
 * Drag the slider. The active item never folds, arrowing onto a folded item
 * brings it back, and the `folder` row's `menuTrigger: 'caret'` shows the other
 * half of the change: a chevron *inside* the item, so the body still selects
 * and only the caret opens the menu.
 */
const meta: Meta<typeof NavItems> = {
  title: 'UI/UI Extended/NavBase',
  component: NavItems,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const PANELS = [
  { key: 'canvas', name: 'Canvas', icon: Info },
  { key: 'settings', name: 'Settings', icon: Settings },
  { key: 'styling', name: 'Styling', icon: Paintbrush },
  { key: 'layers', name: 'Layers', icon: Layers },
  { key: 'snapshots', name: 'Snapshots', icon: History },
  { key: 'find', name: 'Find', icon: Search },
  { key: 'selection', name: 'Selection', icon: MousePointerClick },
  { key: 'element', name: 'Element', icon: ScanSearch },
  { key: 'filters', name: 'Filters', icon: Filter },
  { key: 'schema', name: 'Schema', icon: Network },
  { key: 'people', name: 'People', icon: Users },
];

export const WithOverflow: Story = {
  name: 'With overflow',
  render: () => {
    const [width, setWidth] = React.useState(440);
    const [nav, setNav] = React.useState('styling');
    const [underline, setUnderline] = React.useState('snapshots');
    const [folder, setFolder] = React.useState('layers');

    /** Items carrying only an icon — the treatment a dense toolbar wants. */
    const iconItems = PANELS.map((p) => ({ key: p.key, name: p.name, icon: p.icon }));
    /** Items carrying a label, so folding is visible sooner. */
    const labelledItems = PANELS.map((p) => ({
      key: p.key,
      name: p.name,
      label: p.name,
      icon: p.icon,
    }));
    /** Page tabs: the caret opens the menu, the body still selects. */
    const pageItems = PANELS.map((p) => ({
      key: p.key,
      name: p.name,
      label: p.name,
      icon: p.icon,
      labelClassName: 'max-w-[16ch] truncate',
      menuTrigger: 'caret' as const,
      // The caret is an active-tab affordance, so the menu is supplied only for
      // the selected page — no extra prop needed to express that.
      menuItems:
        p.key === folder
          ? [
              { id: 'rename', label: 'Rename', icon: Pencil },
              { id: 'duplicate', label: 'Duplicate', icon: Copy },
              { id: 'remove', label: 'Remove', icon: Trash2, destructive: true, separatorBefore: true },
            ]
          : undefined,
    }));

    const rows: {
      title: string;
      note: string;
      variant: 'nav' | 'underline' | 'folder';
      items: typeof iconItems;
      active: string;
      onActive: (key: string) => void;
      strip: string;
    }[] = [
      {
        title: 'variant="nav"',
        note: 'The capsule. Toolbars, rails, panel header actions.',
        variant: 'nav',
        items: iconItems,
        active: nav,
        onActive: setNav,
        strip: 'px-1',
      },
      {
        title: 'variant="underline"',
        note: "A panel's views — what TabbedPanel draws.",
        variant: 'underline',
        items: labelledItems,
        active: underline,
        onActive: setUnderline,
        strip: 'gap-0',
      },
      {
        title: 'variant="folder"',
        note: "A workbook's pages, each with a caret menu on the active tab.",
        variant: 'folder',
        items: pageItems,
        active: folder,
        onActive: setFolder,
        strip: 'gap-0',
      },
    ];

    return (
      <div className="flex flex-col gap-5">
        <label className="flex flex-col gap-1" htmlFor="nav-overflow-width">
          <span className="text-meta text-muted-foreground">
            Strip width — <span className="font-mono tabular-nums">{width}px</span>
          </span>
          <input
            id="nav-overflow-width"
            type="range"
            min={200}
            max={900}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="w-[440px] accent-primary"
          />
        </label>

        <div className="flex flex-col gap-6" style={{ width }}>
          {rows.map((row) => (
            <div key={row.variant} className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-meta">{row.title}</span>
                <span className="text-meta text-muted-foreground">{row.note}</span>
              </div>
              {/* The strip needs a bounded width to measure against — here the
                  bordered box provides it. In an app that is the panel header. */}
              <div className="flex h-[30px] items-stretch border-b bg-card">
                <NavItems
                  items={row.items}
                  variant={row.variant}
                  selectionMode="tabs"
                  activeKey={row.active}
                  onActiveChange={row.onActive}
                  overflow
                  overflowLabel="More panels"
                  className={`min-w-0 flex-1 ${row.strip}`}
                  iconClassName="h-3.5 w-3.5 shrink-0"
                />
              </div>
            </div>
          ))}
        </div>

        <p className="max-w-[70ch] text-meta text-muted-foreground">
          Every existing consumer is untouched: with neither{' '}
          <code className="font-mono">overflow</code> nor{' '}
          <code className="font-mono">selectionMode</code> set, <code className="font-mono">NavItems</code>{' '}
          returns a bare fragment and renders exactly as it always has.
        </p>
      </div>
    );
  },
};
