import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Link as LinkPart, TypographyP } from '@invana/ui';

import data from '../../../../fixtures/ui/link.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Variant } from '../../../_story/variant-grid';

interface LinkSpec {
  text: string;
  href: string;
  variant?: 'default' | 'underlined' | 'quiet';
  external?: boolean;
}

interface LinkVariant extends Variant {
  /** The sentence, in order: plain text, or a link. */
  parts: (string | LinkSpec)[];
}

const VARIANTS = data as LinkVariant[];

interface Args {
  variant: string;
  onClick: (link: { text: string; href: string }) => void;
}

const linkCode = (l: LinkSpec) =>
  `<Link href="${l.href}"${l.variant ? ` variant="${l.variant}"` : ''}${l.external ? ' external' : ''} onClick={onClick}>${l.text}</Link>`;

const meta = {
  title: 'UI/UI/Link',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { Link, TypographyP } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              setup: '// Called with the click event; a router would navigate here.\nconst onClick = (e: React.MouseEvent<HTMLAnchorElement>) => { /* e.currentTarget.href */ };',
              call: [
                '<TypographyP>',
                ...v.parts.map((p) => `  ${typeof p === 'string' ? `{${JSON.stringify(p)}}` : linkCode(p)}`),
                '</TypographyP>',
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
 * A link in the sentence it belongs to — it takes the size of the text around it, so there is
 * nothing to show it at except inside one. Every variant from `fixtures/ui/link.json`. Clicking a
 * link logs `onClick` with its text and href; the story keeps the page where it is.
 */
export const Link: Story = {
  render: ({ variant, onClick }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => (
        <TypographyP>
          {v.parts.map((p, i) =>
            typeof p === 'string' ? (
              p
            ) : (
              <LinkPart
                key={i}
                href={p.href}
                variant={p.variant}
                external={p.external}
                onClick={(e) => {
                  e.preventDefault();
                  const payload = { text: p.text, href: p.href };
                  onClick(payload);
                  log('onClick', payload);
                }}
              >
                {p.text}
              </LinkPart>
            ),
          )}
        </TypographyP>
      )}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'External' }));
    await step('An external link opens in a new tab', async () => {
      await expect(cell.getByRole('link', { name: /invana\.io/ })).toHaveAttribute('target', '_blank');
    });
    await step('Click it', async () => {
      await userEvent.click(cell.getByRole('link', { name: /invana\.io/ }));
      await expect(args.onClick).toHaveBeenCalledWith({ text: 'invana.io', href: 'https://invana.io' });
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"href": "https://invana.io"');
    });
  },
};
