import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Bot, User } from 'lucide-react';
import { AgentChip as Component, PropertyList, PropertyRow, type AgentChipProps } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/agent-chip.json';
import { inline, jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Variant } from '../../../_story/variant-board';

/** Icons JSON names by key; the kit ships icon-agnostic, so the story supplies them. */
const ICONS = { bot: Bot, user: User };
const ICON_NAMES = { bot: 'Bot', user: 'User' };

interface Chip {
  props: Pick<AgentChipProps, 'kind' | 'inactive'> & { name: string };
  icon: keyof typeof ICONS;
  note: string;
}

interface AgentVariant extends Variant {
  chips: Chip[];
}

const VARIANTS = VARIANTS_JSON as AgentVariant[];

const attrs = (props: object) =>
  Object.fromEntries(Object.entries(props).map(([k, v]) => [k, typeof v === 'string' ? { literal: v } : inline(v)]));

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI Extended/AgentChip',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { Bot, User } from 'lucide-react';", "import { AgentChip } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              call: v.chips
                .map((c) => jsx('AgentChip', { icon: `<${ICON_NAMES[c.icon]} />`, ...attrs(c.props) }))
                .join('\n'),
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
 * Identity, not status — so it takes no tone and no colour. Agents are told apart by name; the
 * only distinction drawn is agent vs person. An inactive agent stays drawn, muted: a retired agent
 * is still in the lineage of everything it touched.
 */
export const AgentChip: Story = {
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => (
        <PropertyList labelWidth={140}>
          {v.chips.map((c) => {
            const Icon = ICONS[c.icon];
            return (
              <PropertyRow key={c.props.name} label={<Component icon={<Icon />} {...c.props} />}>
                {c.note}
              </PropertyRow>
            );
          })}
        </PropertyList>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const v of VARIANTS) {
      const cell = within(canvas.getByRole('group', { name: v.caption }));
      for (const c of v.chips) await expect(cell.getByText(c.props.name)).toBeInTheDocument();
    }
  },
};
