import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Eyebrow, Stack, StepperControls, StepperDots, useStepper } from '@invana/ui';

import VARIANTS from '../../../../fixtures/ui-extended/stepper.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log } from '../../../_story/variant-grid';

interface Variant {
  caption: string;
  steps: string[];
  before?: boolean;
  /** The host's move takes this long — a canvas laying out, a camera gliding. */
  moveMs?: number;
  playEvery?: number;
  /** The host's move to this step throws. */
  failsAt?: number;
  closable?: boolean;
}

const ALL_VARIANTS = VARIANTS as Variant[];

interface Args {
  variant: string;
  onMove: (to: number) => void;
  onComplete: () => void;
  onClose: () => void;
}

const wait = (ms: number) => new Promise<void>((done) => setTimeout(done, ms));

function Cell({ v, log, args }: { v: Variant; log: Log; args: Omit<Args, 'variant'> }) {
  const stepper = useStepper({
    count: v.steps.length,
    before: v.before,
    playEvery: v.playEvery,
    onMove: async (to) => {
      args.onMove(to);
      log('onMove', to);
      if (v.moveMs) await wait(v.moveMs);
      if (to === v.failsAt) throw new Error(`"${v.steps[to]}" could not play: its panel is gone.`);
    },
    onComplete: () => {
      args.onComplete();
      log('onComplete', null);
    },
  });
  const at = stepper.index >= 0 ? v.steps[stepper.index] : 'Before the first step';
  return (
    <Stack gap="sm">
      <Eyebrow aside={stepper.busy ? 'moving…' : stepper.playing ? 'playing' : undefined}>{at}</Eyebrow>
      <StepperControls
        stepper={stepper}
        onClose={
          v.closable
            ? () => {
                args.onClose();
                log('onClose', null);
              }
            : undefined
        }
      />
      <StepperDots stepper={stepper} labels={v.steps} />
      {stepper.error && <Eyebrow>{stepper.error}</Eyebrow>}
    </Stack>
  );
}

const meta = {
  title: 'UI/UI Extended/Stepper',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(ALL_VARIANTS, (picked) =>
          snippets(
            ["import { StepperControls, StepperDots, useStepper } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { steps: v.steps },
              setup: [
                '// onMove receives the position to move to; it may return a promise, and the stepper is busy until it settles.',
                `const stepper = useStepper({ count: steps.length${v.before ? ', before: true' : ''}${v.playEvery ? `, playEvery: ${v.playEvery}` : ''}, onMove });`,
              ].join('\n'),
              call: [
                `<StepperControls stepper={stepper}${v.closable ? ' onClose={onClose}' : ''} />`,
                '<StepperDots stepper={stepper} labels={steps} />',
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onMove: fn(), onComplete: fn(), onClose: fn() },
  argTypes: { variant: variantArg(ALL_VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * The base every stepped walk is built on — `Tour` and `Presenter` draw it, and canvas's
 * playbook drives it. `useStepper` holds the position (or the host does), moves one step at a
 * time, waits for a slow move, plays on a timer and keeps a failed move's error;
 * `StepperControls` (◀ n/N ▶, Play, ✕) and `StepperDots` draw it. From
 * `fixtures/ui-extended/stepper.json`. Every move is logged.
 */
export const Stepper: Story = {
  render: ({ variant, ...args }) => (
    <VariantGrid variants={ALL_VARIANTS} variant={variant}>
      {(v, log) => <Cell v={v} log={log} args={args} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: ALL_VARIANTS[0].caption }));
    await step('Next moves one step', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Next step' }));
      await expect(args.onMove).toHaveBeenCalledWith(1);
      await expect(cell.getByText('2/5')).toBeInTheDocument();
    });
    await step('A dot moves to its step', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Go to step 4. The long tail' }));
      await expect(args.onMove).toHaveBeenCalledWith(3);
    });
    await step('← steps back while focus is inside', async () => {
      await userEvent.keyboard('{ArrowLeft}');
      await waitFor(() => expect(cell.getByText('3/5')).toBeInTheDocument());
    });
    const playing = within(within(canvasElement).getByRole('group', { name: ALL_VARIANTS[3].caption }));
    await step('Play steps on; any key stops it, even with focus on Play', async () => {
      await userEvent.click(playing.getByRole('button', { name: 'Play' }));
      await expect(await playing.findByText('2/4', undefined, { timeout: 3000 })).toBeInTheDocument();
      await userEvent.keyboard('x');
      await expect(playing.getByRole('button', { name: 'Play' })).toBeInTheDocument();
    });
    const failing = within(within(canvasElement).getByRole('group', { name: ALL_VARIANTS[4].caption }));
    await step('A failed move shows its error', async () => {
      await userEvent.click(failing.getByRole('button', { name: 'Go to step 3. A step on a panel that is gone' }));
      await expect(await failing.findByText(/could not play/)).toBeInTheDocument();
    });
  },
};
