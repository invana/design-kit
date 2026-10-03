import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { DataTable, type ColumnDef } from '@invana/tables';
import { PanelBox, cn } from '@invana/ui';

import { jsx, snippet } from '../../_story/source';
import { VariantGrid } from '../../_story/variant-grid';
import { EVALUATIONS, type Evaluation, type Verdict } from './fixtures';

/** The cell's subject is className passthrough, and its caption says so. */
const VARIANTS = [{ caption: 'With custom classes', wide: true }];

/** Each verdict's ground and its word's colour — what was stopped reads first. */
const VERDICT: Record<Verdict, { row?: string; text: string }> = {
  denied: { row: 'bg-destructive/10 hover:bg-destructive/15', text: 'text-destructive' },
  egress: { row: 'bg-destructive/5 hover:bg-destructive/10', text: 'text-destructive' },
  warn: { row: 'bg-warning/10 hover:bg-warning/15', text: 'text-warning' },
  approved: { row: 'bg-success/10 hover:bg-success/15', text: 'text-success' },
  masked: { text: 'text-data-7' },
  allow: { text: 'text-success' },
};

const HEADER_ROW = 'text-xs uppercase tracking-wider text-muted-foreground [&>th:first-child]:ps-1.5';
const ROW =
  'border-b-0 text-sm [&>td:first-child]:rounded-l [&>td:first-child]:ps-1.5 [&>td:last-child]:rounded-r [&>td:last-child]:pe-1.5';

const columns: ColumnDef<Evaluation>[] = [
  { id: 'at', accessorKey: 'at', header: 'Time', size: 72, meta: { mono: true, cellClassName: 'text-muted-foreground' } },
  {
    id: 'verdict',
    accessorKey: 'verdict',
    header: 'Verdict',
    size: 80,
    meta: { cellClassName: (e: Evaluation) => cn('font-semibold', VERDICT[e.verdict].text) },
  },
  { id: 'policy', accessorKey: 'policy', header: 'Policy', size: 140, meta: { mono: true, cellClassName: 'truncate' } },
  { id: 'sid', accessorKey: 'sid', header: 'Session', size: 52, meta: { mono: true, cellClassName: 'text-muted-foreground' } },
  { id: 'text', accessorKey: 'text', header: 'What happened', meta: { cellClassName: 'max-w-0 truncate text-base' } },
];

const meta = {
  title: 'Data Tables/Usecases/Evaluation Stream (custom classes)',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: ["import { DataTable } from '@invana/tables';", "import { PanelBox, cn } from '@invana/ui';"],
          comment: 'Every class arrives through a prop — rows from fixtures/data-tables/evaluations.json',
          data: { evaluations: EVALUATIONS.slice(0, 3), verdict: VERDICT },
          setup: [
            '// `meta.cellClassName` per column — a string, or a function of the row:',
            '// { id: "verdict", accessorKey: "verdict", meta: { cellClassName: (e) => cn("font-semibold", verdict[e.verdict].text) } }',
          ].join('\n'),
          call: [
            '<PanelBox title="Evaluation stream">',
            '  ' +
              jsx('DataTable', {
                columns: 'columns',
                data: 'evaluations',
                seamless: 'true',
                density: { literal: 'compact' },
                enableSorting: 'false',
                minWidth: '560',
                headerRowClassName: { literal: HEADER_ROW },
                rowClassName: `(e) => cn("${ROW}", verdict[e.verdict].row)`,
              }).replace(/\n/g, '\n  '),
            '</PanelBox>',
          ].join('\n'),
        }),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/**
 * Board 5 · Governance's evaluation stream, drawn entirely by the caller — this story's subject
 * is className passthrough, so it keeps its classes. Denials, egress and warnings travel one by
 * one, newest first. `rowClassName` tints each row by its verdict and rounds it into a pill with
 * no rules between; `meta.cellClassName` colours the verdict word by row and sets the mono time,
 * policy and session; `headerRowClassName` sets the caps header, in line with the rows' padded
 * first cell. The table takes no callback here, so nothing is logged.
 */
export const EvaluationStreamCustomClasses: Story = {
  name: 'Evaluation Stream (custom classes)',
  render: () => (
    <VariantGrid variants={VARIANTS}>
      {() => (
        <PanelBox title="Evaluation stream" aside="denials, egress and warnings travel one by one; routine allows are summed above">
          <DataTable
            columns={columns}
            data={EVALUATIONS}
            seamless
            density="compact"
            enableSorting={false}
            minWidth={560}
            headerRowClassName={HEADER_ROW}
            rowClassName={(e) => cn(ROW, VERDICT[e.verdict].row)}
          />
        </PanelBox>
      )}
    </VariantGrid>
  ),
  play: async ({ canvasElement }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'With custom classes' }));
    await expect(cell.getAllByRole('row')).toHaveLength(EVALUATIONS.length + 1);
    await expect(cell.getAllByText('denied')[0]!.closest('td')).toHaveClass('font-semibold');
  },
};
