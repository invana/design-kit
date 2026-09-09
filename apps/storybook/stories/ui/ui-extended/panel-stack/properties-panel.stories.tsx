import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Info,
  Link2,
  Quote,
  Sparkles,
  Copy,
  Pin,
  PinOff,
  ExternalLink,
  MoreHorizontal,
  EyeOff,
} from 'lucide-react';
import { PanelStack, Badge, PropertyList, PropertyRow } from '@invana/ui';

const meta: Meta<typeof PanelStack> = {
  title: 'UI/UI Extended/PanelStack',
  component: PanelStack,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const RELATIONS = [
  { type: 'SUPPORTS', target: 'art_20260908_reuters_11' },
  { type: 'DERIVED_FROM', target: 'stk_BPCL' },
  { type: 'CONTRADICTS', target: 'obs_20260907_bpcl_04' },
];

const CITATIONS = [
  'Reuters · Defence order book firms up',
  'NSE · Delivery volumes 2026-09-08',
];

/**
 * The right-hand inspector — the shape most product panels end up in, and the
 * one that uses every seam at once.
 *
 * `title` carries a node so each section can pin a readout that has to stay
 * legible (a relation count, the `thesis` kind); `headerActions` carries what
 * only matters under the pointer, so the column reads quietly at rest.
 * **Summary** pins its actions with `actionsOnHover: false` because pinning
 * the record is the panel's primary verb, and **Citations** starts collapsed.
 *
 * Pin the record and the header icon flips — the stack owns none of that
 * state, it just renders the sections it is handed.
 */
export const PropertiesPanel: Story = {
  render: () => <PropertiesPanelDemo />,
};

const PropertiesPanelDemo = () => {
  const [pinned, setPinned] = useState(false);
  const [hiddenRelations, setHiddenRelations] = useState<string[]>([]);

  const relations = RELATIONS.filter(
    (r) => !hiddenRelations.includes(r.type)
  );

  return (
    <div className="h-[600px] w-[320px] overflow-hidden rounded-md border border-border bg-background">
      <PanelStack
        sections={[
          {
            id: 'summary',
            title: (
              <span className="flex w-full min-w-0 items-center gap-2">
                <span className="truncate text-meta font-semibold uppercase tracking-wide">
                  Summary
                </span>
                <Badge variant="secondary" className="rounded-full px-1.5 py-0">
                  thesis
                </Badge>
              </span>
            ),
            icon: Info,
            actionsOnHover: false,
            content: (
              <div className="flex flex-col gap-2 px-3 py-2">
                <div className="flex items-baseline gap-2">
                  <span
                    aria-hidden
                    style={{ color: 'var(--color-data-3)' }}
                    className="size-2 shrink-0 rounded-full bg-current"
                  />
                  <span className="truncate font-mono text-meta">
                    obs_20260908_bpcl_01
                  </span>
                </div>
                <PropertyList>
                  <PropertyRow label="kind">thesis</PropertyRow>
                  <PropertyRow label="direction">long</PropertyRow>
                  <PropertyRow label="horizon">intraday</PropertyRow>
                  <PropertyRow label="confidence">0.72</PropertyRow>
                </PropertyList>
              </div>
            ),
            headerActions: [
              {
                name: pinned ? 'Unpin record' : 'Pin record',
                icon: pinned ? PinOff : Pin,
                onClick: () => setPinned((v) => !v),
              },
              {
                name: 'More options',
                icon: MoreHorizontal,
                menuItems: [
                  { id: 'copy-id', label: 'Copy record id', icon: Copy },
                  {
                    id: 'open',
                    label: 'Open in new tab',
                    icon: ExternalLink,
                    shortcut: '⌘↵',
                  },
                ],
              },
            ],
          },
          {
            id: 'relations',
            title: (
              <span className="flex w-full min-w-0 items-center justify-between gap-2">
                <span className="truncate text-meta font-semibold uppercase tracking-wide">
                  Relations
                </span>
                <span className="shrink-0 text-meta tabular-nums text-muted-foreground">
                  {relations.length}
                </span>
              </span>
            ),
            icon: Link2,
            content: (
              <ul className="py-1">
                {relations.map((r) => (
                  <li
                    key={r.type}
                    className="flex items-center gap-2 px-3 py-1 hover:bg-accent/50"
                  >
                    <span className="shrink-0 font-mono text-meta text-muted-foreground">
                      {r.type}
                    </span>
                    <span className="truncate font-mono text-meta text-foreground">
                      {r.target}
                    </span>
                  </li>
                ))}
                {relations.length === 0 && (
                  <li className="px-3 py-2 text-meta text-muted-foreground">
                    All relation types hidden.
                  </li>
                )}
              </ul>
            ),
            headerActions: [
              {
                name: 'More options',
                icon: MoreHorizontal,
                menuItems: [
                  ...RELATIONS.map((r) => ({
                    id: r.type,
                    label: hiddenRelations.includes(r.type)
                      ? `Show ${r.type}`
                      : `Hide ${r.type}`,
                    icon: EyeOff,
                    onSelect: () =>
                      setHiddenRelations((prev) =>
                        prev.includes(r.type)
                          ? prev.filter((t) => t !== r.type)
                          : [...prev, r.type]
                      ),
                  })),
                  {
                    id: 'show-all',
                    label: 'Show all relations',
                    separatorBefore: true,
                    disabled: hiddenRelations.length === 0,
                    onSelect: () => setHiddenRelations([]),
                  },
                ],
              },
            ],
          },
          {
            id: 'citations',
            title: 'Citations',
            icon: Quote,
            defaultCollapsed: true,
            content: (
              <ul className="py-1">
                {CITATIONS.map((c) => (
                  <li
                    key={c}
                    className="truncate px-3 py-1 text-foreground hover:bg-accent/50"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            ),
          },
          {
            id: 'thinking',
            title: 'Thinking',
            icon: Sparkles,
            defaultCollapsed: true,
            content: (
              <p className="px-3 py-2 text-muted-foreground">
                Delivery volumes lead the order-book confirmation by two
                sessions, so the intraday leg is sized against volume rather
                than price.
              </p>
            ),
          },
        ]}
      />
    </div>
  );
};
