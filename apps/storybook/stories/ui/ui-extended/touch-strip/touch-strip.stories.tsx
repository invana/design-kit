import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Eyebrow, PanelBox, TouchStrip, type LayerPalette } from '@invana/ui';

import DATA from '../../../../fixtures/ui-extended/touch-strip.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard } from '../../../_story/variant-board';

const VARIANTS = DATA.variants;
/** The hues are the caller's — the kit ships none. */
const PALETTE: LayerPalette = DATA.palette;

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI Extended/TouchStrip',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { Eyebrow, PanelBox, TouchStrip } from '@invana/ui';"],
            picked.map((v) => {
              const strip = jsx('TouchStrip', {
                orientation: v.orientation === 'column' ? { literal: 'column' } : undefined,
                palette: 'palette',
                items: 'items',
              });
              return {
                comment: v.caption,
                data: { palette: DATA.palette, items: v.items },
                call:
                  v.orientation === 'column'
                    ? `<Eyebrow aside="${v.aside}">${v.title}</Eyebrow>\n${strip}`
                    : `<PanelBox title="${v.title}" aside="${v.aside}">\n  ${strip.split('\n').join('\n  ')}\n</PanelBox>`,
              };
            }),
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
 * What one run touched at all, in one line — from `fixtures/ui-extended/touch-strip.json`. A
 * step spends exactly one layer, so this is asked once per run and costs one line, not an axis.
 * `cache` is dimmed (allowed, nothing reached for it); `third party` is struck (a guardrail said
 * no). The column form reads the same summary down a narrow panel, one line per layer.
 */
export const TouchStripStory: Story = {
  name: 'TouchStrip',
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => {
        const strip = (
          <TouchStrip
            orientation={v.orientation as 'row' | 'column'}
            palette={PALETTE}
            items={v.items}
          />
        );
        return v.orientation === 'column' ? (
          <>
            <Eyebrow aside={v.aside}>{v.title}</Eyebrow>
            {strip}
          </>
        ) : (
          <PanelBox title={v.title} aside={v.aside}>
            {strip}
          </PanelBox>
        );
      }}
    </VariantBoard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const v of VARIANTS) {
      const cell = within(canvas.getByRole('group', { name: v.caption }));
      await expect(cell.getByText('1,284 rows')).toBeInTheDocument();
    }
  },
};
