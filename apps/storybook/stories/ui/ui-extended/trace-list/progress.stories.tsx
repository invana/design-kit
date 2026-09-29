import type { Meta, StoryObj } from '@storybook/react-vite';
import { TraceList, TraceStep } from '@invana/ui';

const meta: Meta<typeof TraceList> = {
  title: 'UI/UI Extended/TraceList',
  component: TraceList,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Progress — the trace a running answer streams. Done steps are filled, the running
 * one pulses, a pending one is hollow; the timing or count sits at the right in mono.
 */
export const Progress: Story = {
  render: () => (
    <TraceList variant="progress">
      <TraceStep name="Read general ledger" duration="12,408 rows" />
      <TraceStep name="Joined carrier invoices" duration="3,911 rows" />
      <TraceStep name="Decomposing the change" duration="2.1 s" status="running" />
      <TraceStep name="Write summary" status="pending" />
    </TraceList>
  ),
};
