import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CannotAnswerCard, DiagnosisCard, RepairNote, RetryNote,
  ChatSessionTaskRow, Button,
} from '@invana/ui';

const meta: Meta<typeof CannotAnswerCard> = {
  title: 'UI/UI Extended/RunOutcomes',
  component: CannotAnswerCard,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Four ways a run ends — four components, never one card with a variant prop
 * (DS8). Which one a reader sees decides who acts next, so they must not be
 * reachable from each other by flipping a prop.
 *
 * Repair and retry live *on the step*; cannot-answer and diagnosis are cards.
 */
export const FourOutcomes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <section className="flex w-[330px] flex-col gap-1">
        <h4 className="text-meta text-muted-foreground">repair · the query went back once</h4>
        <div className="border border-border bg-card p-2">
          <ChatSessionTaskRow status="success" name="Validate" meta="repaired once" />
          <RepairNote from="Theme.velocity5d" to="Theme.velocity_5d" />
          <ChatSessionTaskRow status="success" name="Execute" meta="3 records" />
        </div>
      </section>

      <section className="flex w-[330px] flex-col gap-1">
        <h4 className="text-meta text-muted-foreground">retry · the database was slow, not wrong</h4>
        <div className="border border-border bg-card p-2">
          <ChatSessionTaskRow status="success" name="Execute" meta="retry 1 of 2" />
          <RetryNote attempt="retry 1 of 2">
            no response in 2.0s; the second attempt returned in 0.6s
          </RetryNote>
          <ChatSessionTaskRow status="success" name="Verify" meta="served" />
        </div>
      </section>

      <section className="flex w-[330px] flex-col gap-1">
        <h4 className="text-meta text-muted-foreground">cannot answer · the graph does not hold it</h4>
        <CannotAnswerCard remedy={<>What would change that: import the ticker into <code className="font-mono">market-data</code>.</>}>
          This graph holds no bars and no news for SUZLON-BE.
        </CannotAnswerCard>
      </section>

      <section className="flex w-[330px] flex-col gap-1">
        <h4 className="text-meta text-muted-foreground">failure · something broke, and it is named</h4>
        <DiagnosisCard
          code="execute · connection_refused"
          attempted="MATCH (t:Theme)<-[:IN]-(s:Stock) WHERE t.velocity_5d < 2.0 RETURN s.symbol"
          target="bolt://neo4j.internal:7687 · 2 attempts · 4.1s"
          actions={<><Button size="xs">Open the trace</Button><Button size="xs" variant="outline">Retry</Button></>}
        >
          The database did not accept a connection on either attempt.
        </DiagnosisCard>
      </section>
    </div>
  ),
};
