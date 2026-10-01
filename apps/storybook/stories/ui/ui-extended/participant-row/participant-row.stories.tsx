import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { LayerSection, PanelBox, ParticipantRow, type LayerPalette } from '@invana/ui';

import VARIANTS from '../../../../fixtures/ui-extended/participant-row.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard } from '../../../_story/variant-board';

interface Args {
  variant: string;
}

/** The hues are the caller's — the kit ships none. */
const PALETTE: LayerPalette = {
  graph_data: { swatch: 'bg-data-1' },
  llm: { swatch: 'bg-data-7' },
  third_party: { swatch: 'bg-data-8' },
  human: { swatch: 'bg-data-6' },
};

const meta = {
  title: 'UI/UI Extended/ParticipantRow',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { LayerSection, PanelBox, ParticipantRow, type LayerPalette } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { sections: v.sections },
              setup: "const palette: LayerPalette = { graph_data: { swatch: 'bg-data-1' }, llm: { swatch: 'bg-data-7' }, third_party: { swatch: 'bg-data-8' } };",
              call: [
                `<PanelBox title="${v.title}" aside="${v.aside}">`,
                '  {sections.map((s) => (',
                '    <LayerSection key={s.layer} layer={s.layer} summary={s.summary} palette={palette}>',
                '      {s.rows.map((r) => <ParticipantRow key={r.address} {...r} />)}',
                '    </LayerSection>',
                '  ))}',
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
 * The Lens reading: every participant the world allowed, and what the run actually did with it,
 * from `fixtures/ui-extended/participant-row.json`. **Nothing is filtered out** — the list is the
 * gap between *declared* and *did*. `Deal@v3` and `llama-3.3` were allowed and never reached for
 * (narrow the world); `publisher_sponsor` was refused (widen it). A refusal is **struck in place**,
 * by `AddressChip`, so no two surfaces disagree about whether a refusal is shown.
 */
export const ParticipantRowStory: Story = {
  name: 'ParticipantRow',
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => (
        <PanelBox title={v.title} aside={v.aside}>
          {v.sections.map((s) => (
            <LayerSection key={s.layer} layer={s.layer} summary={s.summary} palette={PALETTE}>
              {s.rows.map((r) => (
                <ParticipantRow key={r.address} {...r} />
              ))}
            </LayerSection>
          ))}
        </PanelBox>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const v of VARIANTS) {
      const cell = within(canvas.getByRole('group', { name: v.caption }));
      const rows = v.sections.flatMap((s) => s.rows);
      for (const r of rows) await expect(cell.getAllByText(r.note).length).toBeGreaterThan(0);
    }
  },
};
