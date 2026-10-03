import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import {
  MetricTile,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TypographyMuted,
  type MetricTileProps,
} from '@invana/ui';
import { CitationMarker, EmissionBody, EmissionCard as EmissionCardPart, type EmissionCardProps } from '@invana/assistant';

import data from '../../../../fixtures/assistant/emission-card.json';
import { inline, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid } from '../../../_story/variant-grid';

/** What a card's body holds — one of a figure, a table, cited prose, or a muted line. */
interface Body {
  metric?: MetricTileProps;
  table?: { columns: string[]; rows: string[][] };
  prose?: { text: string; cite?: string }[];
  muted?: string;
}

interface EmissionVariant {
  caption: string;
  props: Omit<EmissionCardProps, 'children'>;
  body: Body;
}

const VARIANTS = data as unknown as EmissionVariant[];

interface Args {
  variant: string;
}

/** The body a consumer composes inside the card. */
function BodyOf({ body }: { body: Body }) {
  if (body.metric) return <MetricTile {...body.metric} />;
  if (body.table)
    return (
      <Table density="compact" seamless>
        <TableHeader>
          <TableRow>
            {body.table.columns.map((c) => (
              <TableHead key={c}>{c}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {body.table.rows.map((r) => (
            <TableRow key={r[0]}>
              {r.map((cell, i) => (
                <TableCell key={i}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  if (body.prose)
    return (
      <p>
        {body.prose.map((part, i) => (
          <span key={i}>
            {part.text}
            {part.cite ? <CitationMarker>{part.cite}</CitationMarker> : null}
          </span>
        ))}
      </p>
    );
  return <TypographyMuted>{body.muted}</TypographyMuted>;
}

/** The body as the JSX that composes it. */
function bodyCode(body: Body) {
  if (body.metric)
    return `<MetricTile\n${Object.entries(body.metric)
      .map(([k, v]) => `      ${k}="${v}"`)
      .join('\n')}\n    />`;
  if (body.table)
    return [
      '<Table density="compact" seamless>',
      `      <TableHeader><TableRow>${body.table.columns.map((c) => `<TableHead>${c}</TableHead>`).join('')}</TableRow></TableHeader>`,
      '      <TableBody>',
      ...body.table.rows.map((r) => `        <TableRow>${r.map((c) => `<TableCell>${c}</TableCell>`).join('')}</TableRow>`),
      '      </TableBody>',
      '    </Table>',
    ].join('\n');
  if (body.prose)
    return `<p>\n      ${body.prose.map((p) => `${p.text}${p.cite ? `<CitationMarker>${p.cite}</CitationMarker>` : ''}`).join('')}\n    </p>`;
  return `<TypographyMuted>${body.muted}</TypographyMuted>`;
}

const meta = {
  title: 'Assistant/Components/EmissionCard',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import { CitationMarker, EmissionBody, EmissionCard } from '@invana/assistant';",
              "import { MetricTile, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TypographyMuted } from '@invana/ui';",
            ],
            picked.map((v) => ({
              comment: v.caption,
              call: [
                `<EmissionCard ${Object.entries(v.props)
                  .map(([k, x]) => (typeof x === 'string' ? `${k}="${x}"` : `${k}={${inline(x)}}`))
                  .join(' ')}>`,
                '  <EmissionBody>',
                `    ${bodyCode(v.body)}`,
                '  </EmissionBody>',
                '</EmissionCard>',
              ].join('\n'),
            })),
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
 * Every kind is a body inside the same card (DS9): the header says what the emission is, which
 * template drew it and what it is grounded in. The reader learns one shape and then only reads
 * the body.
 */
export const EmissionCard: Story = {
  render: ({ variant }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v) => (
        <EmissionCardPart {...v.props}>
          <EmissionBody>
            <BodyOf body={v.body} />
          </EmissionBody>
        </EmissionCardPart>
      )}
    </VariantGrid>
  ),
  play: async ({ canvasElement, step }) => {
    await step('Every kind draws in the same card, with its template and citation', async () => {
      for (const v of VARIANTS) {
        const c = within(within(canvasElement).getByRole('group', { name: v.caption }));
        await expect(c.getByText(v.props.template as string)).toBeVisible();
      }
    });
  },
};
