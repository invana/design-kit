import type * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  Badge,
  Link,
  PanelBox,
  StatusDot,
  TimelineEntry,
  TimelineFooter,
  TimelineList,
  TypographyMuted,
  type StatusDotProps,
} from '@invana/ui';

import VARIANTS from '../../../../fixtures/ui-extended/timeline-list.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log } from '../../../_story/variant-grid';

type Variant = (typeof VARIANTS)[number];
type Tone = StatusDotProps['tone'];

/** One dated event, as the fixture holds it — a title, a line of text, or a link. */
interface Entry {
  when: string;
  tone?: string;
  title?: string;
  text?: string;
  detail?: string;
  link?: string;
  badge?: { label: string; tone: string };
  /** The smaller events it breaks into, drawn under it once it is opened. */
  entries?: Entry[];
  open?: boolean;
}

interface Args {
  variant: string;
  onOpen: (title: string) => void;
  onOpenChange: (entry: string, open: boolean) => void;
}

const IMPORTS = [
  "import { Badge, Link, PanelBox, StatusDot, TimelineEntry, TimelineFooter, TimelineList, TypographyMuted } from '@invana/ui';",
];

function code(v: Variant) {
  const size = v.variant === 'compact' ? ' size="md"' : '';
  if ((v.entries as Entry[]).some((e) => e.entries))
    return [
      '// An entry with `entries` opens into them — the same call, one level down.',
      'const entry = (e) => (',
      `  <TimelineEntry key={e.when + e.text} when={e.when} marker={<StatusDot tone={e.tone}${size} />}`,
      '    nested={e.entries?.map(entry)} defaultOpen={e.open} onOpenChange={(open) => onOpenChange(e.text, open)}>',
      '    {e.text}',
      '  </TimelineEntry>',
      ');',
      `<TimelineList variant="${v.variant}">{entries.map(entry)}</TimelineList>`,
    ].join('\n');
  if (v.variant === 'rail')
    return [
      `<PanelBox title="${v.heading}">`,
      '  <TimelineList variant="rail">',
      '    {entries.map((e) => (',
      '      <TimelineEntry key={e.link} when={e.when} marker={<StatusDot tone={e.tone} />}',
      '        title={<Link href="#" variant="quiet" onClick={() => onOpen(e.link)}>{e.link}</Link>} />',
      '    ))}',
      `    <TimelineFooter><Link href="#" variant="quiet" onClick={() => onOpen("${v.footer}")}>${v.footer}</Link></TimelineFooter>`,
      '  </TimelineList>',
      '</PanelBox>',
    ].join('\n');
  return [
    `<TimelineList variant="${v.variant}">`,
    '  {entries.map((e) => (',
    `    <TimelineEntry key={e.when} when={e.when} marker={<StatusDot tone={e.tone}${size} />} title={e.title}>`,
    v.variant === 'compact'
      ? '      {e.text}'
      : '      <TypographyMuted>{e.detail}</TypographyMuted>\n      {e.badge && <Badge variant="outline" size="xs" tone={e.badge.tone}>{e.badge.label}</Badge>}',
    '    </TimelineEntry>',
    '  ))}',
    '</TimelineList>',
  ].join('\n');
}

const meta = {
  title: 'UI/UI Extended/TimelineList',
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
              data: { entries: v.entries },
              setup:
                v.variant === 'rail'
                  ? '// onOpen receives the entry\'s title; the consumer navigates to it.\nconst onOpen = (title) => { /* "MAI-Code-1-Flash deprecated" */ };'
                  : undefined,
              call: code(v),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onOpen: fn(), onOpenChange: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

function Draw({ v, log, onOpen, onOpenChange }: { v: Variant; log: Log; onOpen: Args['onOpen']; onOpenChange: Args['onOpenChange'] }) {
  const open = (title: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onOpen(title);
    log('onClick', title);
  };
  const dotSize = v.variant === 'compact' ? 'md' : undefined;
  const entry = (e: Entry) => (
    <TimelineEntry
      key={e.when + (e.text ?? e.title ?? e.link)}
      when={e.when}
      marker={<StatusDot tone={e.tone as Tone} size={dotSize} />}
      nested={e.entries?.map(entry)}
      defaultOpen={e.open}
      onOpenChange={(open) => {
        onOpenChange(e.text ?? '', open);
        log('onOpenChange', { entry: e.text, open });
      }}
      title={
        e.link ? (
          <Link href="#" variant="quiet" onClick={open(e.link)}>
            {e.link}
          </Link>
        ) : (
          e.title
        )
      }
    >
      {e.text}
      {e.detail ? <TypographyMuted>{e.detail}</TypographyMuted> : null}
      {e.badge ? (
        <Badge variant="outline" size="xs" tone={e.badge.tone as 'info'}>
          {e.badge.label}
        </Badge>
      ) : null}
    </TimelineEntry>
  );
  const list = (
    <TimelineList variant={v.variant as 'columns' | 'compact' | 'rail'}>
      {(v.entries as Entry[]).map(entry)}
      {v.footer ? (
        <TimelineFooter>
          <Link href="#" variant="quiet" onClick={open(v.footer)}>
            {v.footer}
          </Link>
        </TimelineFooter>
      ) : null}
    </TimelineList>
  );
  return v.heading ? <PanelBox title={v.heading}>{list}</PanelBox> : list;
}

/**
 * Dated events, in the three shapes a timeline takes — from
 * `fixtures/ui-extended/timeline-list.json`. `columns` makes `when` a column, so "what changed
 * on Friday" reads down one edge; `compact` sets when, marker and text on one line for a few
 * events inside an answer; `rail` puts `when` above the title with a line threading the markers,
 * for a narrow card. Click a rail entry: the link is logged with its title. An entry with `nested`
 * entries opens into them with a chevron, in the same variant — a customs hold into its steps.
 */
export const TimelineListStory: Story = {
  name: 'TimelineList',
  render: ({ variant, onOpen, onOpenChange }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <Draw v={v} log={log} onOpen={onOpen} onOpenChange={onOpenChange} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    for (const v of VARIANTS) await expect(canvas.getByRole('group', { name: v.caption })).toBeInTheDocument();
    const cell = within(canvas.getByRole('group', { name: VARIANTS[2].caption }));
    await step('Open a changelog entry', async () => {
      await userEvent.click(cell.getByRole('link', { name: 'MAI-Code-1-Flash deprecated' }));
      await expect(args.onOpen).toHaveBeenCalledWith('MAI-Code-1-Flash deprecated');
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"MAI-Code-1-Flash deprecated"');
    });
    const nested = within(canvas.getByRole('group', { name: VARIANTS[3].caption }));
    await step('Close the hold: its steps go', async () => {
      await expect(nested.getByText('Released')).toBeInTheDocument();
      await userEvent.click(nested.getByRole('button', { name: 'Close Held at customs · 3 days' }));
      await expect(args.onOpenChange).toHaveBeenCalledWith('Held at customs · 3 days', false);
      await expect(nested.queryByText('Released')).toBeNull();
    });
  },
};
