import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button, Kbd, Link, PanelBox } from '@invana/ui';

import data from '../../../fixtures/others/corner-hint.json';
import { snippets, sourceFor, variantArg } from '../../_story/source';
import { VariantGrid, type Variant } from '../../_story/variant-grid';

interface HintVariant extends Variant {
  buttons?: { label: string; kbd: string; hint: boolean }[];
  links?: string[];
}

const VARIANTS = data as HintVariant[];

interface Args {
  variant: string;
  onClick: (label: string) => void;
}

const meta = {
  title: 'Others/CornerHint',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { Button, Kbd, Link, PanelBox } from '@invana/ui';"],
            picked.map((v) =>
              v.buttons
                ? {
                    comment: v.caption,
                    call: v.buttons
                      .map(
                        (b) =>
                          `<Button variant="outline"${b.hint ? ' className="corner-hint"' : ''} onClick={onClick}>\n  ${b.label}\n  <Kbd>${b.kbd}</Kbd>\n</Button>`,
                      )
                      .join('\n'),
                  }
                : {
                    comment: v.caption,
                    data: { links: v.links },
                    call: [
                      '<PanelBox>',
                      '  {links.map((label) => (',
                      '    <Link key={label} href="#" variant="quiet" className="corner-hint block" onClick={onClick}>',
                      '      {label}',
                      '    </Link>',
                      '  ))}',
                      '</PanelBox>',
                    ].join('\n'),
                  },
            ),
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
 * `corner-hint` is a plain CSS utility class (from `@invana/styling`) — drop it on any element,
 * no wrapper component required. Brackets float just outside the box and fade in on hover or
 * focus, standing in for a solid highlight. Both cells' subject *is* the class, so it is the one
 * class these stories set; their data is `fixtures/others/corner-hint.json`.
 */
export const CornerHint: Story = {
  render: ({ variant, onClick }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => {
        const click = (label: string) => (e: React.MouseEvent) => {
          e.preventDefault();
          onClick(label);
          log('onClick', label);
        };
        if (v.buttons)
          return (
            // An unstyled wrapper: the buttons keep their own width, side by side.
            <div>
              {v.buttons.map((b, i) => (
                <React.Fragment key={b.label}>
                  {i > 0 ? ' ' : null}
                  <Button variant="outline" className={b.hint ? 'corner-hint' : undefined} onClick={click(b.label)}>
                    {b.label}
                    <Kbd>{b.kbd}</Kbd>
                  </Button>
                </React.Fragment>
              ))}
            </div>
          );
        return (
          <PanelBox>
            {v.links!.map((label) => (
              <Link key={label} href="#" variant="quiet" className="corner-hint block" onClick={click(label)}>
                {label}
              </Link>
            ))}
          </PanelBox>
        );
      }}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const cell = within(canvas.getByRole('group', { name: 'List anchor — with the corner-hint class' }));
    await userEvent.click(cell.getByRole('link', { name: 'Set up Evals' }));
    await expect(args.onClick).toHaveBeenCalledWith('Set up Evals');
    await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"Set up Evals"');
    const buttons = within(canvas.getByRole('group', { name: 'Button shortcut — with the corner-hint class' }));
    await expect(buttons.getByRole('button', { name: /Get Demo/ })).toHaveClass('corner-hint');
  },
};
