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
 * The same run with every band shut — *where did the time go*, in six lines.
 *
 * **Folded, the strip stops answering *which participant* and starts answering
 * *who held the run*.** One line per layer, every task still placed in time,
 * and the shape is the whole finding: `human` is three long bars filling the
 * middle of the axis and the other five layers are marks. Nobody has to read
 * 6m 01s against 9m 09s — the bars have already said it.
 *
 * **Folding moves a task up a row; it never drops one.** A shut band draws its
 * participants' tasks on its own line at their real width, so the band's count
 * and its bars always agree, and the refused fourth round is still struck in
 * place at 8m 35s. This is also where a compact bar earns its 0.75rem floor:
 * at this scale a 7s `read` *should* be a mark, and forcing it to a legible
 * width would make the llm line look as busy as the human one.
 *
 * **What it costs, stated.** A mark cannot carry its own name. Folded, the
 * labels go with the rows and the answer to *which task was that* is the hover
 * card — which is the trade the overview makes, and why it is a disclosure
 * rather than the only reading. `agent` keeps full-size bars throughout: it has
 * no participants to fold, so it is already its own overview.
 *
 * **The brackets survive the fold**, because a round is a stretch of the axis
 * rather than a property of a row — three repetitions, still bracketed, over a
 * strip that is now six lines tall.
 *
 * This is the reading a run drawer opens on. *Which model, which role, which
 * rule* is one chevron or one hover away; *what was this run doing for nine
 * minutes* should not cost a click.
 */
export const WhereTheTimeWent: Story = {
  render: () => (
    <div className="w-[980px]">
      <LayerStrip
        bands={RUN_BANDS}
        items={RUN_ITEMS}
        brackets={RUN_BRACKETS}
        scale="elapsed"
        defaultCollapsed={['human', 'llm', 'graph_data', 'third_party']}
        onSelectItem={() => {}}
      />
    </div>
  ),
};
