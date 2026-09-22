import type { Meta, StoryObj } from '@storybook/react-vite';
import { LayerSection, PanelBox, ParticipantRow, type LayerPalette } from '@invana/ui';

const meta: Meta<typeof ParticipantRow> = {
  title: 'UI/UI Extended/ParticipantRow',
  component: ParticipantRow,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const PALETTE: LayerPalette = {
  graph_data: { swatch: 'bg-data-1' },
  llm: { swatch: 'bg-data-7' },
  third_party: { swatch: 'bg-data-8' },
  human: { swatch: 'bg-data-6' },
};

/**
 * The Lens reading: every participant the world allowed, and what the run
 * actually did with it.
 *
 * **Nothing is filtered out.** The list is not an inventory of what ran — it is
 * the gap between *declared* and *did*, and each kind of gap names a different
 * act. `Deal@v3` and `llama-3.3` were allowed and never reached for, which is
 * an invitation to narrow the world. `publisher_sponsor` was refused, which is
 * an invitation to widen it — or to accept that the graph cannot answer inside
 * it, deliberately.
 *
 * A refusal is **struck in place**, and the striking is `AddressChip`'s: the
 * address is struck everywhere a refusal is drawn, so no two surfaces can
 * disagree about whether a refusal is shown or hidden.
 */
export const Default: Story = {
  render: () => (
    <div className="w-[640px]">
      <PanelBox
        title="Every participant this run could have spent"
        aside="refusals struck, never hidden"
      >
        <div className="flex flex-col gap-2">
          <LayerSection layer="graph_data" summary="3 allowed · 2 touched" palette={PALETTE}>
            <ParticipantRow
              address="graph_data/model/Routes@v4"
              verdict="touched"
              note="1,284 rows · step 7"
            />
            <ParticipantRow
              address="graph_data/model/Carriers@v2"
              verdict="touched"
              note="schema only · step 4"
            />
            <ParticipantRow
              address="graph_data/model/Deal@v3"
              verdict="never touched"
              note="allowed, and nothing asked for it"
            />
            <ParticipantRow
              address="graph_data/stitch/publisher_sponsor"
              verdict="refused"
              note="outside this world — widen to answer"
            />
          </LayerSection>
          <LayerSection layer="llm" summary="3 allowed · 2 touched" palette={PALETTE}>
            <ParticipantRow
              address="llm/anthropic-prod/claude-haiku-4.5"
              verdict="touched"
              note="3 calls · extract"
            />
            <ParticipantRow
              address="llm/ollama-local/llama-3.3"
              verdict="never touched"
              note="allowed as a judge, never asked"
            />
          </LayerSection>
          <LayerSection layer="third_party" summary="1 allowed · 0 touched" palette={PALETTE}>
            <ParticipantRow
              address="third_party/api/clearbit.com/**"
              verdict="refused"
              note="denied by a guardrail"
            />
          </LayerSection>
        </div>
      </PanelBox>
    </div>
  ),
};
