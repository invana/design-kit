import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  Pagination as PaginationNav,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@invana/ui';

import data from '../../../../fixtures/ui/pagination.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../../_story/variant-grid';

interface PaginationVariant extends Variant {
  /** The page shown first, from 1. */
  page: number;
  pages: number;
}

const VARIANTS = data as PaginationVariant[];

interface Args {
  variant: string;
  onPageChange: (page: number) => void;
}

/** The numbered links around `page`: the one before, it, the one after — clamped to the range. */
function pageWindow(page: number, pages: number) {
  const first = Math.max(1, Math.min(page - 1, pages - 2));
  return Array.from({ length: Math.min(3, pages) }, (_, i) => first + i);
}

const meta = {
  title: 'UI/UI/Pagination',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import * as React from 'react';",
              "import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@invana/ui';",
            ],
            picked.map((v) => ({
              comment: v.caption,
              data: { pages: v.pages },
              setup: [
                `const [page, setPage] = React.useState(${v.page});`,
                '// Called with the page a link points at — 1 to `pages`.',
                'const go = (to: number) => (e: React.MouseEvent) => { e.preventDefault(); setPage(to); };',
                '// The page before, this one, the one after — clamped to the range.',
                'const first = Math.max(1, Math.min(page - 1, pages - 2));',
                'const shown = Array.from({ length: Math.min(3, pages) }, (_, i) => first + i);',
              ].join('\n'),
              call: [
                '<Pagination>',
                '  <PaginationContent>',
                '    {page > 1 && <PaginationItem><PaginationPrevious href="#" size="default" onClick={go(page - 1)} /></PaginationItem>}',
                '    {shown.map((n) => (',
                '      <PaginationItem key={n}>',
                '        <PaginationLink href="#" size="icon" isActive={n === page} onClick={go(n)}>{n}</PaginationLink>',
                '      </PaginationItem>',
                '    ))}',
                '    {shown[shown.length - 1] < pages && <PaginationItem><PaginationEllipsis /></PaginationItem>}',
                '    {page < pages && <PaginationItem><PaginationNext href="#" size="default" onClick={go(page + 1)} /></PaginationItem>}',
                '  </PaginationContent>',
                '</Pagination>',
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onPageChange: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

function LivePagination({ v, onPageChange, log }: { v: PaginationVariant; onPageChange: Args['onPageChange']; log: Log }) {
  const [page, setPage] = React.useState(v.page);
  const go = (to: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    setPage(to);
    onPageChange(to);
    log('onPageChange', to);
  };
  const shown = pageWindow(page, v.pages);
  return (
    <PaginationNav>
      <PaginationContent>
        {page > 1 ? (
          <PaginationItem>
            <PaginationPrevious href="#" size="default" onClick={go(page - 1)} />
          </PaginationItem>
        ) : null}
        {shown.map((n) => (
          <PaginationItem key={n}>
            <PaginationLink href="#" size="icon" isActive={n === page} onClick={go(n)}>
              {n}
            </PaginationLink>
          </PaginationItem>
        ))}
        {shown[shown.length - 1] < v.pages ? (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        ) : null}
        {page < v.pages ? (
          <PaginationItem>
            <PaginationNext href="#" size="default" onClick={go(page + 1)} />
          </PaginationItem>
        ) : null}
      </PaginationContent>
    </PaginationNav>
  );
}

/**
 * Pages of a list, controlled — from `fixtures/ui/pagination.json`. Click a number, Previous or
 * Next: the story logs the page it points at and moves there, so the active link and the window
 * of numbers follow.
 */
export const Pagination: Story = {
  render: ({ variant, onPageChange }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <LivePagination v={v} onPageChange={onPageChange} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Default' }));
    await step('Go to the next page', async () => {
      await userEvent.click(cell.getByRole('link', { name: 'Go to next page' }));
      await expect(args.onPageChange).toHaveBeenCalledWith(3);
    });
    await step('Page 3 is now the current one', async () => {
      await expect(cell.getByRole('link', { name: '3' })).toHaveAttribute('aria-current', 'page');
      await expect(cell.getByRole('link', { name: '4' })).toBeInTheDocument();
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('onPageChange3');
    });
  },
};
