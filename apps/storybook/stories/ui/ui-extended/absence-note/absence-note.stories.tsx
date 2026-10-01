import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { AbsenceNote as Component, PanelBox, type AbsenceNoteProps } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/absence-note.json';
import { inline, jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Variant } from '../../../_story/variant-board';

interface AbsenceVariant extends Variant {
  /** The panel the note stands in for. */
  panel: string;
  props: Pick<AbsenceNoteProps, 'reason' | 'label'>;
  text: string;
}

const VARIANTS = VARIANTS_JSON as AbsenceVariant[];

/** Props as JSX attributes: a string is quoted, anything else is an expression. */
const attrs = (props: object) =>
  Object.fromEntries(Object.entries(props).map(([k, v]) => [k, typeof v === 'string' ? { literal: v } : inline(v)]));

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI Extended/AbsenceNote',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { AbsenceNote, PanelBox } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              call: [
                `<PanelBox title="${v.panel}" flush>`,
                `  ${jsx('AbsenceNote', attrs(v.props)).replace(/ \/>$/, '>')}`,
                `    ${v.text}`,
                '  </AbsenceNote>',
                '</PanelBox>',
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All' },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * Three kinds of nothing, and a page that draws one empty table for all of them is lying about
 * two.
 *
 * *Nothing recorded* is a step still in flight — the interpreter writes `result.json` when the row
 * settles, so the panel is **absent**, not empty. *Purged* is a document that existed and aged
 * out; the counts and the outcome stay. *None declared* is a step whose contract has no such
 * output at all — a read under `read_only: true` writes nothing, and that is the record working.
 */
export const AbsenceNote: Story = {
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => (
        <PanelBox title={v.panel} flush>
          <Component {...v.props}>{v.text}</Component>
        </PanelBox>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const v of VARIANTS) {
      await expect(within(canvas.getByRole('group', { name: v.caption })).getByText(v.text)).toBeInTheDocument();
    }
  },
};
