import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import {
  Table as TablePart,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@invana/ui';

import data from '../../../../fixtures/ui/table.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Variant } from '../../../_story/variant-grid';

interface TableData {
  caption?: string;
  density?: 'compact' | 'default' | 'comfortable';
  seamless?: boolean;
  columns: string[];
  rows: string[][];
}

interface TableVariant extends Variant {
  tables: TableData[];
}

const VARIANTS = data as TableVariant[];

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI/Table',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@invana/ui';"],
            picked.flatMap((v) =>
              v.tables.map((t) => ({
                comment: v.caption,
                data: { columns: t.columns, rows: t.rows },
                call: [
                  `<Table${t.density ? ` density="${t.density}"` : ''}${t.seamless ? ' seamless' : ''}>`,
                  t.caption ? `  <TableCaption>${t.caption}</TableCaption>` : null,
                  '  <TableHeader>',
                  '    <TableRow>{columns.map((c) => <TableHead key={c}>{c}</TableHead>)}</TableRow>',
                  '  </TableHeader>',
                  '  <TableBody>',
                  '    {rows.map((r) => (',
                  '      <TableRow key={r[0]}>{r.map((c, i) => <TableCell key={i}>{c}</TableCell>)}</TableRow>',
                  '    ))}',
                  '  </TableBody>',
                  '</Table>',
                ]
                  .filter(Boolean)
                  .join('\n'),
              })),
            ),
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
 * The table primitive — every variant from `fixtures/ui/table.json`. One `density` per table,
 * never a size per cell; `seamless` for a table whose card or panel already frames it. No
 * callbacks (rows that sort or select are `DataTable`); the play checks every cell drew.
 */
export const Table: Story = {
  render: ({ variant }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v) =>
        v.tables.map((t, i) => (
          <TablePart key={i} density={t.density} seamless={t.seamless}>
            {t.caption ? <TableCaption>{t.caption}</TableCaption> : null}
            <TableHeader>
              <TableRow>
                {t.columns.map((c) => (
                  <TableHead key={c}>{c}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {t.rows.map((r) => (
                <TableRow key={r[0]}>
                  {r.map((c, j) => (
                    <TableCell key={j}>{c}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </TablePart>
        ))
      }
    </VariantGrid>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const v of VARIANTS) await expect(canvas.getByRole('group', { name: v.caption })).toBeInTheDocument();
    const def = within(canvas.getByRole('group', { name: 'Default' }));
    await expect(def.getAllByRole('row')).toHaveLength(5);
    await expect(def.getByText('A list of users')).toBeInTheDocument();
    await expect(within(canvas.getByRole('group', { name: 'Empty' })).getAllByRole('row')).toHaveLength(1);
  },
};
