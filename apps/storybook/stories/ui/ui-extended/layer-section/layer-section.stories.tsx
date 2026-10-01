import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { LayerSection as Component, RuleRow, type Layer, type LayerPalette, type RuleRowProps } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/layer-section.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Variant } from '../../../_story/variant-board';

/** The hues are the caller's — these components ship none. */
const PALETTE: LayerPalette = {
  graph_data: { swatch: 'bg-data-1' },
  llm: { swatch: 'bg-data-7' },
  third_party: { swatch: 'bg-data-8' },
  cache: { swatch: 'bg-data-3' },
  human: { swatch: 'bg-data-6' },
};

interface Section {
  layer: Layer;
  count: number;
  summary: string;
  dim?: boolean;
  rules?: Pick<RuleRowProps, 'match' | 'allow' | 'select' | 'egress' | 'readOnly'>[];
}

interface SectionVariant extends Variant {
  sections: Section[];
}

const VARIANTS = VARIANTS_JSON as SectionVariant[];

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI Extended/LayerSection',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { LayerSection, RuleRow } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { palette: PALETTE, sections: v.sections },
              call: [
                'sections.map(({ rules = [], ...section }) => (',
                '  <LayerSection key={section.layer} {...section} palette={palette}>',
                '    {rules.map((rule) => <RuleRow key={rule.match} {...rule} />)}',
                '  </LayerSection>',
                '))',
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
 * A lens reads as five of these stacked, so *what is shut* is answered by scanning five summary
 * lines rather than by reading every rule. This is `EU · H1 2026` in full: graph data **closed**
 * to four models, llm permitted whole, third party shut by the guardrail above it, cache and human
 * untouched.
 *
 * **A closed layer says so in its summary.** Closing a layer is what picking four models out of
 * six means, and it is a stated field rather than something inferred from *there is an allow rule
 * in this band* — an implicit allow-list is exactly the kind of bound an auditor cannot see.
 *
 * **A band with no rules still appears.** *This Graph has no third parties configured* and *it
 * has them and this lens admits none* are different facts, and a band that vanished when empty
 * would make them look alike.
 */
export const LayerSection: Story = {
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) =>
        v.sections.map(({ rules = [], ...section }) => (
          <Component key={section.layer} {...section} palette={PALETTE}>
            {rules.map((rule) => (
              <RuleRow key={rule.match} {...rule} />
            ))}
          </Component>
        ))
      }
    </VariantBoard>
  ),
  play: async ({ canvasElement }) => {
    const v = VARIANTS[0]!;
    const cell = within(within(canvasElement).getByRole('group', { name: v.caption }));
    // Every band draws its summary — the empty ones included.
    for (const s of v.sections) await expect(cell.getAllByText(s.summary).length).toBeGreaterThan(0);
  },
};
