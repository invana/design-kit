import type { Meta, StoryObj } from '@storybook/react-vite';
import { RuleRow } from '@invana/ui';

const meta: Meta<typeof RuleRow> = {
  title: 'UI/UI Extended/RuleRow',
  component: RuleRow,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * One rule read as a sentence: what it matches, whether it allows, and what it
 * narrows. This is the `EU · H1 2026` world and the guardrail it sits inside,
 * as the Worlds drawer prints them.
 *
 * **Deny is the loud one.** An allow is the ordinary state and sits muted; a
 * deny takes the destructive token, because deny wins at any specificity and a
 * reader scanning a long lens for *what is shut* should find it without reading
 * every row.
 *
 * **The axis is always named.** `time 2026-01-01 → 2026-06-30 · axis
 * signed_at` — never just the dates. Two models in one Graph declare different
 * time properties, and *which rows did this run see* must not depend on the
 * reader guessing which one was used.
 *
 * A row with no selectors is one line tall, which is what most rows are. The
 * sub-lines are facts about the match, so they hang under it rather than
 * becoming columns most rules would leave empty.
 */
export const Default: Story = {
  render: () => (
    <div className="flex w-[520px] flex-col gap-4">
      <div className="flex flex-col">
        <RuleRow
          match="graph_data/model/Deals@*"
          allow
          select={{
            time: { axis: 'signed_at', from: '2026-01-01', to: '2026-06-30' },
            geo: {
              axis: 'country_iso',
              vocab: 'iso2',
              in: ['DE', 'FR', 'NL', 'ES', 'CH'],
            },
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
      </div>

      <div className="flex flex-col border-t border-border pt-2">
        <RuleRow
          match="graph_data/model/Deals@*"
          allow
          properties={{ exclude: ['revenue', 'contract_value'] }}
        />
        <RuleRow
          match="llm/**"
          allow
          egress={{ may_send: ['type_names', 'the_question'] }}
        />
        <RuleRow match="third_party/**" allow={false} readOnly />
      </div>
    </div>
  ),
};
