import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExchangeRecord, PanelBox } from '@invana/ui';

const meta: Meta<typeof ExchangeRecord> = {
  title: 'UI/UI Extended/ExchangeRecord',
  component: ExchangeRecord,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The clarification that took this run two rounds, read back as a record.
 *
 * The option nobody took is still drawn. *It chose by promise date* explains
 * nothing; *it was offered two readings of «late» and chose promise date* is
 * what makes the second `parse_intent` on the trace above it obvious.
 *
 * Nothing here is pickable. `ClarifyCard` is the live ask with its controls;
 * this is the same exchange once it has an answer, and a trace is never
 * rewritten.
 */
export const Default: Story = {
  render: () => (
    <div className="w-[520px]">
      <PanelBox
        title="Output · an exchange"
        aside="it recorded a question and an answer"
        flush
      >
        <ExchangeRecord
          asker="the agent asks"
          question="“Late by ship date, or by the date we promised the customer?”"
          why="because parse_intent found two readings and was told not to guess"
          options={[
            { label: 'by ship date' },
            { label: 'by promise date', chosen: true },
          ]}
          answerer="ravi answers"
          answer="by promise date"
          answerNote="after 41.2s · the run resumed on round 2 with one reading"
        />
      </PanelBox>
    </div>
  ),
};
