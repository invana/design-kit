import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Presenter, Stack, StepperControls, useStepper, type PresenterStep } from '@invana/ui';
import { Sparkles } from 'lucide-react';

import VARIANTS from '../../../../fixtures/ui-extended/presenter.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log } from '../../../_story/variant-grid';

interface Variant {
  caption: string;
  steps: PresenterStep[];
  variant?: 'deck' | 'compact';
  before?: boolean;
  playEvery?: number;
  closable?: boolean;
  /** Compact: draw the moves beside it, as a toolbar would. */
  withControls?: boolean;
}

const ALL_VARIANTS = VARIANTS as Variant[];

interface Args {
  variant: string;
  onMove: (to: number) => void;
  onClose: () => void;
}

function Cell({ v, log, args }: { v: Variant; log: Log; args: Omit<Args, 'variant'> }) {
  const [open, setOpen] = React.useState(true);
  const stepper = useStepper({
    count: v.steps.length,
    before: v.before,
    playEvery: v.playEvery,
    onMove: (to) => {
      args.onMove(to);
      log('onMove', to);
    },
  });
  if (!open) return null;
  const close = v.closable
    ? () => {
        args.onClose();
        log('onClose', null);
        setOpen(false);
      }
    : undefined;
  const presenter = (
    <Presenter
      stepper={stepper}
      steps={v.steps}
      variant={v.variant}
      onClose={close}
      narrationIcon={v.variant === 'compact' ? <Sparkles className="size-4 shrink-0" /> : undefined}
    />
  );
  if (!v.withControls) return presenter;
  return (
    <Stack gap="sm">
      <StepperControls stepper={stepper} />
      {presenter}
    </Stack>
  );
}

const meta = {
  title: 'UI/UI Extended/Presenter',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(ALL_VARIANTS, (picked) =>
          snippets(
            ["import { Presenter, StepperControls, useStepper } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { steps: v.steps },
              setup: [
                '// onMove receives the position; the host changes what the step shows (lights records, moves a camera).',
                `const stepper = useStepper({ count: steps.length${v.before ? ', before: true' : ''}${v.playEvery ? `, playEvery: ${v.playEvery}` : ''}, onMove });`,
              ].join('\n'),
              call: [
                ...(v.withControls ? ['<StepperControls stepper={stepper} />'] : []),
                `<Presenter stepper={stepper} steps={steps}${v.variant ? ` variant="${v.variant}"` : ''}${v.closable ? ' onClose={onClose}' : ''} />`,
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onMove: fn(), onClose: fn() },
  argTypes: { variant: variantArg(ALL_VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * A script presented step by step — a board's story in Studio, a canvas playbook in
 * `PlaybookPresenter` — over a `useStepper`. `deck` carries its own moves (◀ Previous, the
 * dots, Play, Next ▶, ✕); `compact` leaves them to a `StepperControls` in a toolbar. From
 * `fixtures/ui-extended/presenter.json`. Every move is logged.
 */
export const PresenterStory: Story = {
  name: 'Presenter',
  render: ({ variant, ...args }) => (
    <VariantGrid variants={ALL_VARIANTS} variant={variant}>
      {(v, log) => <Cell v={v} log={log} args={args} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: ALL_VARIANTS[0].caption }));
    await step('Next shows the next step', async () => {
      await userEvent.click(cell.getByRole('button', { name: /Next/ }));
      await expect(args.onMove).toHaveBeenCalledWith(1);
      await expect(cell.getByText('Step 2 / 4')).toBeInTheDocument();
      await expect(cell.getByText('The busiest hub')).toBeInTheDocument();
    });
    const playing = within(within(canvasElement).getByRole('group', { name: ALL_VARIANTS[1].caption }));
    await step('Play steps on; a click stops it', async () => {
      await userEvent.click(playing.getByRole('button', { name: 'Play' }));
      await expect(await playing.findByText('Step 2 / 3', undefined, { timeout: 3000 })).toBeInTheDocument();
      await userEvent.click(playing.getByText('Step 2 / 3'));
      await expect(playing.getByRole('button', { name: 'Play' })).toBeInTheDocument();
    });
    await step('✕ closes it', async () => {
      await userEvent.click(playing.getByRole('button', { name: 'Close' }));
      await expect(args.onClose).toHaveBeenCalled();
    });
  },
};
