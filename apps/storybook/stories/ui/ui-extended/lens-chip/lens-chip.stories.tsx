import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { LensChip as Component, PropertyList, PropertyRow, type LensChipProps } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/lens-chip.json';
import { inline, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Variant } from '../../../_story/variant-board';

interface LensChipVariant extends Variant {
  chips: { lens?: LensChipProps['lens']; pickable?: boolean; note: string }[];
}

const VARIANTS = VARIANTS_JSON as LensChipVariant[];

interface Args {
  variant: string;
  onPick: () => void;
}

const meta = {
  title: 'UI/UI Extended/LensChip',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { LensChip } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              setup: v.chips.some((c) => c.pickable)
                ? '// Receives nothing: open the drawer of worlds to pick from.\nconst onPick = () => {};'
                : undefined,
              call: v.chips
                .map(
                  (c) =>
                    `<LensChip${c.lens ? ` lens={${inline(c.lens)}}` : ''}${c.pickable ? ' onPick={onPick}' : ''} />`,
                )
                .join('\n'),
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

/**
 * Which world a run is being read under — the header's right-hand chip, and the one on an agent's
 * row.
 *
 * **No lens reads `Everything`, never blank and never `None`.** A Graph that sets no lens sees the
 * whole global model, every configured provider and every third party its agents are credentialed
 * for: the widest state is the default, and it is a *state*, not a missing value. `Everything` is
 * still inside the guardrails, which is why a guardrail is not a lens you pick.
 *
 * It carries the name and nothing else. With `onPick` it opens the drawer that says what the world
 * narrows; without it the chip is a statement and is not pressable.
 */
export const LensChip: Story = {
  render: ({ variant, onPick }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => (
        <PropertyList labelWidth={128}>
          {v.chips.map((c) => (
            <PropertyRow
              key={c.note}
              label={
                <Component
                  lens={c.lens}
                  onPick={
                    c.pickable
                      ? () => {
                          onPick();
                          log('onPick', c.lens?.name ?? 'Everything');
                        }
                      : undefined
                  }
                />
              }
            >
              {c.note}
            </PropertyRow>
          ))}
        </PropertyList>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('No lens reads Everything, and opens the picker', async () => {
      const cell = within(canvas.getByRole('group', { name: 'No lens set' }));
      await userEvent.click(cell.getByRole('button', { name: /Everything/ }));
      await expect(args.onPick).toHaveBeenCalled();
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"Everything"');
    });
    await step('A statement is not pressable', async () => {
      const cell = within(canvas.getByRole('group', { name: 'No picker — a statement' }));
      await expect(cell.queryByRole('button')).toBeNull();
    });
  },
};
