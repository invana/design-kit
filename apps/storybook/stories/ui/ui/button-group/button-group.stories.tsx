import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ButtonGroup as ButtonGroupRoot, ButtonGroupSeparator } from '@invana/ui';

import data from '../../../../fixtures/ui/button-group.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Variant } from '../../../_story/variant-grid';
import { ButtonFromSpec, ICONS, buttonSource, type ButtonSpec } from '../_content';

type Entry = ButtonSpec | { separator: true };

interface ButtonGroupVariant extends Variant {
  items: Entry[];
}

const VARIANTS = data as ButtonGroupVariant[];
const isSeparator = (e: Entry): e is { separator: true } => 'separator' in e;

interface Args {
  variant: string;
  onClick: (label: string) => void;
}

const meta = {
  title: 'UI/UI/ButtonGroup',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import { Button, ButtonGroup, ButtonGroupSeparator } from '@invana/ui';",
              `import { ${[...new Set(picked.flatMap((v) => v.items.flatMap((e) => (!isSeparator(e) && e.icon ? [ICONS[e.icon].displayName] : []))))].join(', ')} } from 'lucide-react';`,
            ],
            picked.map((v) => ({
              comment: v.caption,
              setup: '// Each button has its own onClick — the group only joins them.\nconst onClick = (event) => format(event.currentTarget.getAttribute("aria-label"));',
              call: [
                '<ButtonGroup>',
                ...v.items.map((e) => `  ${isSeparator(e) ? '<ButtonGroupSeparator />' : buttonSource(e)}`),
                '</ButtonGroup>',
              ].join('\n'),
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
 * Buttons joined into one control, split by a separator — from
 * `fixtures/ui/button-group.json`. Click a button: `onClick` fires and the cell writes which.
 */
export const ButtonGroup: Story = {
  render: ({ variant, onClick }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => (
        <ButtonGroupRoot aria-label="Formatting">
          {v.items.map((e, i) =>
            isSeparator(e) ? (
              <ButtonGroupSeparator key={i} />
            ) : (
              <ButtonFromSpec
                key={e.label}
                spec={e}
                onClick={() => {
                  onClick(e.label);
                  log('onClick', e.label);
                }}
              />
            ),
          )}
        </ButtonGroupRoot>
      )}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Default' }));
    await userEvent.click(cell.getByRole('button', { name: 'Italic' }));
    await expect(args.onClick).toHaveBeenCalledWith('Italic');
    await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"Italic"');
  },
};
