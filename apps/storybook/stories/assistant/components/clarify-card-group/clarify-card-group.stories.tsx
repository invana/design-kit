import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  type ClarifyAnswers,
  ClarifyCardGroup as ClarifyCardGroupPart,
  type ClarifyCardGroupProps,
} from '@invana/assistant';

import data from '../../../../fixtures/assistant/clarify-card-group.json';
import { attrs, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log } from '../../../_story/variant-grid';

interface GroupVariant {
  caption: string;
  props: Omit<ClarifyCardGroupProps, 'onSubmit'>;
}

// JSON widens `"answered"` to `string`; the shapes are the group's own.
const VARIANTS = data as unknown as GroupVariant[];

interface Args {
  variant: string;
  onSubmit: (answers: ClarifyAnswers) => void;
}

/** A group as its consumer holds it: submitting sends the answers and settles it. */
function LiveGroup({ variant, onSubmit, log }: { variant: GroupVariant; onSubmit: Args['onSubmit']; log: Log }) {
  const [sent, setSent] = React.useState<ClarifyAnswers | null>(null);
  return (
    <ClarifyCardGroupPart
      {...variant.props}
      state={sent ? 'answered' : variant.props.state}
      answers={sent ?? variant.props.answers}
      onSubmit={(answers) => {
        onSubmit(answers);
        log('onSubmit', answers);
        setSent(answers);
      }}
    />
  );
}

const meta = {
  title: 'Assistant/Components/ClarifyCardGroup',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { ClarifyCardGroup } from '@invana/assistant';"],
            picked.map((v) => {
              const { questions, ...rest } = v.props;
              return {
                comment: v.caption,
                data: { questions },
                setup: v.props.state
                  ? undefined
                  : '// onSubmit receives every answer, keyed by question name: { measure: "routes", country: "US" }.\nconst onSubmit = (answers) => api.send(answers);',
                call: `<ClarifyCardGroup ${attrs(rest)} questions={questions}${v.props.state ? '' : ' onSubmit={onSubmit}'} />`,
              };
            }),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onSubmit: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * Several questions asked at once, a tab each. A tab is ticked once its question has an answer;
 * picking an option moves on to the next open question, and words typed under the options are an
 * answer too. Submit waits for the required questions, then sends them all together and the group
 * settles into the inline `ClarifyCard` of the same questions — folded to *Answered · 3 questions*,
 * opening to each answer with the options not taken dimmed.
 */
export const ClarifyCardGroup: Story = {
  render: (args) => (
    <VariantGrid variants={VARIANTS} variant={args.variant}>
      {(v, log) => <LiveGroup variant={v} onSubmit={args.onSubmit} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = (caption: string) => within(within(canvasElement).getByRole('group', { name: caption }));
    await step('Answer each question, then submit them together', async () => {
      const c = cell('Waiting');
      await expect(c.getByRole('button', { name: 'Submit' })).toBeDisabled();
      await userEvent.click(c.getByText('Most routes'));
      await expect(c.getByText('Which country, if any?')).toBeVisible();
      await userEvent.type(c.getByRole('textbox'), 'Only Europe');
      await userEvent.click(c.getByRole('button', { name: 'Submit' }));
      await expect(args.onSubmit).toHaveBeenCalledWith({ measure: 'routes', country: 'Only Europe' });
      await expect(c.getByRole('button', { name: /Answered/ })).toBeVisible();
    });
  },
};
