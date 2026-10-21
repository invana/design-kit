import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Textarea } from '@invana/forms';
import { AnnotationCard as Component, Button, TypographyMuted, type AnnotationCardProps } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/annotation-card.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../../_story/variant-grid';

interface AnnotationCardVariant extends Variant {
  /** Draw *Add to the graph · Dismiss* under the foot. */
  actions?: boolean;
  /** Draw the textarea in place of the text. */
  editing?: boolean;
  card: Omit<AnnotationCardProps, 'editor' | 'actions'>;
}

const VARIANTS = VARIANTS_JSON as AnnotationCardVariant[];

interface Args {
  variant: string;
  onPromote: () => void;
  onDismiss: () => void;
  onChange: (text: string) => void;
}

const meta = {
  title: 'UI/UI Extended/AnnotationCard',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { AnnotationCard, Button } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { card: v.card },
              ...(v.actions
                ? { setup: '// onPromote adds it to the graph; onDismiss takes it off this session.' }
                : {}),
              call: v.actions
                ? [
                    '<AnnotationCard {...card} actions={<>',
                    '  <Button size="xs" variant="outline" onClick={onPromote}>Add to the graph</Button>',
                    '  <Button size="xs" variant="ghost" onClick={onDismiss}>Dismiss</Button>',
                    '</>} />',
                  ].join('\n')
                : '<AnnotationCard {...card} />',
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onPromote: fn(), onDismiss: fn(), onChange: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

function Cell({ v, args, log }: { v: AnnotationCardVariant; args: Args; log: Log }) {
  const [text, setText] = React.useState(String(v.card.text ?? ''));
  const [gone, setGone] = React.useState<null | string>(null);
  if (gone) return <TypographyMuted>{gone}</TypographyMuted>;
  return (
    <Component
      {...v.card}
      text={text}
      {...(v.editing
        ? {
            editor: (
              <Textarea
                aria-label="What does the data say here?"
                rows={3}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  args.onChange(e.target.value);
                  log('onChange', e.target.value);
                }}
              />
            ),
          }
        : {})}
      {...(v.actions
        ? {
            actions: (
              <>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => {
                    args.onPromote();
                    log('onPromote', v.caption);
                    setGone('Added to the graph — solid now, every board with the record shows it.');
                  }}
                >
                  Add to the graph
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => {
                    args.onDismiss();
                    log('onDismiss', v.caption);
                    setGone('Dismissed from this session.');
                  }}
                >
                  Dismiss
                </Button>
              </>
            ),
          }
        : {})}
    />
  );
}

/**
 * One annotation, as it sits beside its record: a coloured edge and tint, the text, who wrote it
 * and when. A value annotation leads with its value and says *Was 71% when noted* once the record
 * no longer holds it. The assistant's, seen only in its session, are dashed and tagged and carry
 * *Add to the graph · Dismiss*; a gap says *Not in the data* instead of inventing a number.
 */
export const AnnotationCard: Story = {
  render: (args) => (
    <VariantGrid variants={VARIANTS} variant={args.variant}>
      {(v, log) => <Cell v={v} args={args} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const root = within(canvasElement);
    await step('A changed value says what it was', async () => {
      const cell = within(root.getByRole('group', { name: 'On a value that changed since' }));
      await expect(cell.getByText('Was 71% when noted')).toBeInTheDocument();
    });
    await step('Add the assistant’s to the graph', async () => {
      const cell = within(root.getByRole('group', { name: "The assistant's, this session only" }));
      await userEvent.click(cell.getByRole('button', { name: 'Add to the graph' }));
      await expect(args.onPromote).toHaveBeenCalled();
    });
  },
};
