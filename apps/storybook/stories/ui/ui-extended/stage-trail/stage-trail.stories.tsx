import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { StageTrail as Component, type StageTrailStep } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/stage-trail.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../../_story/variant-grid';

interface TrailVariant extends Variant {
  steps: StageTrailStep[];
}

const VARIANTS = VARIANTS_JSON as TrailVariant[];

interface Args {
  variant: string;
  onPick: (id: string) => void;
}

const meta = {
  title: 'UI/UI Extended/StageTrail',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { StageTrail } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { steps: v.steps },
              call: jsx('StageTrail', { steps: 'steps', onPick: 'onPick' }) + ' // onPick("model")',
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onPick: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Picking a stage moves the work there, as a consumer would: the ones before it done, after it not reached. */
function Live({ steps, log, onPick }: { steps: StageTrailStep[]; log: Log; onPick: Args['onPick'] }) {
  const [at, setAt] = React.useState(() => steps.findIndex((s) => s.state === 'current'));
  const shown = steps.map((s, i) => ({ ...s, state: i < at ? 'done' : i === at ? 'current' : 'todo' }) as StageTrailStep);
  return (
    <Component
      steps={shown}
      onPick={(id) => {
        onPick(id);
        log('onPick', id);
        setAt(steps.findIndex((s) => s.id === id));
      }}
    />
  );
}

/**
 * Where a piece of work stands in a fixed run of stages — from `fixtures/ui-extended/stage-trail.json`.
 * It sits in an app header's centre and gives up width first: in the narrow cell only the current
 * stage is named. Pick a stage: its id is logged and the trail moves there.
 */
export const StageTrail: Story = {
  render: ({ variant, onPick }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <Live steps={v.steps} log={log} onPick={onPick} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'At the dataset' }));
    await userEvent.click(cell.getByRole('button', { name: /^Import/ }));
    await expect(args.onPick).toHaveBeenCalledWith('import');
    await expect(cell.getByRole('button', { name: /^Import/ })).toHaveAttribute('aria-current', 'step');
  },
};
