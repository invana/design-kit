import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Settings } from 'lucide-react';
import { ButtonWithTooltip as Component, type ButtonWithTooltipProps } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/button-with-tooltip.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Variant } from '../../../_story/variant-grid';

const ICONS = { settings: Settings };
const ICON_NAMES = { settings: 'Settings' };

interface TooltipVariant extends Variant {
  icon: keyof typeof ICONS;
  props: Pick<ButtonWithTooltipProps, 'size'> & { tooltip: string; 'aria-label': string };
}

const VARIANTS = VARIANTS_JSON as TooltipVariant[];

interface Args {
  variant: string;
  onClick: () => void;
}

const meta = {
  title: 'UI/UI Extended/ButtonWithTooltip',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [`import { ${[...new Set(picked.map((v) => ICON_NAMES[v.icon]))].join(', ')} } from 'lucide-react';`, "import { ButtonWithTooltip } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              setup: '// Receives the click event.\nconst onClick = (event) => {};',
              call: `${jsx('ButtonWithTooltip', {
                tooltip: { literal: v.props.tooltip },
                size: v.props.size ? { literal: v.props.size } : undefined,
                'aria-label': { literal: v.props['aria-label'] },
                onClick: 'onClick',
              }).replace(/\n\/>$/, '\n>')}\n  <${ICON_NAMES[v.icon]} />\n</ButtonWithTooltip>`,
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onClick: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * A ghost button that reveals a tooltip on hover — pass any node as `tooltip`. An icon-only button
 * still names itself with `aria-label`: the tooltip is for the eye, not the accessible name.
 */
export const ButtonWithTooltip: Story = {
  render: ({ variant, onClick }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => {
        const Icon = ICONS[v.icon];
        return (
          <Component
            {...v.props}
            onClick={(event) => {
              onClick();
              log('onClick', event.type);
            }}
          >
            <Icon />
          </Component>
        );
      }}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Icon button' }));
    await step('Click the button', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Open settings' }));
      await expect(args.onClick).toHaveBeenCalled();
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('onClick');
    });
  },
};
