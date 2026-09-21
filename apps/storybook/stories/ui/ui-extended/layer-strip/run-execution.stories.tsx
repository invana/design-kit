import type { Meta, StoryObj } from '@storybook/react-vite';
import { LayerStrip } from '@invana/ui';

import { RUN_BANDS, RUN_BRACKETS, RUN_ITEMS } from './_run';

const meta: Meta<typeof LayerStrip> = {
  title: 'UI/UI Extended/LayerStrip',
  component: LayerStrip,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * One run of `escalate-late-orders@7`, on the wall clock — and the reason it
 * took **9m 09s** to send one email.
 *
 * **The repetition is the drawing's subject.** The plan cannot act until it
 * knows *which* supplier is meant, so it comes back to a person for it: three
 * rounds of `ask` · `clarify` · `read`, each bracketed over the stretch it
 * owns. A round is dispatch → reply → read, not just the wait, because what
 * `max 3` costs is the whole loop and not only the part a person is holding.
 *
 * **What the axis says, no total could.** `human` spends **6m 01s of the 9m
 * 09s** — two thirds of the run — in three bars a reader measures by eye
 * against every other band. `llm` spends 57s across two roles, `graph data`
 * 42s, the egress 12s. The product's words for this are *waiting on a person*,
 * and the strip is where that stops being a feeling: the machine work is the
 * thin marks at either end, and the middle of the run is somebody deciding.
 *
 * **The fourth ask is struck, and it names the bound that stopped it.** Round 4
 * was dispatched and refused by `human/** · max_rounds 3` — a lens setting, not
 * the plan's (D10), because the same plan runs attended and at 3am. Hovering it
 * gives the rule; the run then decides `anyway` and sends. Removing that bar
 * would leave a gap indistinguishable from a stretch that never reached for a
 * person, and *the bound bit here* is the most important thing this drawing
 * says about this run.
 *
 * **What it costs, stated.** At nine minutes of axis, every step under ~50s is
 * drawn at the minimum bar width, so the second-scale work is placed truthfully
 * but not measurable by eye — the notes shrink to six characters and the card
 * carries the rest. A drawing cannot resolve a 7s read and a 2m 33s wait at
 * once, and this one is scaled for the wait, which is the question being asked.
 *
 * **`cache` stays drawn, dark.** Nothing here fronts a cache — the first thing
 * to change if that 57s of `llm` ever matters. A hidden band could not raise it.
 */
export const RunExecution: Story = {
  render: () => (
    <div className="w-[980px]">
      <LayerStrip
        bands={RUN_BANDS}
        items={RUN_ITEMS}
        brackets={RUN_BRACKETS}
        scale="elapsed"
        selectedItem="clarify_4"
        onSelectItem={() => {}}
      />
    </div>
  ),
};
