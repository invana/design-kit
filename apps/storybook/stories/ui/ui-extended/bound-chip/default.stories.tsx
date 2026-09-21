import type { Meta, StoryObj } from '@storybook/react-vite';
import { BoundChip, type Bound, type BoundPalette } from '@invana/ui';

const meta: Meta<typeof BoundChip> = {
  title: 'UI/UI Extended/BoundChip',
  component: BoundChip,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The hues are the caller's — `BoundChip` ships none and draws what it is
 * given, so this story is also the demonstration of how a surface supplies a
 * palette.
 *
 * Five spend the status tokens because those already mean the right thing. The
 * other four take data-palette slots, chosen for being distinguishable from
 * each other rather than for meaning anything — which is exactly why the
 * component must not be the one choosing them. `none` is left out and falls
 * through to the neutral: *nothing to set here*.
 */
const PALETTE: BoundPalette = {
  network: 'bg-warning',
  graph_read: 'bg-success',
  graph_write: 'bg-data-2',
  schema_write: 'bg-data-4',
  ingest: 'bg-info',
  llm: 'bg-data-7',
  plan_write: 'bg-data-5',
  work_write: 'bg-destructive',
};

const BOUNDS: Bound[] = [
  'none',
  'network',
  'graph_read',
  'graph_write',
  'schema_write',
  'ingest',
  'llm',
  'plan_write',
  'work_write',
];

/**
 * Nine bounds, one hue each — and the hues come from the caller's `palette`,
 * never from the chip. Colour follows the bound, never its position in a list.
 *
 * The **name is always there**. Nine hues cannot be told apart reliably, some
 * pairs sit close, and a colour-blind reader gets nothing from any of them: the
 * swatch speeds up scanning a list you can already read, and carries nothing on
 * its own.
 *
 * Not a `Badge` — a badge carries state and takes a tone from the status
 * palette. A bound is a fixed property of a callable and must not read as "this
 * went well" because it happens to be green.
 */
export const Default: Story = {
  render: () => (
    <div className="flex w-[280px] flex-col gap-2">
      {BOUNDS.map((bound) => (
        <div key={bound} className="flex items-center gap-3">
          <BoundChip bound={bound} palette={PALETTE} className="w-[104px]" />
          <span className="text-sm text-muted-foreground">
            {bound === 'none' ? 'emit_table · read_artefact' : `what ${bound} spends`}
          </span>
        </div>
      ))}
    </div>
  ),
};
