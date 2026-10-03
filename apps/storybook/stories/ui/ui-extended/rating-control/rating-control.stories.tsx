import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { AgentChip, RatingControl, type Verdict } from '@invana/ui';
import { Textarea } from '@invana/forms';
import { User } from 'lucide-react';

import DATA from '../../../../fixtures/ui-extended/rating-control.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log } from '../../../_story/variant-grid';

interface Variant {
  caption: string;
  width?: number;
  props: { verdict?: Verdict; weight: number; maxWeight?: number; refines?: string };
  /** Who rates — drawn as a person's `AgentChip`. */
  by?: string;
  /** The note under the control, when there is one. */
  note?: string;
}

const VARIANTS = DATA as Variant[];

interface Args {
  variant: string;
  onVerdictChange: (verdict: Verdict) => void;
  onWeightChange: (weight: number) => void;
}

function Live({ v, log, args }: { v: Variant; log: Log; args: Omit<Args, 'variant'> }) {
  const [verdict, setVerdict] = React.useState(v.props.verdict);
  const [weight, setWeight] = React.useState(v.props.weight);
  const [note, setNote] = React.useState(v.note);
  return (
    <RatingControl
      {...v.props}
      verdict={verdict}
      onVerdictChange={(next) => {
        args.onVerdictChange(next);
        log('onVerdictChange', next);
        setVerdict(next);
      }}
      weight={weight}
      onWeightChange={(next) => {
        args.onWeightChange(next);
        log('onWeightChange', next);
        setWeight(next);
      }}
      by={v.by ? <AgentChip kind="person" icon={<User />} name={v.by} /> : undefined}
    >
      {note !== undefined ? (
        <Textarea rows={2} aria-label="Note" value={note} onChange={(e) => setNote(e.target.value)} />
      ) : null}
    </RatingControl>
  );
}

const meta = {
  title: 'UI/UI Extended/RatingControl',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { AgentChip, RatingControl } from '@invana/ui';", "import { Textarea } from '@invana/forms';"],
            picked.map((v) => ({
              comment: v.caption,
              setup: [
                '// onVerdictChange receives "appreciate" or "depreciate"; onWeightChange the weight, 1…maxWeight.',
                `const [verdict, setVerdict] = React.useState(${JSON.stringify(v.props.verdict)});`,
                `const [weight, setWeight] = React.useState(${v.props.weight});`,
              ].join('\n'),
              call: [
                jsx('RatingControl', {
                  verdict: 'verdict',
                  onVerdictChange: 'setVerdict',
                  weight: 'weight',
                  onWeightChange: 'setWeight',
                  maxWeight: v.props.maxWeight ? String(v.props.maxWeight) : undefined,
                  refines: v.props.refines ? { literal: v.props.refines } : undefined,
                  by: v.by ? `<AgentChip kind="person" icon={<User />} name="${v.by}" />` : undefined,
                }).replace(/\/>$/, v.note ? '>' : '/>'),
                ...(v.note ? [`  <Textarea rows={2} defaultValue="${v.note}" />`, '</RatingControl>'] : []),
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onVerdictChange: fn(), onWeightChange: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * A person's verdict on an agent's result — the capture signal the learning loop runs on, so it
 * states its consequence (`by`, `refines`) on the control itself. From
 * `fixtures/ui-extended/rating-control.json`. Flip the verdict or pick a weight: each is logged
 * with its value and the control follows.
 */
export const RatingControlStory: Story = {
  name: 'RatingControl',
  render: ({ variant, ...args }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <Live v={v} log={log} args={args} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: VARIANTS[0].caption }));
    await step('Depreciate', async () => {
      await userEvent.click(cell.getByRole('radio', { name: 'depreciate' }));
      await expect(args.onVerdictChange).toHaveBeenCalledWith('depreciate');
      await expect(cell.getByRole('radio', { name: 'depreciate' })).toHaveAttribute('aria-checked', 'true');
    });
    await step('Weight 3', async () => {
      await userEvent.click(cell.getByRole('radio', { name: '3' }));
      await expect(args.onWeightChange).toHaveBeenCalledWith(3);
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('onWeightChange3');
    });
  },
};
