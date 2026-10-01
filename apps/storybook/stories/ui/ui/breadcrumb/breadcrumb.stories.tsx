import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@invana/ui';

import data from '../../../../fixtures/ui/breadcrumb.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Variant } from '../../../_story/variant-board';

interface Crumb {
  label?: string;
  href?: string;
  /** The page the reader is on — not a link. */
  current?: boolean;
  /** Levels folded away. */
  ellipsis?: boolean;
}

interface BreadcrumbVariant extends Variant {
  items: Crumb[];
}

const VARIANTS = data as BreadcrumbVariant[];

interface Args {
  variant: string;
  onClick: (href: string) => void;
}

function crumbSource(c: Crumb) {
  if (c.ellipsis) return '<BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>';
  if (c.current) return `<BreadcrumbItem><BreadcrumbPage>${c.label}</BreadcrumbPage></BreadcrumbItem>`;
  return `<BreadcrumbItem><BreadcrumbLink href="${c.href}" onClick={onClick}>${c.label}</BreadcrumbLink></BreadcrumbItem>`;
}

const meta = {
  title: 'UI/UI/Breadcrumb',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import {\n  Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,\n} from '@invana/ui';",
            ],
            picked.map((v) => ({
              comment: v.caption,
              setup: '// A link is an <a>: onClick gets the click event — route to its href.\nconst onClick = (event) => { event.preventDefault(); navigate(event.currentTarget.getAttribute("href")); };',
              call: [
                '<Breadcrumb>',
                '  <BreadcrumbList>',
                v.items.map((c) => `    ${crumbSource(c)}`).join('\n    <BreadcrumbSeparator />\n'),
                '  </BreadcrumbList>',
                '</Breadcrumb>',
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
 * Where the reader is, level by level, with folded levels as an ellipsis — from
 * `fixtures/ui/breadcrumb.json`. Click a level: the story routes nowhere and writes the
 * `href` the consumer would navigate to.
 */
export const Breadcrumb: Story = {
  render: ({ variant, onClick }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => (
        <BreadcrumbRoot>
          <BreadcrumbList>
            {v.items.map((c, i) => (
              <React.Fragment key={i}>
                {i ? <BreadcrumbSeparator /> : null}
                <BreadcrumbItem>
                  {c.ellipsis ? (
                    <BreadcrumbEllipsis />
                  ) : c.current ? (
                    <BreadcrumbPage>{c.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      href={c.href}
                      onClick={(e) => {
                        e.preventDefault();
                        onClick(c.href!);
                        log('onClick', c.href);
                      }}
                    >
                      {c.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </BreadcrumbRoot>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Default' }));
    await userEvent.click(cell.getByRole('link', { name: 'Projects' }));
    await expect(args.onClick).toHaveBeenCalledWith('#projects');
    await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"#projects"');
  },
};
