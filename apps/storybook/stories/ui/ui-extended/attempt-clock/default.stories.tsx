import type { Meta, StoryObj } from '@storybook/react-vite';
import { AttemptClock, PanelBox } from '@invana/ui';

const meta: Meta<typeof AttemptClock> = {
  title: 'UI/UI Extended/AttemptClock',
  component: AttemptClock,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `execute_query` took `2.1s`, and the reader waited `32.4s`. The gap **is**
 * the first attempt, and the clock says so rather than leaving a subtraction on
 * the page.
 *
 * The attempt that timed out keeps its place, struck: a step that was retried
 * and a step that ran once are different records, and the retry is usually why
 * someone opened the page.
 */
export const Default: Story = {
  render: () => (
    <div className="w-[720px]">
      <PanelBox
        title="Its clock — attempt by attempt"
        aside="elapsed 32.4s · working 2.3s"
        flush
      >
        <AttemptClock
          summary="elapsed 32.4s · working 2.3s — the gap is the attempt that timed out"
          rows={[
            {
              label: 'queued',
              started: '+44.3s',
              took: '0.2s',
              what: 'dispatched to the graph connector',
              tone: 'muted',
            },
            {
              label: 'attempt 1',
              started: '+44.5s',
              took: '30.0s',
              what: 'timed out — the connector never answered',
              tone: 'destructive',
              struck: true,
            },
            {
              label: 'attempt 2',
              started: '+74.6s',
              took: '2.1s',
              what: 'cursor drained · 1,284 rows · the one that stuck',
              tone: 'success',
            },
            {
              label: 'settled',
              started: '+76.7s',
              took: '—',
              what: 'result.json written by the interpreter',
              tone: 'muted',
            },
          ]}
        />
      </PanelBox>
    </div>
  ),
};
