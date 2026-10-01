import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import {
  Badge,
  MetricGrid,
  MetricTile,
  PanelBox,
  PropertyList,
  PropertyRow,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@invana/ui';

import VARIANTS from '../../../../fixtures/ui-extended/panel-box.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard } from '../../../_story/variant-board';

type Variant = (typeof VARIANTS)[number];

interface Args {
  variant: string;
}

const IMPORTS = [
  "import { Badge, MetricGrid, MetricTile, PanelBox, PropertyList, PropertyRow } from '@invana/ui';",
  "import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@invana/ui';",
];

/** The box's opening tag, as a consumer writes it. */
function open(v: Variant) {
  const attrs = [
    v.title ? `title="${v.title}"` : '',
    v.aside ? `aside="${v.aside}"` : '',
    v.badge ? `aside={<Badge variant="outline">${v.badge}</Badge>}` : '',
    v.flush ? 'flush' : '',
  ].filter(Boolean);
  return `<PanelBox${attrs.length ? ' ' + attrs.join(' ') : ''}>`;
}

function body(v: Variant) {
  if (v.properties)
    return [
      '<PropertyList labelWidth={108}>',
      '  {properties.map((p) => <PropertyRow key={p.label} label={p.label}>{p.value}</PropertyRow>)}',
      '</PropertyList>',
    ];
  if (v.table)
    return [
      '<Table>',
      '  <TableHeader><TableRow>{table.columns.map((c) => <TableHead key={c}>{c}</TableHead>)}</TableRow></TableHeader>',
      '  <TableBody>',
      '    {table.rows.map((r) => <TableRow key={r[0]}>{r.map((c, i) => <TableCell key={i}>{c}</TableCell>)}</TableRow>)}',
      '  </TableBody>',
      '</Table>',
    ];
  return [
    '<MetricGrid joined seamless minTileWidth={150}>',
    '  {metrics.map((m) => <MetricTile key={m.label} variant="figure" {...m} />)}',
    '</MetricGrid>',
  ];
}

const meta = {
  title: 'UI/UI Extended/PanelBox',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            IMPORTS,
            picked.map((v) => ({
              comment: v.caption,
              data: v.properties ? { properties: v.properties } : v.table ? { table: v.table } : { metrics: v.metrics },
              call: [open(v), ...body(v).map((l) => '  ' + l), '</PanelBox>'].join('\n'),
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

function Body({ v }: { v: Variant }) {
  if (v.properties)
    return (
      <PropertyList labelWidth={108}>
        {v.properties.map((p) => (
          <PropertyRow key={p.label} label={p.label}>
            {p.value}
          </PropertyRow>
        ))}
      </PropertyList>
    );
  if (v.table)
    return (
      <Table>
        <TableHeader>
          <TableRow>
            {v.table.columns.map((c) => (
              <TableHead key={c}>{c}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {v.table.rows.map((r) => (
            <TableRow key={r[0]}>
              {r.map((c, i) => (
                <TableCell key={i}>{c}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  return (
    <MetricGrid joined seamless minTileWidth={150}>
      {v.metrics?.map((m) => (
        <MetricTile key={m.label} variant="figure" {...m} />
      ))}
    </MetricGrid>
  );
}

/**
 * One band of a dashboard, from `fixtures/ui-extended/panel-box.json`. The column scrolls; a band
 * never does. `aside` is the fact on the right — a count, a provenance note, a badge — never a
 * toolbar (a band that wants icon buttons is a panel, `PanelContent`). `flush` drops the body
 * padding so a table's header rule meets the border. With no `title` there is no label bar: the
 * box frames a seamless strip of figures as an answer card does.
 */
export const PanelBoxStory: Story = {
  name: 'PanelBox',
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => (
        <PanelBox
          title={v.title}
          aside={v.badge ? <Badge variant="outline">{v.badge}</Badge> : v.aside}
          flush={v.flush}
        >
          <Body v={v} />
        </PanelBox>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const v of VARIANTS) await expect(canvas.getByRole('group', { name: v.caption })).toBeInTheDocument();
    await expect(within(canvas.getByRole('group', { name: VARIANTS[2].caption })).getByRole('table')).toBeInTheDocument();
  },
};
