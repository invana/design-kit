import type { Meta, StoryObj } from '@storybook/react-vite';
import { MarkChip, PanelBox, TraceGate, TraceList, TraceStep } from '@invana/ui';

import { LAYER_PALETTE } from './_run';

const meta: Meta<typeof TraceList> = {
  title: 'UI/UI Extended/TraceList',
  component: TraceList,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The six ways the same list reads when a run is not a clean success — and the
 * rule they share: **a row keeps its place in every one of them.**
 *
 * In flight, the live row paints where it sits and the queued row below it is
 * dim rather than absent. Failed, the step that spent its bound is struck and
 * everything under it says *skipped* — which is how the list says nothing below
 * it was dispatched. Parked, the gate is above the held step, and the held step
 * has no duration because nothing has been spent on it. Delegating, the child
 * run's steps sit under the step that spawned them, indented, never siblings.
 */
export const States: Story = {
  render: () => (
    <div className="grid w-[960px] grid-cols-2 gap-3">
      <PanelBox title="In flight" aside="step 5 of 9 · 43s elapsed" flush>
        <TraceList>
          <TraceStep
            seq={4}
            name="resolve_schema"
            description="Routes@v4, Carriers@v2"
            layer="graph_data"
            role="schema"
            duration="0.2s"
            note="2 models"
            palette={LAYER_PALETTE}
          />
          <TraceStep
            seq={5}
            name="build_query"
            description="Writing the query now…"
            layer="llm"
            role="decide"
            duration="—"
            note="running"
            mark={<MarkChip tone="info">live</MarkChip>}
            palette={LAYER_PALETTE}
          />
          <TraceStep
            seq={6}
            name="validate_query"
            description="Queued — nothing dispatched yet"
            layer="agent"
            role="check"
            duration="—"
            note="queued"
            dim
            palette={LAYER_PALETTE}
          />
        </TraceList>
      </PanelBox>

      <PanelBox
        title="Failed — the bound was exhausted"
        aside="failed · 3 of 3 attempts"
        flush
      >
        <TraceList>
          <TraceStep
            seq={6}
            name="validate_query"
            description="Inside the read subset"
            layer="agent"
            role="check"
            duration="0.1s"
            note="passed"
            palette={LAYER_PALETTE}
          />
          <TraceStep
            seq={7}
            name="execute_query"
            description="Timed out three times — the bound is spent"
            layer="graph_data"
            role="read_only"
            duration="90.4s"
            note="failed"
            mark={<MarkChip tone="destructive">↺ 3 of 3</MarkChip>}
            struck
            palette={LAYER_PALETTE}
          />
          <TraceStep
            seq={8}
            name="summarise"
            description="Never dispatched"
            layer="llm"
            role="extract"
            duration="—"
            note="skipped"
            dim
            palette={LAYER_PALETTE}
          />
        </TraceList>
      </PanelBox>

      <PanelBox title="Parked at a gate" aside="awaiting_approval · 2m 04s so far" flush>
        <TraceList>
          <TraceStep
            seq={6}
            name="validate_query"
            description="Inside the read subset"
            layer="agent"
            role="check"
            duration="0.1s"
            note="passed"
            palette={LAYER_PALETTE}
          />
          <TraceGate
            label="approval — waiting on ravi"
            note="est. 1.2M rows > 500,000"
            tone="warning"
          />
          <TraceStep
            seq={7}
            name="execute_query"
            description="Held — the gate is above it"
            layer="graph_data"
            role="read_only"
            duration="—"
            note="held"
            dim
            palette={LAYER_PALETTE}
          />
        </TraceList>
      </PanelBox>

      <PanelBox title="A step that delegated" aside="run:7d3184f1 → run:9c02" flush>
        <TraceList>
          <TraceStep
            seq={8}
            name="summarise"
            description="Handed the shaping to a Researcher"
            layer="llm"
            role="extract"
            duration="3.4s"
            note="1 child"
            mark={<MarkChip tone="info">↳ delegates</MarkChip>}
            palette={LAYER_PALETTE}
          />
          <TraceStep
            seq={1}
            name="rank_carriers"
            description="Six carriers carry 71% of it"
            layer="llm"
            role="decide"
            duration="1.8s"
            note="ok"
            depth={1}
            palette={LAYER_PALETTE}
          />
          <TraceStep
            seq={2}
            name="draft_summary"
            description="Three sentences, each citing a row"
            layer="llm"
            role="extract"
            duration="1.4s"
            note="ok"
            depth={1}
            palette={LAYER_PALETTE}
          />
        </TraceList>
      </PanelBox>
    </div>
  ),
};
