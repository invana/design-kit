import type { Meta, StoryObj } from '@storybook/react-vite';
import { LayerStrip, type LayerBand, type LayerItem } from '@invana/ui';

import { LAYER_PALETTE } from './_run';

const meta: Meta<typeof LayerStrip> = {
  title: 'UI/UI Extended/LayerStrip',
  component: LayerStrip,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** `escalate-core@2` — chase a late order and hand it on. */
const BANDS: LayerBand[] = [
  { layer: 'human', note: 'declared · 1' },
  { layer: 'agent', spine: true },
  { layer: 'cache', note: 'nothing declared' },
  {
    layer: 'llm',
    note: '2 roles',
    parts: [
      { id: 'decide', label: 'role: decide', note: 'a caller may re-cast it' },
      { id: 'extract', label: 'role: extract' },
    ],
  },
  {
    layer: 'graph_data',
    note: '1 model',
    parts: [
      {
        id: 'orders',
        label: 'model/Orders@v2',
        note: 'caller supplies the slice',
      },
    ],
  },
  {
    layer: 'third_party',
    note: '1 · a boundary crossing',
    parts: [
      {
        id: 'email',
        label: 'third_party/app/email',
        note: 'egress: the note',
      },
    ],
  },
];

const ITEMS: LayerItem[] = [
  {
    id: 'fetch_orders',
    label: 'fetch_orders',
    layer: 'graph_data',
    part: 'orders',
    start: 1,
    end: 2,
    note: '${supplier_id}',
  },
  {
    id: 'rank_late',
    label: 'rank_late',
    layer: 'llm',
    part: 'decide',
    start: 2,
    end: 3,
    note: 'decide',
  },
  {
    id: 'draft_note',
    label: 'draft_note',
    layer: 'llm',
    part: 'extract',
    start: 3,
    end: 4,
    note: 'extract',
  },
  {
    id: 'send',
    label: 'send',
    layer: 'third_party',
    part: 'email',
    start: 4,
    end: 5,
  },
  {
    id: 'await_reply',
    label: 'await_reply',
    layer: 'human',
    start: 5,
    end: 6,
    note: 'form: human',
  },
];

/**
 * A plan in the six layers it will touch — the **declared** tense.
 *
 * **Time is the x axis, and a task is a bar on it.** A plan's time is its order,
 * so the axis counts steps; a run's is the wall clock, and the same drawing is
 * read in `elapsed` (see *Touched*). Task names were an axis once and are not:
 * a name written along the top cannot say how long anything takes, and it
 * forces one column per task whether or not the task engages anything.
 *
 * **A band opens into its participants.** `llm` is the band; `role: decide` and
 * `role: extract` are the rows under it, and `rank_late` sits on the role it
 * actually spends. `model/Orders@v2` and `third_party/app/email` are the same
 * move on their own bands — that list is what a world is checked against, and a
 * band alone cannot say which model a step will reach.
 *
 * **A layer nothing declares stays drawn, dark.** `cache` is not hidden: *this
 * plan never reaches for a cache* and *this drawing does not show caches* are
 * different facts. The `agent` spine is always drawn with its wire, because the
 * runtime's own dispatches are what the other bands are timed against.
 */
export const Default: Story = {
  render: () => (
    <div className="w-[760px]">
      <LayerStrip
        palette={LAYER_PALETTE}
        bands={BANDS}
        items={ITEMS}
        scale="seq"
        selectedItem="send"
        onSelectItem={() => {}}
      />
    </div>
  ),
};
