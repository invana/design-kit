import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Download,
  MoreHorizontal,
  FileJson,
  FileSpreadsheet,
} from 'lucide-react';
import { PanelStack } from '@invana/ui';

const meta: Meta<typeof PanelStack> = {
  title: 'UI/UI Extended/PanelStack',
  component: PanelStack,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const PAGES = [
  ['stk_BPCL', 'stk_IOC', 'stk_HPCL', 'stk_ONGC', 'stk_GAIL'],
  ['stk_RELIANCE', 'stk_NTPC', 'stk_POWERGRID', 'stk_COALINDIA', 'stk_SBIN'],
  ['stk_INFY', 'stk_TCS', 'stk_WIPRO', 'stk_HCLTECH', 'stk_TECHM'],
];

/**
 * `actionsOnHover` defaults to `true` — the VS Code habit of a quiet header,
 * where the controls fade in under the pointer. Set it to `false` when the
 * actions *are* the panel: a pager you have to see to know there is a page 2,
 * or a run/pause control whose state is the status.
 *
 * **Results** below pins its actions; **Stream** keeps the default and stays
 * quiet until you hover it. The rule of thumb is the same one that sends
 * counts to `title` — anything a reader needs in order to understand what
 * they are looking at should not be hidden behind a hover.
 */
export const PinnedActions: Story = {
  render: () => <PinnedActionsDemo />,
};

const PinnedActionsDemo = () => {
  const [page, setPage] = useState(0);
  const [running, setRunning] = useState(true);

  return (
    <div className="h-[520px] w-[380px] overflow-hidden rounded-md border border-border bg-background">
      <PanelStack
        sections={[
          {
            id: 'results',
            title: 'Results',
            actionsOnHover: false,
            content: (
              <ul className="py-1">
                {PAGES[page].map((id) => (
                  <li
                    key={id}
                    className="truncate px-2 py-1 font-mono text-foreground hover:bg-accent/50"
                  >
                    {id}
                  </li>
                ))}
              </ul>
            ),
            headerActions: [
              {
                name: 'Previous page',
                icon: ChevronLeft,
                onClick: () => setPage((p) => Math.max(0, p - 1)),
              },
              {
                name: `Page ${page + 1} of ${PAGES.length}`,
                label: `${page + 1}/${PAGES.length}`,
                className: 'text-meta tabular-nums',
              },
              {
                name: 'Next page',
                icon: ChevronRight,
                onClick: () =>
                  setPage((p) => Math.min(PAGES.length - 1, p + 1)),
              },
              {
                name: 'Export',
                icon: Download,
                menuItems: [
                  { id: 'json', label: 'Export as JSON', icon: FileJson },
                  { id: 'csv', label: 'Export as CSV', icon: FileSpreadsheet },
                ],
              },
            ],
          },
          {
            id: 'stream',
            title: 'Stream',
            actionsOnHover: false,
            content: (
              <ul className="py-1 font-mono text-meta">
                {[
                  '12:04:11  tick  BPCL   328.40  +0.6%',
                  '12:04:09  tick  IOC    141.15  −0.2%',
                  '12:04:08  tick  ONGC   256.90  +1.1%',
                  '12:04:04  tick  GAIL   188.05  +0.3%',
                  '12:04:01  tick  HPCL   402.75  −0.9%',
                ].map((line) => (
                  <li
                    key={line}
                    className="truncate px-2 py-0.5 text-muted-foreground"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            ),
            headerActions: [
              {
                name: running ? 'Pause stream' : 'Resume stream',
                icon: running ? Pause : Play,
                onClick: () => setRunning((v) => !v),
              },
            ],
          },
          {
            id: 'schema',
            title: 'Schema',
            // No `actionsOnHover` — the default hides these until you hover.
            content: (
              <ul className="py-1">
                {['id · string', 'symbol · string', 'close · float', 'ts · datetime'].map(
                  (row) => (
                    <li
                      key={row}
                      className="truncate px-2 py-1 font-mono text-meta text-muted-foreground"
                    >
                      {row}
                    </li>
                  )
                )}
              </ul>
            ),
            headerActions: [
              { name: 'Reload schema', icon: RefreshCw, onClick: () => {} },
              {
                name: 'More options',
                icon: MoreHorizontal,
                menuItems: [
                  { id: 'copy', label: 'Copy as JSON schema', icon: FileJson },
                ],
              },
            ],
          },
        ]}
      />
    </div>
  );
};
