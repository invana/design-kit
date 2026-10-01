import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Toggle as ToggleControl } from '@invana/ui';
import { Bold, Italic, Underline } from 'lucide-react';

import data from '../../../../fixtures/ui/toggle.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Log, type Variant } from '../../../_story/variant-board';

/** JSON names an icon; the story owns the glyphs (packages ship icon-agnostic). */
const ICONS = { bold: Bold, italic: Italic, underline: Underline };
const ICON_NAMES = { bold: 'Bold', italic: 'Italic', underline: 'Underline' };

interface ToggleVariant extends Variant {
  icon: keyof typeof ICONS;
  text?: string;
  ariaLabel: string;
  pressed: boolean;
  variant?: 'default' | 'outline';
  disabled?: boolean;
}

const VARIANTS = data as ToggleVariant[];

interface Args {
  variant: string;
  onPressedChange: (pressed: boolean) => void;
}

const meta = {
  title: 'UI/UI/Toggle',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import * as React from 'react';",
              "import { Toggle } from '@invana/ui';",
              `import { ${[...new Set(picked.map((v) => ICON_NAMES[v.icon]))].join(', ')} } from 'lucide-react';`,
            ],
            picked.map((v) => ({
              comment: v.caption,
              setup: [
                `const [pressed, setPressed] = React.useState(${v.pressed});`,
                '// Called with the new state — true or false.',
                'const onPressedChange = (next: boolean) => setPressed(next);',
              ].join('\n'),
              call: jsx('Toggle', {
                'aria-label': { literal: v.ariaLabel },
                variant: v.variant ? { literal: v.variant } : undefined,
                pressed: 'pressed',
                onPressedChange: 'onPressedChange',
                disabled: v.disabled ? 'true' : undefined,
              }).replace(/ \/>$/, `>\n  <${ICON_NAMES[v.icon]} />${v.text ? `\n  ${v.text}` : ''}\n</Toggle>`),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onPressedChange: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

function LiveToggle({ v, onPressedChange, log }: { v: ToggleVariant; onPressedChange: Args['onPressedChange']; log: Log }) {
  const [pressed, setPressed] = React.useState(v.pressed);
  const Icon = ICONS[v.icon];
  return (
    <ToggleControl
      aria-label={v.ariaLabel}
      variant={v.variant}
      disabled={v.disabled}
      pressed={pressed}
      onPressedChange={(next) => {
        setPressed(next);
        onPressedChange(next);
        log('onPressedChange', next);
      }}
    >
      <Icon />
      {v.text}
    </ToggleControl>
  );
}

/**
 * A two-state button, controlled — every variant from `fixtures/ui/toggle.json`. Click it:
 * `onPressedChange` receives the new state and the story holds it.
 */
export const Toggle: Story = {
  render: ({ variant, onPressedChange }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveToggle v={v} onPressedChange={onPressedChange} log={log} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Default' }));
    await step('Press bold', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Toggle bold' }));
      await expect(args.onPressedChange).toHaveBeenCalledWith(true);
    });
    await step('The toggle stays pressed', async () => {
      await expect(cell.getByRole('button', { name: 'Toggle bold' })).toHaveAttribute('aria-pressed', 'true');
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('true');
    });
  },
};
