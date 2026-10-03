import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  Button,
  ProposalCard,
  PropertyList,
  PropertyRow,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@invana/ui';

import DATA from '../../../../fixtures/ui-extended/proposal-card.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log } from '../../../_story/variant-grid';

interface Variant {
  caption: string;
  width?: number;
  props: {
    title?: string;
    source?: string;
    flush?: boolean;
    seamless?: boolean;
    evidenceTitle?: string;
    evidenceMeta?: string;
    consequence?: string;
  };
  labelWidth: number | 'auto';
  draft: { label: string; value: string; mono?: boolean }[];
  evidence?: { columns: string[]; rows: string[][]; seamless?: boolean; density?: 'compact' };
  size: 'xs' | 'sm';
  /** `done` is what the card is stamped with once the action is taken. */
  actions: { id: string; label: string; variant?: 'outline'; done?: string }[];
}

const VARIANTS = DATA as Variant[];

interface Args {
  variant: string;
  onAction: (id: string) => void;
}

function Evidence({ evidence }: { evidence: NonNullable<Variant['evidence']> }) {
  return (
    <Table density={evidence.density} seamless={evidence.seamless}>
      <TableHeader>
        <TableRow>
          {evidence.columns.map((c) => (
            <TableHead key={c}>{c}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {evidence.rows.map((r) => (
          <TableRow key={r.join()}>
            {r.map((c, i) => (
              <TableCell key={i}>{c}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/** An action that writes stamps the card with what it made and drops the buttons. */
function Live({ v, log, onAction }: { v: Variant; log: Log; onAction: Args['onAction'] }) {
  const [done, setDone] = React.useState<string>();
  return (
    <ProposalCard
      {...v.props}
      done={done}
      evidence={v.evidence ? <Evidence evidence={v.evidence} /> : undefined}
      actions={
        done ? undefined : (
          <>
            {v.actions.map((a) => (
              <Button
                key={a.id}
                size={v.size}
                variant={a.variant}
                onClick={() => {
                  onAction(a.id);
                  log('onAction', a.id);
                  if (a.done) setDone(a.done);
                }}
              >
                {a.label}
              </Button>
            ))}
          </>
        )
      }
    >
      <PropertyList labelWidth={v.labelWidth}>
        {v.draft.map((row) => (
          <PropertyRow key={row.label} label={row.label} mono={row.mono}>
            {row.value}
          </PropertyRow>
        ))}
      </PropertyList>
    </ProposalCard>
  );
}

function call(v: Variant) {
  const p = v.props;
  const attrs = [
    p.title && `  title="${p.title}"`,
    p.source && `  source="${p.source}"`,
    p.flush && '  flush',
    p.seamless && '  seamless',
    p.evidenceTitle && `  evidenceTitle="${p.evidenceTitle}"`,
    p.evidenceMeta && `  evidenceMeta="${p.evidenceMeta}"`,
    v.evidence &&
      `  evidence={<Table${v.evidence.density ? ` density="${v.evidence.density}"` : ''}${v.evidence.seamless ? ' seamless' : ''}>{/* evidence.columns → TableHead, evidence.rows → TableRow */}</Table>}`,
    p.consequence && `  consequence="${p.consequence}"`,
    '  done={done}',
    `  actions={!done && <>${v.actions
      .map((a) => `<Button size="${v.size}"${a.variant ? ` variant="${a.variant}"` : ''} onClick={() => onAction("${a.id}")}>${a.label}</Button>`)
      .join('')}</>}`,
  ].filter(Boolean);
  return [
    '<ProposalCard',
    ...attrs,
    '>',
    `  <PropertyList labelWidth={${JSON.stringify(v.labelWidth)}}>`,
    '    {draft.map((r) => <PropertyRow key={r.label} label={r.label} mono={r.mono}>{r.value}</PropertyRow>)}',
    '  </PropertyList>',
    '</ProposalCard>',
  ].join('\n');
}

const meta = {
  title: 'UI/UI Extended/ProposalCard',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import { Button, ProposalCard, PropertyList, PropertyRow, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@invana/ui';",
            ],
            picked.map((v) => ({
              comment: v.caption,
              data: { draft: v.draft, ...(v.evidence ? { evidence: v.evidence } : {}) },
              setup: [
                '// onAction receives the action id. Once written, stamp the card with what was made.',
                'const [done, setDone] = React.useState();',
                'const onAction = (id) => publish(id).then(() => setDone("…"));',
              ].join('\n'),
              call: call(v),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onAction: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * An agent proposes; a person publishes. The draft and the evidence it rests on are shown
 * together, so the decision is made against the instances, and `consequence` says what authoring
 * writes. From `fixtures/ui-extended/proposal-card.json`. `flush` drops the draft's box under an
 * answer; `seamless` drops the evidence's box for a seamless table. Take an action: its id is
 * logged, and an action that writes stamps the card with `done`.
 */
export const ProposalCardStory: Story = {
  name: 'ProposalCard',
  render: ({ variant, onAction }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <Live v={v} log={log} onAction={onAction} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: VARIANTS[1].caption }));
    await step('Create the alert', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Create alert' }));
      await expect(args.onAction).toHaveBeenCalledWith('create-alert');
    });
    await step('The card is stamped, and the buttons are gone', async () => {
      await expect(cell.getByText('Alert created')).toBeInTheDocument();
      await expect(cell.queryByRole('button', { name: 'Create alert' })).toBeNull();
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('onAction"create-alert"');
    });
  },
};
