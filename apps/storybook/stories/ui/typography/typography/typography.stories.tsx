import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  MetricGrid,
  MetricTile,
  Separator,
  Typography as Type,
} from '@invana/ui';

import data from '../../../../fixtures/typography/typography.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Variant } from '../../../_story/variant-board';

/** A run of inline text: plain, code, strong, em — or a span with a class (the custom-class cell). */
type Run = string | { code: string } | { strong: string } | { em: string } | { text: string; className: string };

type TextTag = 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6' | 'P' | 'Lead' | 'Large' | 'Small' | 'Muted' | 'Blockquote' | 'Code' | 'Pre';

type Node =
  | { as: TextTag; text?: string; runs?: Run[] }
  | { as: 'List'; items: Run[][] }
  | { as: 'Separator' }
  | { as: 'Metrics'; items: { label: string; value: string }[] }
  | { as: 'Alert'; tone: 'error' | 'warning' | 'success' | 'info'; title: string; text: string; note?: string };

interface TypographyVariant extends Variant {
  nodes: Node[];
}

const VARIANTS = data as TypographyVariant[];

function Inline({ run }: { run: Run }) {
  if (typeof run === 'string') return <>{run}</>;
  if ('code' in run) return <Type.Code>{run.code}</Type.Code>;
  if ('strong' in run) return <strong>{run.strong}</strong>;
  if ('em' in run) return <em>{run.em}</em>;
  // The one custom-class cell: its subject is the class a reader adds to a run of text.
  return <span className={run.className}>{run.text}</span>;
}

const runsOf = (runs: Run[]) => runs.map((r, i) => <Inline key={i} run={r} />);

function Block({ node }: { node: Node }) {
  switch (node.as) {
    case 'List':
      return (
        <Type.List>
          {node.items.map((item, i) => (
            <li key={i}>{runsOf(item)}</li>
          ))}
        </Type.List>
      );
    case 'Separator':
      return <Separator />;
    case 'Metrics':
      return (
        <MetricGrid columns={node.items.length}>
          {node.items.map((m) => (
            <MetricTile key={m.label} label={m.label} value={m.value} variant="figure" />
          ))}
        </MetricGrid>
      );
    case 'Alert':
      return (
        <Alert variant={node.tone === 'error' ? 'destructive' : 'default'}>
          <AlertTitle>{node.title}</AlertTitle>
          <AlertDescription>
            <Type.P>{node.text}</Type.P>
            {node.note ? <Type.Small>{node.note}</Type.Small> : null}
          </AlertDescription>
        </Alert>
      );
    case 'Pre':
      return (
        <Type.Pre>
          <code>{node.text}</code>
        </Type.Pre>
      );
    default: {
      const Tag = Type[node.as];
      return <Tag>{node.runs ? runsOf(node.runs) : node.text}</Tag>;
    }
  }
}

// ── The Code tab: the same nodes, written as the JSX a consumer types ────────

const runCode = (run: Run): string => {
  if (typeof run === 'string') return run;
  if ('code' in run) return `<Typography.Code>${run.code}</Typography.Code>`;
  if ('strong' in run) return `<strong>${run.strong}</strong>`;
  if ('em' in run) return `<em>${run.em}</em>`;
  return `<span className="${run.className}">${run.text}</span>`;
};

const nodeCode = (node: Node): string => {
  switch (node.as) {
    case 'List':
      return ['<Typography.List>', ...node.items.map((i) => `  <li>${i.map(runCode).join('')}</li>`), '</Typography.List>'].join('\n');
    case 'Separator':
      return '<Separator />';
    case 'Metrics':
      return [
        `<MetricGrid columns={${node.items.length}}>`,
        ...node.items.map((m) => `  <MetricTile variant="figure" label="${m.label}" value="${m.value}" />`),
        '</MetricGrid>',
      ].join('\n');
    case 'Alert':
      return [
        `<Alert variant="${node.tone === 'error' ? 'destructive' : 'default'}">`,
        `  <AlertTitle>${node.title}</AlertTitle>`,
        '  <AlertDescription>',
        `    <Typography.P>${node.text}</Typography.P>`,
        ...(node.note ? [`    <Typography.Small>${node.note}</Typography.Small>`] : []),
        '  </AlertDescription>',
        '</Alert>',
      ].join('\n');
    case 'Pre':
      return `<Typography.Pre>\n  <code>{${JSON.stringify(node.text)}}</code>\n</Typography.Pre>`;
    default:
      return `<Typography.${node.as}>${node.runs ? node.runs.map(runCode).join('') : node.text}</Typography.${node.as}>`;
  }
};

const IMPORTS = [
  "import { Alert, AlertDescription, AlertTitle, MetricGrid, MetricTile, Separator, Typography } from '@invana/ui';",
];

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/Typography/Typography',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Typography components for consistent text styling across your application.',
      },
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            IMPORTS,
            picked.map((v) => ({
              comment: v.caption,
              call: v.nodes.length > 1 ? `<>\n${v.nodes.map((n) => nodeCode(n).replace(/^/gm, '  ')).join('\n')}\n</>` : nodeCode(v.nodes[0]),
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
 * Every `Typography.*` element, from `fixtures/typography/typography.json` — the headings, lead,
 * large, small, muted, paragraph, list, blockquote, inline code and pre, then three pages that
 * set them together. Text carries no callback, so each cell only draws.
 */
export const Typography: Story = {
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => (
        <React.Fragment>
          {v.nodes.map((n, i) => (
            <Block key={i} node={n} />
          ))}
        </React.Fragment>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const v of VARIANTS) await expect(canvas.getByRole('group', { name: v.caption })).toBeInTheDocument();
    const h1 = within(canvas.getByRole('group', { name: 'H1' }));
    await expect(h1.getByRole('heading', { level: 1 })).toHaveTextContent('Taxing Laughter');
  },
};
