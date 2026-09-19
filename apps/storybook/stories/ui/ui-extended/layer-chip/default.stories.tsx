import type { Meta, StoryObj } from '@storybook/react-vite';
import { LayerChip, type Layer } from '@invana/ui';

const meta: Meta<typeof LayerChip> = {
  title: 'UI/UI Extended/LayerChip',
  component: LayerChip,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const LAYERS: { layer: Layer; note: string; count?: number }[] = [
  { layer: 'graph_data', note: 'models, stitches and datasets', count: 16 },
  { layer: 'llm', note: 'a model on a configured provider row', count: 1 },
  { layer: 'third_party', note: 'nothing configured — not the same as denied', count: 0 },
  { layer: 'cache', note: 'answer · prefix · result', count: 3 },
  { layer: 'human', note: 'who may be asked', count: 3 },
  { layer: 'agent', note: 'the spine — never governed' },
];

/**
 * Six layers, one hue each, fixed — colour follows the layer, never its
 * position in a list.
 *
 * Four take the data-palette slots `BoundChip` left free, so a layer and a
 * bound never share a hue where they sit in one row. Two are deliberate:
 * `llm` takes the slot `BoundChip` gives the **llm bound**, because two hues
 * for one idea is the confusion worth avoiding; and `agent` is muted, because
 * the spine is never governed and must not read as a bound somebody could set.
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
          <LayerChip layer={layer} count={count} className="w-[120px]" />
          <span className="text-meta text-muted-foreground">{note}</span>
        </div>
      ))}
      <div className="mt-2 flex items-center gap-3 border-t border-border pt-2">
        <LayerChip layer="third_party" dim className="w-[120px]" />
        <span className="text-meta text-muted-foreground">
          dim — closed by this lens
        </span>
      </div>
    </div>
  ),
};
