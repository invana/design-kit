import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { PanelContent, ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@invana/ui';

import data from '../../../../fixtures/ui/resizable.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../../_story/variant-grid';

interface PaneSpec {
  id: string;
  size: number;
  min: number;
  title?: string;
  body?: string;
  group?: GroupSpec;
}

interface GroupSpec {
  orientation: 'horizontal' | 'vertical';
  handle: boolean;
  panels: PaneSpec[];
}

interface ResizableVariant extends Variant {
  /** The group's height in px — a panel group fills its parent, so the story gives it one. */
  height: number;
  /** Draw with `react-resizable-panels` itself, unthemed — the check that the library works. */
  direct?: boolean;
  group: GroupSpec;
}

const VARIANTS = data as ResizableVariant[];

type Layout = Record<string, number>;

interface Args {
  variant: string;
  onLayoutChanged: (layout: Layout) => void;
}

/** The JSX a consumer writes for a group, indented by `pad`. */
function groupSource(g: GroupSpec, pad: string, height?: number, direct?: boolean): string {
  const [G, P, H] = direct ? ['Group', 'Panel', 'Separator'] : ['ResizablePanelGroup', 'ResizablePanel', 'ResizableHandle'];
  const attrs = [`orientation="${g.orientation}"`];
  if (height) attrs.push(`style={{ height: ${height} }}`, 'onLayoutChanged={onLayoutChanged}');
  const lines = [`${pad}<${G} ${attrs.join(' ')}>`];
  g.panels.forEach((p, i) => {
    if (i > 0) lines.push(`${pad}  <${H}${direct ? ' style={{ width: 4 }}' : g.handle ? ' withHandle' : ''} />`);
    lines.push(`${pad}  <${P} id="${p.id}" defaultSize={${p.size}} minSize={${p.min}}>`);
    lines.push(
      p.group
        ? groupSource(p.group, `${pad}    `, undefined, direct)
        : `${pad}    <PanelContent title="${p.title}">${p.body ?? ''}</PanelContent>`,
    );
    lines.push(`${pad}  </${P}>`);
  });
  lines.push(`${pad}</${G}>`);
  return lines.join('\n');
}

const meta = {
  title: 'UI/UI/Resizable',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import { PanelContent, ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@invana/ui';",
              ...(picked.some((v) => v.direct) ? ["import { Group, Panel, Separator } from 'react-resizable-panels';"] : []),
            ],
            picked.map((v) => ({
              comment: v.caption,
              setup: '// Called once a drag ends, with each panel\'s share by id: { "left": 62, "right": 38 }.\nconst onLayoutChanged = (layout) => saveLayout(layout);',
              call: groupSource(v.group, '', v.height, v.direct),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onLayoutChanged: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Rounds a layout to whole percentages, so the log reads as a person would write it. */
const rounded = (layout: Layout) => Object.fromEntries(Object.entries(layout).map(([k, n]) => [k, Math.round(n)]));

/** The library's separator has no size of its own; the unthemed check gives it 4px to grab. */
const UNTHEMED_SEPARATOR = { width: 4, cursor: 'col-resize' };

function Pane({ p, direct, onLayoutChanged }: { p: PaneSpec; direct?: boolean; onLayoutChanged: (l: Layout) => void }) {
  const P = direct ? Panel : ResizablePanel;
  return (
    <P id={p.id} defaultSize={p.size} minSize={p.min}>
      {p.group ? (
        <Groups g={p.group} direct={direct} onLayoutChanged={onLayoutChanged} />
      ) : (
        <PanelContent title={p.title}>{p.body}</PanelContent>
      )}
    </P>
  );
}

function Groups({
  g,
  direct,
  height,
  onLayoutChanged,
}: {
  g: GroupSpec;
  direct?: boolean;
  height?: number;
  onLayoutChanged: (l: Layout) => void;
}) {
  const G = direct ? Group : ResizablePanelGroup;
  return (
    <G orientation={g.orientation} style={height ? { height } : undefined} onLayoutChanged={onLayoutChanged}>
      {g.panels.map((p, i) => (
        <React.Fragment key={p.id}>
          {i > 0 ? direct ? <Separator style={UNTHEMED_SEPARATOR} /> : <ResizableHandle withHandle={g.handle} /> : null}
          <Pane p={p} direct={direct} onLayoutChanged={onLayoutChanged} />
        </React.Fragment>
      ))}
    </G>
  );
}

function LiveResizable({ v, onLayoutChanged, log }: { v: ResizableVariant; onLayoutChanged: Args['onLayoutChanged']; log: Log }) {
  const changed = (layout: Layout) => {
    const r = rounded(layout);
    onLayoutChanged(r);
    log('onLayoutChanged', r);
  };
  return <Groups g={v.group} direct={v.direct} height={v.height} onLayoutChanged={changed} />;
}

/**
 * Panels split by draggable handles, from `fixtures/ui/resizable.json`. Drag a handle or focus
 * it and press an arrow key: `onLayoutChanged` receives each panel's share by id. Direct
 * import draws `react-resizable-panels` unthemed, as a check that the library itself works.
 */
export const Resizable: Story = {
  render: ({ variant, onLayoutChanged }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveResizable v={v} onLayoutChanged={onLayoutChanged} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Simple horizontal' }));
    await step('Move the handle right with the keyboard', async () => {
      cell.getByRole('separator').focus();
      await userEvent.keyboard('{ArrowRight}');
    });
    await step('The layout is reported, the left panel larger', async () => {
      await waitFor(() => expect(args.onLayoutChanged).toHaveBeenCalled());
      const layout = (args.onLayoutChanged as ReturnType<typeof fn>).mock.lastCall?.[0] as Layout;
      await expect(layout.left).toBeGreaterThan(50);
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"left"');
    });
  },
};
