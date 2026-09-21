import type { Meta, StoryObj } from '@storybook/react-vite';
import { LayerStrip, type LayerBand, type LayerItem } from '@invana/ui';

const meta: Meta<typeof LayerStrip> = {
  title: 'UI/UI Extended/LayerStrip',
  component: LayerStrip,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** `nightly-load@4` — the nightly bundle, with its own triage. */
const BANDS: LayerBand[] = [
  {
    layer: 'human',
    note: '1 · on a failed check',
    parts: [{ id: 'triage', label: 'human/form/triage', note: 'a person decides' }],
  },
  { layer: 'agent' },
  {
    layer: 'cache',
    note: '1',
    parts: [{ id: 'manifest', label: 'cache/manifest/*' }],
  },
  {
    layer: 'llm',
    note: '2 roles',
    parts: [
      { id: 'decide', label: 'role: decide' },
      { id: 'extract', label: 'role: extract', note: 'reads the rejects' },
    ],
  },
  {
    layer: 'graph_data',
    note: '4 models',
    parts: [
      { id: 'orders', label: 'model/Orders@v2' },
      { id: 'lines', label: 'model/OrderLines@v2' },
      { id: 'suppliers', label: 'model/Suppliers@v1' },
      { id: 'stitch', label: 'stitch/order_supplier@placed' },
    ],
  },
  { layer: 'third_party', note: 'nothing declared' },
];

const ITEMS: LayerItem[] = [
  { id: 'read_manifest', label: 'read_manifest', layer: 'cache', part: 'manifest', start: 1, end: 2 },
  { id: 'load_orders', label: 'load_orders', layer: 'graph_data', part: 'orders', start: 2, end: 3 },
  { id: 'load_lines', label: 'load_lines', layer: 'graph_data', part: 'lines', start: 3, end: 4 },
  { id: 'load_suppliers', label: 'load_suppliers', layer: 'graph_data', part: 'suppliers', start: 4, end: 5 },
  { id: 'stitch_placed', label: 'stitch_placed', layer: 'graph_data', part: 'stitch', start: 5, end: 6 },
  { id: 'check_counts', label: 'check_counts', layer: 'llm', part: 'decide', start: 6, end: 7 },
  { id: 'read_rejects', label: 'read_rejects', layer: 'llm', part: 'extract', start: 7, end: 8 },
  { id: 'triage', label: 'triage', layer: 'human', part: 'triage', start: 8, end: 9, note: 'only on a failed check' },
];

/**
 * Every band shut — the overview, and the reason the disclosures exist.
 *
 * A plan with twelve participants is twelve rows before it is a picture. Shut,
 * it is **six lines and eight tasks**, each still placed in time: `graph data`
 * is busy for four consecutive steps, `llm` for two, a person is the last thing
 * asked. Nothing is hidden by folding — a task moves up onto its band's line,
 * it never drops out — so the count in each band's note and the bars on its
 * line always agree.
 *
 * Open one band (its chevron) to see **which** participant each of its tasks
 * spends; `collapse all` in the header does the whole strip. A band with no
 * participants has no chevron: it is already its own overview.
 */
export const Collapsed: Story = {
  render: () => (
    <div className="w-[980px]">
      <LayerStrip
        bands={BANDS}
        items={ITEMS}
        scale="seq"
        defaultCollapsed={['graph_data', 'llm', 'cache', 'human']}
        onSelectItem={() => {}}
      />
    </div>
  ),
};
