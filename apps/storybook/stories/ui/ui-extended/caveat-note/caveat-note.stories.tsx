import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { CaveatNote as Component, type CaveatNoteProps } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/caveat-note.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Variant } from '../../../_story/variant-board';

interface CaveatVariant extends Variant {
  props: Pick<CaveatNoteProps, 'tone'> & { label: string; action?: string };
  text: string;
}

const VARIANTS = VARIANTS_JSON as CaveatVariant[];

interface Args {
  variant: string;
  onAction: () => void;
}

const meta = {
  title: 'UI/UI Extended/CaveatNote',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { CaveatNote } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              setup: v.props.action ? '// Receives nothing: open what the caveat is about.\nconst onAction = () => {};' : undefined,
              call: `${jsx('CaveatNote', {
                label: { literal: v.props.label },
                tone: v.props.tone ? { literal: v.props.tone } : undefined,
                action: v.props.action ? { literal: v.props.action } : undefined,
                onAction: v.props.action ? 'onAction' : undefined,
              }).replace(/ \/>$|\n\/>$/, (m) => (m === ' />' ? '>' : '\n>'))}\n  ${v.text}\n</CaveatNote>`,
            })),
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
 * What was left out, and how far to trust the figure. The label names the kind of caveat, so an
 * association reads differently from a simulation. `action` adds a link after the text to what
 * the caveat is about; `onAction` hears it.
 */
export const CaveatNote: Story = {
  render: ({ variant, onAction }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => (
        <Component
          {...v.props}
          onAction={
            v.props.action
              ? () => {
                  onAction();
                  log('onAction', v.props.action);
                }
              : undefined
          }
        >
          {v.text}
        </Component>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'With an action' }));
    await step('Follow the caveat', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Show the 4 stores' }));
      await expect(args.onAction).toHaveBeenCalled();
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('Show the 4 stores');
    });
  },
};
