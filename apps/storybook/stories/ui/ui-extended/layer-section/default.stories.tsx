import type { Meta, StoryObj } from '@storybook/react-vite';
import { LayerSection, RuleRow } from '@invana/ui';

const meta: Meta<typeof LayerSection> = {
  title: 'UI/UI Extended/LayerSection',
  component: LayerSection,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A lens reads as five of these stacked, so *what is shut* is answered by
 * scanning five summary lines rather than by reading every rule.
 *
 * This is `EU · H1 2026` in full: graph data **closed** to four models, llm
 * permitted whole, third party shut by the guardrail above it, cache and human
 * untouched.
 *
 * **A closed layer says so in its summary.** Closing a layer is what picking
 * four models out of six means, and it is a stated field rather than something
 * inferred from *there is an allow rule in this band* — an implicit allow-list
 * is exactly the kind of bound an auditor cannot see.
 *
 * **A band with no rules still appears.** *This Graph has no third parties
 * configured* and *it has them and this lens admits none* are different facts,
 * and a band that vanished when empty would make them look alike. The second is
 * the one worth seeing.
 */
export const Default: Story = {
  render: () => (
    <div className="flex w-[560px] flex-col gap-5">
      <LayerSection
        layer="graph_data"
        count={16}
        summary="closed · 4 models, 2 of them sliced"
      >
        <RuleRow
          match="graph_data/model/Deals@*"
          allow
          select={{
            time: { axis: 'signed_at', from: '2026-01-01', to: '2026-06-30' },
            geo: { axis: 'country_iso', vocab: 'iso2', in: ['DE', 'FR', 'NL'] },
          }}
        />
        <RuleRow
          match="graph_data/model/NewsArticles@*"
          allow
          select={{
            time: { axis: 'published_at', from: '2026-01-01', to: '2026-06-30' },
          }}
        />
        <RuleRow match="graph_data/model/AirRoutes@*" allow />
        <RuleRow match="graph_data/model/Twitter@*" allow />
      </LayerSection>

      <LayerSection layer="llm" count={1} summary="permitted whole">
        <RuleRow
          match="llm/**"
          allow
          egress={{ may_send: ['type_names', 'the_question'] }}
        />
      </LayerSection>

      <LayerSection
        layer="third_party"
        count={0}
        summary="denied by a guardrail"
      >
        <RuleRow match="third_party/**" allow={false} readOnly />
      </LayerSection>

      <LayerSection layer="cache" count={3} summary="permitted whole" />

      <LayerSection layer="human" count={3} summary="permitted whole" dim />
    </div>
  ),
};
