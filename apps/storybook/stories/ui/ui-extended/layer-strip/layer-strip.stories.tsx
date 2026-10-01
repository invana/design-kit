import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Label, Switch } from '@invana/forms';
import {
  LayerStrip as Component,
  Legend,
  LegendItem,
  PanelBox,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  type Layer,
  type LayerBand,
  type LayerBracket,
  type LayerItem,
  type LayerPalette,
  type LayerStripProps,
  type LegendSwatchKind,
} from '@invana/ui';

import DATA from '../../../../fixtures/ui-extended/layer-strip.json';
import { ReplayFrame, useReplay } from '../../../_story/replay';
import { inline, jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Log, type Variant } from '../../../_story/variant-board';

/**
 * How these stories paint the layers — passed as `palette`, because the kit ships no hues of its
 * own. Four are the data-palette slots `BoundChip` leaves free; `llm` takes `data-7`, the slot the
 * `llm` **bound** has (same concept, same hue); `agent` is left out, so the spine falls through to
 * the neutral. `text` writes a participant's address in its layer's colour — `cache` is the slot
 * to watch for light-mode contrast.
 */
const PALETTE: LayerPalette = {
  graph_data: { swatch: 'bg-data-1', text: 'text-data-1' },
  llm: { swatch: 'bg-data-7', text: 'text-data-7' },
  third_party: { swatch: 'bg-data-8', text: 'text-data-8' },
  cache: { swatch: 'bg-data-3', text: 'text-data-3' },
  human: { swatch: 'bg-data-6', text: 'text-data-6' },
};

type StripProps = Pick<
  LayerStripProps,
  'scale' | 'domain' | 'seams' | 'selectedItem' | 'defaultCollapsed' | 'collapsible' | 'minTrackWidth'
> & { bands?: LayerBand[]; items?: LayerItem[]; brackets?: LayerBracket[] };

interface Run {
  bands: LayerBand[];
  items: LayerItem[];
  brackets?: LayerBracket[];
}

interface StripVariant extends Variant {
  /** A recorded run the variant draws, by name — its bands, items and brackets. */
  run?: keyof typeof DATA.runs;
  props: StripProps;
  /** `false` leaves the bars as marks, not buttons. */
  selectable?: boolean;
  /** Framed in a panel, as a run view frames it. */
  panel?: { title: string; aside: string };
  legend?: { kind: LegendSwatchKind; color?: string; label: string }[];
  /** A `Fit` switch on the panel, in a column you can resize. */
  fitToggle?: boolean;
  /** Replay the run's items arriving. */
  live?: boolean;
}

const RUNS = DATA.runs as unknown as Record<string, Run>;
const VARIANTS = DATA.variants as unknown as StripVariant[];

/** The variant's props with its run's data folded in. */
const resolved = (v: StripVariant): StripProps & Run =>
  ({ ...(v.run ? RUNS[v.run] : {}), ...v.props }) as StripProps & Run;

interface Args {
  variant: string;
  /** Milliseconds between items in the live cell. */
  every: number;
  onSelectItem: (itemId: string) => void;
  onCollapsedChange: (layers: Layer[]) => void;
  onFitChange: (fit: boolean) => void;
}

function code(v: StripVariant) {
  const p = resolved(v);
  const strip = jsx('LayerStrip', {
    palette: 'palette',
    bands: 'bands',
    items: v.live ? 'arrived' : 'items',
    brackets: p.brackets ? 'brackets' : undefined,
    seams: p.seams ? 'seams' : undefined,
    scale: p.scale ? { literal: p.scale } : undefined,
    domain: p.domain ? inline(p.domain) : undefined,
    defaultCollapsed: p.defaultCollapsed ? inline(p.defaultCollapsed) : undefined,
    collapsible: p.collapsible === false ? 'false' : undefined,
    minTrackWidth: p.minTrackWidth ? String(p.minTrackWidth) : undefined,
    fit: v.fitToggle ? 'fit' : undefined,
    selectedItem: v.selectable === false ? undefined : 'selected',
    onSelectItem: v.selectable === false ? undefined : 'onSelectItem',
    onCollapsedChange: p.defaultCollapsed ? 'onCollapsedChange' : undefined,
  });
  const setup = [
    v.selectable === false
      ? ''
      : `// onSelectItem receives the bar's id — "${p.selectedItem ?? p.items[0]!.id}".\nconst [selected, onSelectItem] = React.useState(${JSON.stringify(p.selectedItem ?? null)});`,
    p.defaultCollapsed ? '// Receives the layers now shut — ["human", "llm"].\nconst onCollapsedChange = (layers) => {};' : '',
    v.fitToggle ? 'const [fit, setFit] = React.useState(true);' : '',
    v.live ? '// Each event the run streams is one more item; the strip redraws from props.\nconst [arrived, setArrived] = React.useState([]);\nReact.useEffect(() => run.subscribe((item) => setArrived((all) => [...all, item])), []);' : '',
  ]
    .filter(Boolean)
    .join('\n');
  let call = strip;
  if (v.legend)
    call = [
      `<PanelBox title="${v.panel!.title}" aside="${v.panel!.aside}">`,
      strip.replace(/^/gm, '  '),
      '  <Legend>',
      ...v.legend.map((l) => `    ${jsx('LegendItem', Object.fromEntries(Object.entries(l).map(([k, x]) => [k, { literal: x }])))}`),
      '  </Legend>',
      '</PanelBox>',
    ].join('\n');
  else if (v.fitToggle)
    call = [
      '<ResizablePanelGroup orientation="horizontal">',
      '  <ResizablePanel defaultSize={45} minSize={20}>',
      `    <PanelBox title="${v.panel!.title}" flush aside={<>${v.panel!.aside} <Label htmlFor="fit">Fit</Label> <Switch id="fit" checked={fit} onCheckedChange={setFit} /></>}>`,
      strip.replace(/^/gm, '      '),
      '    </PanelBox>',
      '  </ResizablePanel>',
      '  <ResizableHandle withHandle />',
      '  <ResizablePanel defaultSize={55} minSize={10} />',
      '</ResizablePanelGroup>',
    ].join('\n');
  return {
    data: { palette: PALETTE, bands: p.bands, items: p.items, brackets: p.brackets, seams: p.seams },
    setup: setup || undefined,
    call,
  };
}

const meta = {
  title: 'UI/UI Extended/LayerStrip',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import { Label, Switch } from '@invana/forms';",
              "import { LayerStrip, Legend, LegendItem, PanelBox, ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@invana/ui';",
            ],
            picked.map((v) => ({ comment: v.caption, ...code(v) })),
          ),
        ),
      },
    },
  },
  // A strip is a whole row of work: draw one at a time unless asked for all.
  args: {
    variant: VARIANTS[0]!.caption,
    every: 500,
    onSelectItem: fn(),
    onCollapsedChange: fn(),
    onFitChange: fn(),
  },
  argTypes: {
    variant: variantArg(VARIANTS),
    every: { control: { type: 'range', min: 100, max: 2000, step: 100 } },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The strip with its selection held as a consumer holds it, and both callbacks logged. */
function Strip({ v, p, args, log, fit }: { v: StripVariant; p: StripProps & Run; args: Args; log: Log; fit?: boolean }) {
  const [selected, setSelected] = React.useState(p.selectedItem);
  const selectable = v.selectable !== false;
  return (
    <Component
      palette={PALETTE}
      {...p}
      fit={fit}
      selectedItem={selectable ? selected : undefined}
      onSelectItem={
        selectable
          ? (id) => {
              args.onSelectItem(id);
              log('onSelectItem', id);
              setSelected(id);
            }
          : undefined
      }
      onCollapsedChange={(layers) => {
        args.onCollapsedChange(layers);
        log('onCollapsedChange', layers);
      }}
    />
  );
}

function FitOrScroll({ v, args, log }: { v: StripVariant; args: Args; log: Log }) {
  const [fit, setFit] = React.useState(true);
  return (
    <ResizablePanelGroup orientation="horizontal">
      <ResizablePanel defaultSize={45} minSize={20}>
        <PanelBox
          title={v.panel!.title}
          flush
          aside={
            <>
              {v.panel!.aside}
              <Label htmlFor="layer-strip-fit">Fit</Label>
              <Switch
                id="layer-strip-fit"
                checked={fit}
                onCheckedChange={(next) => {
                  args.onFitChange(next);
                  log('onCheckedChange', next);
                  setFit(next);
                }}
              />
            </>
          }
        >
          <Strip v={v} p={resolved(v)} args={args} log={log} fit={fit} />
        </PanelBox>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={55} minSize={10} />
    </ResizablePanelGroup>
  );
}

function Live({ v, args, log }: { v: StripVariant; args: Args; log: Log }) {
  const run = resolved(v);
  const order = React.useMemo(() => [...run.items].sort((a, b) => a.start - b.start), [run.items]);
  const replay = useReplay(order.length, { every: args.every });
  const items = order.slice(0, replay.at);
  const reached = items.reduce((t, i) => Math.max(t, i.end ?? i.start), 0);
  const brackets = (run.brackets ?? []).filter((b) => b.end <= reached);
  return (
    <ReplayFrame replay={replay} noun="item" width={1200}>
      <Strip v={v} p={{ ...run, items, brackets }} args={args} log={log} />
    </ReplayFrame>
  );
}

function Cell({ v, args, log }: { v: StripVariant; args: Args; log: Log }) {
  if (v.live) return <Live v={v} args={args} log={log} />;
  if (v.fitToggle) return <FitOrScroll v={v} args={args} log={log} />;
  const strip = <Strip v={v} p={resolved(v)} args={args} log={log} />;
  if (!v.panel) return strip;
  return (
    <PanelBox title={v.panel.title} aside={v.panel.aside}>
      {strip}
      {v.legend ? (
        <Legend>
          {v.legend.map((l) => (
            <LegendItem key={l.label} {...l} />
          ))}
        </Legend>
      ) : null}
    </PanelBox>
  );
}

/**
 * The layers a plan or a run touches, on one time axis — from `fixtures/ui-extended/layer-strip.json`.
 * Heavy, so one variant draws at a time; pick another from `variant`, or `All`.
 *
 * - **Declared** — a plan in the six layers it will touch. Time is the x axis and a task is a bar
 *   on it; a plan's time is its order (`seq`). A band opens into its participants, and a layer
 *   nothing declares stays drawn, dark: *never reaches for a cache* is not *does not show caches*.
 * - **Touched** — the same drawing on the wall clock (`elapsed`). Refusals are struck in place,
 *   never filtered out; `skipped` is a third state — never asking a person is not being refused one.
 * - **Collapsed** — every band shut: six lines, each task still placed in time. Folding moves a task
 *   up onto its band's line, never drops it; the hover card names the participant folding hid.
 * - **Gated** — a gate is a seam, never a row: it stops every layer at once. Its label hangs off
 *   the side the cost falls on; a gate that is not on the plan is dashed.
 * - **Run execution** — `escalate-late-orders@7` took 9m 09s to send one email: three bracketed
 *   rounds of `ask · clarify · read`, and a struck fourth ask naming `max_rounds 3`.
 * - **Where the time went** — that run folded: `human` is three long bars filling the middle, the
 *   rest are marks; the brackets survive the fold.
 * - **Unattended** — the same plan at 3am under `may_ask: false`: 47s, the clarification refused
 *   before dispatch, two declared rows muted because the run never got that far.
 * - **Forecast against actual** — the plan's p50 on the run's own axis; the approval gate has no
 *   estimate and says so rather than drawing a guess.
 * - **Fit or scroll** — `fit` on, the whole axis fits a column you can resize; off, the minimum
 *   widths hold and the strip scrolls.
 * - **Live** — the run's items arriving one by one on a fixed axis, brackets closing as rounds end.
 *
 * Click a bar: `onSelectItem` names it and the selection moves. Shut or open a band:
 * `onCollapsedChange` hands back the layers now shut.
 */
export const LayerStrip: Story = {
  render: (args) => (
    <VariantBoard variants={VARIANTS} variant={args.variant}>
      {(v, log) => <Cell v={v} args={args} log={log} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: VARIANTS[0]!.caption }));
    await step('Select a bar', async () => {
      await userEvent.click(cell.getByRole('button', { name: /^rank_late/ }));
      await expect(args.onSelectItem).toHaveBeenCalledWith('rank_late');
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"rank_late"');
    });
    await step('Shut a band', async () => {
      await userEvent.click(cell.getByRole('button', { name: /^Hide the 2 participants under llm/ }));
      await expect(args.onCollapsedChange).toHaveBeenCalledWith(['llm']);
    });
  },
};
