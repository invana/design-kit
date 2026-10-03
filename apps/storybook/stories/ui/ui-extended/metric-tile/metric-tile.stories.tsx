import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  Card,
  CardContent,
  MetricGrid,
  MetricTile as Component,
  type MetricGridProps,
  type MetricTileProps,
} from '@invana/ui';

import DATA from '../../../../fixtures/ui-extended/metric-tile.json';
import { ReplayFrame, useReplay } from '../../../_story/replay';
import { inline, jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Variant } from '../../../_story/variant-grid';

type Tile = Pick<MetricTileProps, 'variant' | 'tone' | 'captionTone' | 'meter'> & {
  label: string;
  value: string;
  caption?: string;
};

interface TileVariant extends Variant {
  /** Inside a `MetricGrid` with these props; absent draws the tile alone. */
  grid?: Pick<MetricGridProps, 'joined' | 'seamless' | 'columns' | 'minTileWidth'>;
  /** Inside a card, where `seamless` lets the card be the frame. */
  card?: boolean;
  tiles?: Tile[];
  /** Fed by the replay instead. */
  live?: boolean;
}

const VARIANTS = DATA.variants as TileVariant[];
const FEED = DATA.feed;

const attrs = (props: object) =>
  Object.fromEntries(Object.entries(props).map(([k, v]) => [k, typeof v === 'string' ? { literal: v } : inline(v)]));

/** `38100` → `38.1k` — the value as the tile prints it. */
const tokens = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

/** The tile the feed draws after `used` tokens: its meter fills, and it warns near the ceiling. */
function liveTile(used: number): Tile {
  const meter = used / FEED.ceiling;
  return {
    label: FEED.label,
    value: tokens(used),
    caption: FEED.caption,
    meter,
    tone: meter >= FEED.warnAt ? 'warning' : undefined,
  };
}

function code(v: TileVariant) {
  if (v.live)
    return {
      data: { ceiling: FEED.ceiling },
      setup: [
        '// Each usage event carries the run\'s running total; the tile redraws from props.',
        'const [used, setUsed] = React.useState(0);',
        'React.useEffect(() => run.subscribe((e) => setUsed(e.tokens)), []);',
        'const meter = used / ceiling;',
      ].join('\n'),
      call: [
        '<MetricGrid>',
        '  <MetricTile',
        `    label="${FEED.label}"`,
        '    value={`${(used / 1000).toFixed(1)}k`}',
        `    caption="${FEED.caption}"`,
        '    meter={meter}',
        `    tone={meter >= ${FEED.warnAt} ? "warning" : undefined}`,
        '  />',
        '</MetricGrid>',
      ].join('\n'),
    };
  const tiles = (v.tiles ?? []).map((t) => jsx('MetricTile', attrs(t)));
  if (!v.grid) return { call: tiles.join('\n') };
  const grid = [
    `${jsx('MetricGrid', attrs(v.grid)).replace(/ ?\/>$/, '>').replace(/<MetricGrid >$/, '<MetricGrid>')}`,
    ...tiles.map((t) => t.replace(/^/gm, '  ')),
    '</MetricGrid>',
  ].join('\n');
  return {
    call: v.card ? ['<Card>', '  <CardContent>', grid.replace(/^/gm, '    '), '  </CardContent>', '</Card>'].join('\n') : grid,
  };
}

interface Args {
  variant: string;
  /** Milliseconds between usage events in the live cell. */
  every: number;
}

const meta = {
  title: 'UI/UI Extended/MetricTile',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { Card, CardContent, MetricGrid, MetricTile } from '@invana/ui';"],
            picked.map((v) => ({ comment: v.caption, ...code(v) })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', every: 500 },
  argTypes: {
    variant: variantArg(VARIANTS),
    every: { control: { type: 'range', min: 100, max: 2000, step: 100 } },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

function Tiles({ v }: { v: TileVariant }) {
  const tiles = (v.tiles ?? []).map((t) => <Component key={t.label} {...t} />);
  if (!v.grid) return tiles;
  const grid = <MetricGrid {...v.grid}>{tiles}</MetricGrid>;
  return v.card ? (
    <Card>
      <CardContent>{grid}</CardContent>
    </Card>
  ) : (
    grid
  );
}

function Live({ every }: { every: number }) {
  const replay = useReplay(FEED.tokens.length, { every });
  const used = FEED.tokens[replay.at - 1] ?? 0;
  return (
    <ReplayFrame replay={replay} noun="usage event" width={520}>
      <MetricGrid>
        <Component {...liveTile(used)} />
      </MetricGrid>
    </ReplayFrame>
  );
}

/**
 * A number with the words that make it mean something. The caption is not decoration — it
 * supplies the denominator the number needs.
 *
 * `figure` is a band of figures inside an answer, boxed like a tile and set like a small hero;
 * `hero` is the one figure an answer turns on, set large with no box. `joined` makes one strip,
 * the tiles divided by rules, and `captionTone` inks the change under a figure rather than the
 * figure. `joined seamless` inside a card draws no box, only the rules between tiles.
 *
 * `meter` is only for a value with a **real ceiling** — a token limit, a lane pool, a task count.
 * `Elapsed` and `Rows` have none, so they get no bar: a sliver under `12s` would invent a deadline.
 * `tone` is for a number whose *state* is the thing being read — two of six here, deliberately.
 * The live cell feeds a run's token total in: the meter fills, and the value warns near the
 * ceiling.
 */
export const MetricTile: Story = {
  render: ({ variant, every }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v) => (v.live ? <Live every={every} /> : <Tiles v={v} />)}
    </VariantGrid>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Every static variant draws its figures', async () => {
      for (const v of VARIANTS.filter((x) => !x.live)) {
        const cell = within(canvas.getByRole('group', { name: v.caption }));
        for (const t of v.tiles ?? []) await expect(cell.getByText(t.value)).toBeInTheDocument();
      }
    });
    await step('The live tile climbs to the last total', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Live — tokens against a ceiling' }));
      await waitFor(() => expect(cell.getByRole('status')).not.toHaveTextContent(/^0 \//), { timeout: 3000 });
      await userEvent.click(cell.getByRole('button', { name: 'Skip to end' }));
      await expect(cell.getByText(tokens(FEED.tokens.at(-1)!))).toBeInTheDocument();
    });
  },
};
