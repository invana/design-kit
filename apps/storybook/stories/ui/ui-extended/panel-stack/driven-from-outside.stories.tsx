import type { Meta, StoryObj } from '@storybook/react-vite';
import { BookMarked, ListChecks, Workflow } from 'lucide-react';
import { PanelStack, type PanelStackHandle } from '@invana/ui';
import * as React from 'react';

const meta: Meta<typeof PanelStack> = {
  title: 'UI/UI Extended/PanelStack',
  component: PanelStack,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const RUNS = [
  'orders.csv → Brokerage.Order · 1,204 written · 2m',
  'nse-quotes-2026-09-15.csv · connection refused',
  'supplier → company · 6 rules · committed',
];

const PLANS = ['nightly-load · import · v4', 'supplier-sweep · enrich · v2'];

const ENTRIES = ['import_dataset · writes', 'execute_query · reads'];

/**
 * A stack's collapsed state is **reported, not dictated**. `onCollapsedChange`
 * fires whenever a section opens or closes — from a header click *or* from a
 * drag past `minSize` — and `stackRef` is how something outside the stack asks
 * for a section to open.
 *
 * There is deliberately no `collapsed` prop. The resizable group owns the
 * geometry: a drag collapses a section and releasing it opens one again, so a
 * controlled map would be a second owner fighting every drag, re-asserting a
 * stale value the moment the user let go. The stack stays the owner, says what
 * happened, and takes instructions.
 *
 * This is what a routed drawer needs. Picking a run below is a stand-in for a
 * URL change: the handler calls `expand('runs')`, and the section opens whether
 * the reader had collapsed it or not — so a drill-in is never rendered into a
 * closed drawer. Collapse all three and press a button to see `expand` find
 * room even with no expanded sibling to take it from.
 */
export const DrivenFromOutside: Story = {
  render: () => {
    const stack = React.useRef<PanelStackHandle>(null);
    const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>(
      {},
    );
    const [open, setOpen] = React.useState<string | null>(null);

    // Stands in for a route: something outside the stack decided which drawer
    // the reader is looking at, so that drawer opens.
    const drillInto = (id: string, label: string) => {
      setOpen(label);
      stack.current?.expand(id);
    };

    const shut = Object.entries(collapsed)
      .filter(([, v]) => v)
      .map(([k]) => k);

    return (
      <div className="flex w-[380px] flex-col gap-2">
        <div className="flex flex-wrap gap-1">
          {[
            ['runs', 'Runs'],
            ['plans', 'Plans'],
            ['catalogue', 'Catalogue'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => drillInto(id, `a ${label.toLowerCase()} row`)}
              className="rounded border border-border px-2 py-1 text-sm hover:bg-accent/50"
            >
              Open {label}
            </button>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          {shut.length ? `collapsed: ${shut.join(' · ')}` : 'all sections open'}
          {open ? ` — drilled into ${open}` : ''}
        </p>

        <div className="h-[420px] overflow-hidden rounded-md border border-border bg-background">
          <PanelStack
            withHandle
            stackRef={stack}
            onCollapsedChange={setCollapsed}
            headerHeight={30}
            sections={[
              {
                id: 'runs',
                title: 'Runs',
                icon: ListChecks,
                content: <Rows rows={RUNS} />,
              },
              {
                id: 'plans',
                title: 'Plans',
                icon: Workflow,
                defaultCollapsed: true,
                content: <Rows rows={PLANS} />,
              },
              {
                id: 'catalogue',
                title: 'Catalogue',
                icon: BookMarked,
                defaultCollapsed: true,
                content: <Rows rows={ENTRIES} />,
              },
            ]}
          />
        </div>
      </div>
    );
  },
};

function Rows({ rows }: { rows: string[] }) {
  return (
    <ul className="py-1">
      {rows.map((row) => (
        <li
          key={row}
          className="truncate px-2 py-1 text-sm text-muted-foreground hover:bg-accent/50"
        >
          {row}
        </li>
      ))}
    </ul>
  );
}
