import type { Meta, StoryObj } from '@storybook/react-vite';
import { LensRow, type LayerPalette, type Narrowing } from '@invana/ui';

const meta: Meta<typeof LensRow> = {
  title: 'UI/UI Extended/LensRow',
  component: LensRow,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** The hues are the caller's — these components ship none. */
const PALETTE: LayerPalette = {
  graph_data: { swatch: 'bg-data-1' },
  llm: { swatch: 'bg-data-7' },
  third_party: { swatch: 'bg-data-8' },
  cache: { swatch: 'bg-data-3' },
  human: { swatch: 'bg-data-6' },
};


const EU: Narrowing[] = [
  { kind: 'allow', count: 4 },
  { kind: 'sliced' },
  { kind: 'closes', layers: ['graph_data'] },
];

const PRICE_BLIND: Narrowing[] = [
  { kind: 'allow', count: 1 },
  { kind: 'excludes', properties: ['contract_value', 'revenue'] },
];

const NOTHING_LEAVES: Narrowing[] = [
  { kind: 'allow', count: 1 },
  { kind: 'deny', count: 1 },
  { kind: 'closes', layers: ['llm'] },
  { kind: 'casts', roles: ['decide', 'judge'] },
];

/**
 * The Worlds drawer: four worlds, compared by what each narrows.
 *
 * **What it narrows is chips, not prose.** A world is picked by comparing it
 * with the ones above it, and four sentences do not compare — six fixed kinds
 * of narrowing do. `closes` renders its layers as `LayerChip`s because *which*
 * layer is closed is the part being compared.
 *
 * **A world that narrows nothing says so in words.** `Everything` is a real
 * world and the default one, still inside the guardrails. A blank row would
 * read as a summary that failed to load — the opposite of the reassurance it
 * is there to give.
 *
 * **Usage never sorts the list.** `used in 34 runs · last 2h ago` tells a
 * reader whether they are about to edit something live. A world used once may
 * be the one that matters, and a list that reorders itself under you cannot be
 * scanned twice.
 */
export const Default: Story = {
  render: () => (
    <div className="flex w-[520px] flex-col">
      <LensRow
        palette={PALETTE}
        name="Everything"
        usage={{ runs: 128, lastUsed: '2h ago' }}
        onSelect={() => {}}
      />
      <LensRow
        palette={PALETTE}
        name="EU · H1 2026"
        narrows={EU}
        usage={{ runs: 34, lastUsed: '2h ago' }}
        selected
        onSelect={() => {}}
      />
      <LensRow
        palette={PALETTE}
        name="Price-blind"
        narrows={PRICE_BLIND}
        usage={{ runs: 7, lastUsed: '6d ago' }}
        onSelect={() => {}}
      />
      <LensRow
        palette={PALETTE}
        name="Nothing leaves"
        narrows={NOTHING_LEAVES}
        usage={{ runs: 0 }}
        onSelect={() => {}}
      />
    </div>
  ),
};
