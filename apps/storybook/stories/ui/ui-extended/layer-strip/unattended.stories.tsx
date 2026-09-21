import type { Meta, StoryObj } from '@storybook/react-vite';
import { LayerStrip } from '@invana/ui';

import { UNATTENDED_BANDS, UNATTENDED_ITEMS, LAYER_PALETTE } from './_run';

const meta: Meta<typeof LayerStrip> = {
  title: 'UI/UI Extended/LayerStrip',
  component: LayerStrip,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The same plan, the same question, at 3am — **47s instead of 9m 09s**.
 *
 * Nothing about the flow changed. The lens did: `may_ask: false`, so the
 * clarification is **refused before dispatch** and the run answers *cannot
 * answer — needs input that may not be requested*. Read against *Run
 * Execution*, the pair is the price of a person in the loop, stated by two
 * drawings of one plan rather than by an argument.
 *
 * **A refusal before dispatch still takes a bar.** `clarify` is struck at 43s
 * with `human/** · may_ask false` on its card — nothing was spent and nothing
 * left, which is exactly why it would otherwise be invisible. An unattended run
 * that simply *ended early* and one that *was stopped from asking* are the same
 * picture without it.
 *
 * **Two declared rows are drawn muted.** `role: extract` and
 * `third_party/app/email` are both in the plan and neither was reached, because
 * the round that would have read a reply never happened — so both recede to the
 * muted ground beside `cache`, which nothing declared at all. A muted declared
 * row says *this run did not get that far*; a row that was never drawn says
 * nothing.
 *
 * **`human/form/clarify` stays at full weight, and that is the point.** Its one
 * task was refused, not skipped — being stopped from reaching a participant and
 * never reaching for one are the two facts this drawing exists to separate, so
 * the mute follows *nothing happened here* and never *something was denied
 * here*.
 *
 * **The answer is `sent`, not `refused`.** The run succeeded at the only thing
 * left to it — saying it cannot answer, and why. Being refused a question is
 * not failing to answer one.
 */
export const Unattended: Story = {
  render: () => (
    <div className="w-[980px]">
      <LayerStrip
        palette={LAYER_PALETTE}
        bands={UNATTENDED_BANDS}
        items={UNATTENDED_ITEMS}
        scale="elapsed"
        selectedItem="clarify_1"
        onSelectItem={() => {}}
      />
    </div>
  ),
};
