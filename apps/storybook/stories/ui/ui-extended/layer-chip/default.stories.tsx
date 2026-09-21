import type { Meta, StoryObj } from '@storybook/react-vite';
import { LayerChip, type Layer, type LayerPalette } from '@invana/ui';

const meta: Meta<typeof LayerChip> = {
  title: 'UI/UI Extended/LayerChip',
  component: LayerChip,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The hues are the caller's. `LayerChip` ships none — it takes a `palette` and
 * paints what it is given, so this story is also the demonstration of how a
 * surface supplies one. `agent` is left out deliberately and falls through to
 * the neutral.
 */
const PALETTE: LayerPalette = {
  graph_data: { swatch: 'bg-data-1' },
  llm: { swatch: 'bg-data-7' },
  third_party: { swatch: 'bg-data-8' },
  cache: { swatch: 'bg-data-3' },
  human: { swatch: 'bg-data-6' },
};

const LAYERS: { layer: Layer; note: string; count?: number }[] = [
  { layer: 'graph_data', note: 'models, stitches and datasets', count: 16 },
  { layer: 'llm', note: 'a model on a configured provider row', count: 1 },
  { layer: 'third_party', note: 'nothing configured — not the same as denied', count: 0 },
  { layer: 'cache', note: 'answer · prefix · result', count: 3 },
  { layer: 'human', note: 'who may be asked', count: 3 },
  { layer: 'agent', note: 'the spine — never governed' },
];

/**
 * Six layers, one hue each — and the hues come from the caller's `palette`,
 * never from the chip. Colour follows the layer, never its position in a list.
 *
 * The palette above takes the data-palette slots `BoundChip` leaves free, so a
 * layer and a bound never share a hue where they sit in one row. Two entries
 * are deliberate: `llm` takes the slot `BoundChip` gives the **llm bound**,
 * because two hues for one idea is the confusion worth avoiding; and `agent`
 * is simply absent, so it draws in the neutral — the spine is never governed
 * and must not read as a bound somebody could set.
 *
 * The **name is always there** — six hues cannot be told apart reliably, and a
 * colour-blind reader gets nothing from any of them.
 *
 * `count={0}` is printed rather than hidden: *nothing is configured* and
 * *nothing matched* are different answers, and the third-party row is where a
 * reader most needs to tell them apart. `dim` is the last row — the layer is
 * out of view for this lens, which is *not in play*, never *not there*.
 */
export const Default: Story = {
  render: () => (
    <div className="flex w-[380px] flex-col gap-2">
      {LAYERS.map(({ layer, note, count }) => (
        <div key={layer} className="flex items-center gap-3">
          <LayerChip
            layer={layer}
            count={count}
            palette={PALETTE}
            className="w-[120px]"
          />
          <span className="text-sm text-muted-foreground">{note}</span>
        </div>
      ))}
      <div className="mt-2 flex items-center gap-3 border-t border-border pt-2">
        <LayerChip
          layer="third_party"
          dim
          palette={PALETTE}
          className="w-[120px]"
        />
        <span className="text-sm text-muted-foreground">
          dim — closed by this lens
        </span>
      </div>
    </div>
  ),
};
