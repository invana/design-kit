import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { PropertyList, PropertyRow } from '@invana/ui';

import data from '../../../../fixtures/ui/button.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Variant } from '../../../_story/variant-grid';
import { ButtonFromSpec, ICONS, buttonSource, spaced, type ButtonSpec } from '../_content';

interface GlassButton extends ButtonSpec {
  /** `data-glass` on this button alone. */
  glass?: boolean;
}

interface ButtonVariant extends Variant {
  rows: GlassButton[][];
  /** What each size is for. */
  legend?: { label: string; value: string }[];
  /** `data-glass` on the container: every button inside turns translucent. */
  glass?: 'scope';
}

const VARIANTS = data as ButtonVariant[];

interface Args {
  variant: string;
  onClick: (label: string) => void;
}

function call(v: ButtonVariant) {
  const buttons = v.rows
    .flat()
    .map((b) => buttonSource(b).replace('<Button ', b.glass ? '<Button data-glass="true" ' : '<Button '));
  return v.glass ? ['<div data-glass="true">', ...buttons.map((b) => `  ${b}`), '</div>'].join('\n') : buttons.join('\n');
}

const meta = {
  title: 'UI/UI/Button',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) => {
          const icons = [...new Set(picked.flatMap((v) => v.rows.flat().flatMap((b) => [b.icon, b.iconEnd])))]
            .filter((i): i is keyof typeof ICONS => !!i)
            .map((i) => ICONS[i].displayName);
          return snippets(
            [
              "import { Button } from '@invana/ui';",
              ...(icons.length ? [`import { ${icons.join(', ')} } from 'lucide-react';`] : []),
            ],
            picked.map((v, i) => ({
              comment: v.caption,
              setup: i ? undefined : '// onClick receives the click event.\nconst onClick = (event) => save();',
              call: call(v),
            })),
          );
        }),
      },
    },
  },
  args: { variant: 'All', onClick: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * Every treatment and size on the control scale, with an icon, icon-only, disabled, and glass
 * — a mode, not a variant: `data-glass="true"` on a container or one button turns it
 * translucent and blurred over whatever is behind it. From `fixtures/ui/button.json`. Click
 * any button: `onClick` fires and the cell writes which.
 */
export const Button: Story = {
  render: ({ variant, onClick }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => {
        const rows = v.rows.map((row, i) => (
          <div key={i}>
            {spaced(
              row.map((b) => (
                <ButtonFromSpec
                  key={b.label}
                  spec={b}
                  data-glass={b.glass ? 'true' : undefined}
                  onClick={() => {
                    onClick(b.label);
                    log('onClick', b.label);
                  }}
                />
              )),
            )}
          </div>
        ));
        return (
          <>
            {v.glass ? <div data-glass="true">{rows}</div> : rows}
            {v.legend ? (
              <PropertyList labelWidth="auto">
                {v.legend.map((l) => (
                  <PropertyRow key={l.label} label={l.label}>
                    {l.value}
                  </PropertyRow>
                ))}
              </PropertyList>
            ) : null}
          </>
        );
      }}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('Click a button', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Default' }));
      await userEvent.click(cell.getByRole('button', { name: 'Button' }));
      await expect(args.onClick).toHaveBeenCalledWith('Button');
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"Button"');
    });
    await step('An icon-only button is named by its label', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Icon' }));
      await userEvent.click(cell.getByRole('button', { name: 'Launch' }));
      await expect(args.onClick).toHaveBeenCalledWith('Launch');
    });
    await step('A disabled button cannot be pressed', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Disabled' }));
      await expect(cell.getByRole('button', { name: 'Disabled button' })).toBeDisabled();
    });
  },
};
