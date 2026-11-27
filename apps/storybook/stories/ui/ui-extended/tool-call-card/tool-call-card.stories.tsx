import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ChevronLeft, ChevronRight, Copy, X } from 'lucide-react';
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  ToolCallCard as Component,
  type ToolCallGroup,
  type ToolCallRecord,
  type ToolCallStatus,
} from '@invana/ui';

import { snippet } from '../../../_story/source';
import { VariantGrid, type Variant } from '../../../_story/variant-grid';

interface CallVariant extends Variant {
  tool: string;
  status: ToolCallStatus;
  statusLabel?: string;
  subtitle: string;
  what: { title: string; text: string; note: string };
  groups: { title: string; facts: [string, string][] }[];
  records: { title: string; body: string; code?: boolean; note?: string }[];
}

const NOTICE = 'Secrets are masked before they are stored: keys, tokens and passwords show as ••••.';

const CALLS: CallVariant[] = [
  {
    caption: 'Refused',
    width: 620,
    height: 820,
    tool: 'read_records',
    status: 'refused',
    subtitle: 'airways · Neo4j · Which airports connect to Heathrow? · today 10:42:05',
    what: {
      title: 'Refused by the guard: Route.price is outside the World',
      text: 'The assistant asked for every property of Route. The World “Airways” leaves price out, so nothing was sent to the database. It asked again without price and got 312 rows.',
      note: 'The assistant acts as you, with your role and World, and no more.',
    },
    groups: [
      {
        title: 'In the conversation',
        facts: [
          ['Turn', '1 · “Which airports connect to Heathrow?”'],
          ['Position', 'Call 3 of 8 · starts +5.3 s into the conversation'],
          ['After', 'read_records · route from LHR without price'],
        ],
      },
      {
        title: 'The call',
        facts: [
          ['Connection', 'airways · Neo4j · graph database'],
          ['Tool', 'read_records · read'],
          ['LLM', 'anthropic-main · claude-sonnet-5-5'],
          ['Tokens', '2,380 in · 74 out'],
        ],
      },
    ],
    records: [
      {
        title: 'Went in',
        code: true,
        body: '{\n  "tool": "read_records",\n  "arguments": { "label": "route", "from": "LHR", "limit": 500 }\n}',
      },
      { title: 'Policy', body: 'read · World “Airways” · analyst · excludes Route.price' },
      { title: 'Came back', code: true, body: 'denied_by_world: Route.price is outside this World' },
      { title: 'The LLM saw', body: 'Only the refusal above. No record value was sent.' },
    ],
  },
  {
    caption: 'Proposed',
    width: 620,
    height: 820,
    tool: 'propose_step',
    status: 'proposed',
    subtitle: 'Which airports connect to Heathrow? · today 10:43:09 · writes nothing until accepted',
    what: {
      title: 'Proposed adding Air.airport.hub_rank',
      text: 'The assistant laid out one step: a new integer property on airport. It sits in proposal #12 and changes nothing until a modeller accepts it.',
      note: 'You are an analyst, so accepting is a modeller’s click.',
    },
    groups: [
      {
        title: 'The proposal',
        facts: [
          ['Proposal', '#12 · 1 step'],
          ['Step 1', 'Add property Air.airport.hub_rank'],
          ['State', 'Open · waiting for a modeller'],
        ],
      },
    ],
    records: [
      { title: 'Went in', code: true, body: '{\n  "kind": "property.add",\n  "target": "Air.airport.hub_rank"\n}' },
      { title: 'Came back', code: true, body: 'proposal #12 · step 1 · open' },
    ],
  },
  {
    caption: 'Failed',
    width: 620,
    height: 640,
    tool: 'read_records',
    status: 'failed',
    statusLabel: 'Failed · timeout',
    subtitle: 'airways · Neo4j · Find duplicate airports by city · Mon 09:12:41',
    what: {
      title: 'The database did not answer within its 10 s limit',
      text: 'The query was cancelled at 10.0 s. Nothing was returned to the assistant, which stopped the turn.',
      note: 'The engine does not retry a call.',
    },
    groups: [{ title: 'The call', facts: [['Connection', 'airways · Neo4j'], ['Took', '10.0 s']] }],
    records: [
      { title: 'Went in', code: true, body: '{ "label": "airport", "group": "city" }' },
      {
        title: 'The LLM saw',
        code: true,
        body: '{"rows":[{"city":"London","count":6},{"city":"New York","count":5},{"city":"Paris","count":3},…',
        note: '412 of 5,980 characters kept',
      },
    ],
  },
];

const factsOf = (groups: CallVariant['groups']): ToolCallGroup[] =>
  groups.map((g) => ({
    title: g.title,
    facts: g.facts.map(([label, value]) => ({
      label,
      value,
      action: label === 'Connection' ? <a href="#connection">Open connection</a> : undefined,
    })),
  }));

const recordsOf = (records: CallVariant['records']): ToolCallRecord[] =>
  records.map((r) => ({
    ...r,
    action: r.note ? <a href="#all">Show all</a> : undefined,
    copy: r.code ? (
      <Button variant="ghost" size="xs">
        <Copy size={14} /> Copy
      </Button>
    ) : undefined,
  }));

interface Args {
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
}

const meta = {
  title: 'UI/UI Extended/ToolCallCard',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: ["import { ToolCallCard } from '@invana/ui';"],
          comment: 'One call, as the engine recorded it: its words are the engine’s, the card only draws them',
          data: { call: { tool: CALLS[0]!.tool, status: CALLS[0]!.status, subtitle: CALLS[0]!.subtitle, what: CALLS[0]!.what } },
          call: [
            '<ToolCallCard',
            '  {...call}',
            '  groups={groups}',
            '  records={records}',
            '  actions={<Pager onPrevious={…} onNext={…} onClose={…} />}',
            '  footer={<Button variant="outline" size="sm">Continue in assistant</Button>}',
            '/>',
          ].join('\n'),
        }),
      },
    },
  },
  args: { onPrevious: fn(), onNext: fn(), onClose: fn() },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

function Actions({ onPrevious, onNext, onClose }: Args) {
  return (
    <>
      <Button variant="ghost" size="icon-sm" aria-label="Previous call" onClick={onPrevious}>
        <ChevronLeft size={14} />
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label="Next call" onClick={onNext}>
        <ChevronRight size={14} />
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label="Close" onClick={onClose}>
        <X size={14} />
      </Button>
    </>
  );
}

/**
 * One tool call, read in full — the card behind a trace's bar and a call-log row alike.
 *
 * It says what happened first (a sentence or two, in a muted box), then where the call sits and
 * what it was, then every record the engine kept: what went in, the policy it ran under, what
 * came back and what the LLM saw. A record with a longer text carries a note and a **Show all**
 * link; code is set in the mono face on a muted ground.
 *
 * The card fills the height it is placed in, the body scrolling between a fixed header and
 * footer, so a sheet needs only a width. It draws what it is given: the status word, the facts
 * and every record are the engine's, never worked out here.
 */
export const ToolCallCard: Story = {
  render: (args) => (
    <VariantGrid variants={CALLS}>
      {(v) => (
        <div className="h-full overflow-hidden rounded-control border border-border">
          <Component
            tool={v.tool}
            status={v.status}
            statusLabel={v.statusLabel}
            subtitle={v.subtitle}
            what={v.what}
            groups={factsOf(v.groups)}
            records={recordsOf(v.records)}
            actions={<Actions {...args} />}
            footer={
              <>
                <Button variant="outline" size="sm">
                  Continue in assistant
                </Button>
                <Button variant="ghost" size="sm">
                  Show in trace
                </Button>
              </>
            }
            notice={NOTICE}
          />
        </div>
      )}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args }) => {
    const refused = within(within(canvasElement).getByRole('group', { name: 'Refused' }));
    await expect(refused.getByText('read_records')).toBeInTheDocument();
    await expect(refused.getByText('Refused')).toBeInTheDocument();
    await userEvent.click(refused.getByRole('button', { name: 'Next call' }));
    await expect(args.onNext).toHaveBeenCalledTimes(1);
    const failed = within(within(canvasElement).getByRole('group', { name: 'Failed' }));
    await expect(failed.getByText('Failed · timeout')).toBeInTheDocument();
    await expect(failed.getByRole('link', { name: 'Show all' })).toBeInTheDocument();
  },
};

/**
 * In a right-hand sheet, over the page it was opened from: the way a trace and a call log open
 * it. The arrows step through the calls of the list behind it, and Esc closes.
 */
export const InASheet: Story = {
  render: (args) => {
    const call = CALLS[0]!;
    return (
      <Sheet open modal={false} onOpenChange={() => args.onClose()}>
        <SheetContent side="right" className="w-[620px] max-w-[90vw] gap-0 p-0 sm:max-w-[620px]">
          <SheetTitle className="sr-only">{call.tool}</SheetTitle>
          <SheetDescription className="sr-only">{call.what.title}</SheetDescription>
          <Component
            tool={call.tool}
            status={call.status}
            subtitle={call.subtitle}
            what={call.what}
            groups={factsOf(call.groups)}
            records={recordsOf(call.records)}
            actions={<Actions {...args} />}
            footer={
              <Button variant="outline" size="sm">
                Continue in assistant
              </Button>
            }
            notice={NOTICE}
          />
        </SheetContent>
      </Sheet>
    );
  },
  parameters: { layout: 'fullscreen' },
};
