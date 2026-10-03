import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  Button,
  CannotAnswerCard,
  ChatSessionTaskRow,
  DiagnosisCard,
  PanelBox,
  RepairNote,
  RetryNote,
  type ChatSessionTaskRowProps,
} from '@invana/ui';

import DATA from '../../../../fixtures/ui-extended/run-outcomes.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log } from '../../../_story/variant-grid';

type Step =
  | { row: Pick<ChatSessionTaskRowProps, 'status' | 'name' | 'meta'> }
  | { repair: { from: string; to: string } }
  | { retry: { attempt: string; text: string } };

interface OutcomeVariant {
  caption: string;
  steps?: Step[];
  cannotAnswer?: { text: string; remedy: { before: string; code: string; after: string } };
  diagnosis?: {
    code: string;
    attempted: string;
    target: string;
    text: string;
    actions: { id: string; label: string; variant?: 'outline' }[];
  };
}

const VARIANTS = DATA as OutcomeVariant[];

interface Args {
  variant: string;
  onAction: (id: string) => void;
}

function stepNode(s: Step, i: number) {
  if ('row' in s) return <ChatSessionTaskRow key={i} {...s.row} />;
  if ('repair' in s) return <RepairNote key={i} from={s.repair.from} to={s.repair.to} />;
  return (
    <RetryNote key={i} attempt={s.retry.attempt}>
      {s.retry.text}
    </RetryNote>
  );
}

function Outcome({ v, log, onAction }: { v: OutcomeVariant; log: Log; onAction: Args['onAction'] }) {
  if (v.steps) return <PanelBox>{v.steps.map(stepNode)}</PanelBox>;
  if (v.cannotAnswer) {
    const { text, remedy } = v.cannotAnswer;
    return (
      <CannotAnswerCard
        remedy={
          <>
            {remedy.before}
            <code>{remedy.code}</code>
            {remedy.after}
          </>
        }
      >
        {text}
      </CannotAnswerCard>
    );
  }
  const d = v.diagnosis!;
  return (
    <DiagnosisCard
      code={d.code}
      attempted={d.attempted}
      target={d.target}
      actions={d.actions.map((a) => (
        <Button
          key={a.id}
          size="xs"
          variant={a.variant}
          onClick={() => {
            onAction(a.id);
            log('onClick', a.id);
          }}
        >
          {a.label}
        </Button>
      ))}
    >
      {d.text}
    </DiagnosisCard>
  );
}

function source(v: OutcomeVariant) {
  if (v.steps) {
    return {
      comment: v.caption,
      call: [
        '<PanelBox>',
        ...v.steps.map((s) =>
          'row' in s
            ? `  <ChatSessionTaskRow status="${s.row.status}" name="${s.row.name}" meta="${s.row.meta}" />`
            : 'repair' in s
              ? `  <RepairNote from="${s.repair.from}" to="${s.repair.to}" />`
              : `  <RetryNote attempt="${s.retry.attempt}">${s.retry.text}</RetryNote>`,
        ),
        '</PanelBox>',
      ].join('\n'),
    };
  }
  if (v.cannotAnswer) {
    const { text, remedy } = v.cannotAnswer;
    return {
      comment: v.caption,
      call: `<CannotAnswerCard remedy={<>${remedy.before}<code>${remedy.code}</code>${remedy.after}</>}>\n  ${text}\n</CannotAnswerCard>`,
    };
  }
  const d = v.diagnosis!;
  return {
    comment: v.caption,
    data: { diagnosis: { code: d.code, attempted: d.attempted, target: d.target } },
    setup: '// Each action is yours to wire — onAction("open-trace"), onAction("retry").',
    call: [
      '<DiagnosisCard',
      '  {...diagnosis}',
      '  actions={<>',
      ...d.actions.map(
        (a) => `    <Button size="xs"${a.variant ? ` variant="${a.variant}"` : ''} onClick={() => onAction("${a.id}")}>${a.label}</Button>`,
      ),
      '  </>}',
      '>',
      `  ${d.text}`,
      '</DiagnosisCard>',
    ].join('\n'),
  };
}

const meta = {
  title: 'UI/UI Extended/RunOutcomes',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { Button, CannotAnswerCard, ChatSessionTaskRow, DiagnosisCard, PanelBox, RepairNote, RetryNote } from '@invana/ui';"],
            picked.map(source),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onAction: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * Four ways a run ends — four components, never one card with a variant prop — from
 * `fixtures/ui-extended/run-outcomes.json`. Which one a reader sees decides who acts next, so they
 * must not be reachable from each other by flipping a prop. Repair and retry live *on the step*;
 * cannot-answer and diagnosis are cards. The diagnosis's actions are the consumer's: each click is
 * logged with its id.
 */
export const RunOutcomes: Story = {
  render: ({ variant, onAction }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <Outcome v={v} log={log} onAction={onAction} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: VARIANTS[3].caption }));
    await userEvent.click(cell.getByRole('button', { name: 'Retry' }));
    await expect(args.onAction).toHaveBeenCalledWith('retry');
    await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"retry"');
  },
};
