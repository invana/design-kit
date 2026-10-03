import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Terminal, TerminalLine, type TerminalLineKind, type TerminalLevel } from '@invana/ui';

import DATA from '../../../../fixtures/ui-extended/terminal.json';
import { ReplayFrame, useReplay } from '../../../_story/replay';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid } from '../../../_story/variant-grid';

interface Line {
  kind?: TerminalLineKind;
  text?: string;
  columns?: string[];
}

interface TerminalVariant {
  caption: string;
  wide?: boolean;
  live?: boolean;
  cursor?: boolean;
  lines?: Line[];
  columnTemplate?: string;
  /** `[time, level, task, message]` — a run's log line as the engine writes it. */
  log?: [string, TerminalLevel, string, string][];
}

const VARIANTS = DATA as TerminalVariant[];

function LogLines({ log }: { log: NonNullable<TerminalVariant['log']> }) {
  return log.map(([time, level, task, message]) => (
    <TerminalLine key={time + task} level={level} columns={[time, level.toUpperCase(), task, message]} />
  ));
}

function Draw({ v }: { v: TerminalVariant }) {
  return (
    <Terminal cursor={v.cursor} columnTemplate={v.columnTemplate}>
      {v.log ? (
        <LogLines log={v.log} />
      ) : (
        v.lines?.map((l, i) => (
          <TerminalLine key={i} kind={l.kind} columns={l.columns}>
            {l.text}
          </TerminalLine>
        ))
      )}
    </Terminal>
  );
}

/** The log arriving a line at a time; the cursor blinks while the run is still writing. */
function Live({ v }: { v: TerminalVariant }) {
  const log = v.log ?? [];
  const replay = useReplay(log.length, { every: 500 });
  return (
    <ReplayFrame replay={replay} noun="line" width={720}>
      <Terminal cursor={!replay.done} columnTemplate={v.columnTemplate}>
        <LogLines log={log.slice(0, replay.at)} />
      </Terminal>
    </ReplayFrame>
  );
}

function source(v: TerminalVariant) {
  const template = v.columnTemplate ? ` columnTemplate="${v.columnTemplate}"` : '';
  if (v.log) {
    return {
      comment: v.caption,
      data: v.live ? { initial: v.log.slice(0, 2) } : { log: v.log },
      setup: v.live
        ? '// Append each line as the run writes it; the cursor says the run is still writing.\nconst [log, setLog] = React.useState(initial);\nReact.useEffect(() => run.subscribeLog((line) => setLog((l) => [...l, line])), []);'
        : undefined,
      call: [
        `<Terminal${v.live ? ' cursor={!done}' : ''}${template}>`,
        '  {log.map(([time, level, task, message]) => (',
        '    <TerminalLine key={time + task} level={level} columns={[time, level.toUpperCase(), task, message]} />',
        '  ))}',
        '</Terminal>',
      ].join('\n'),
    };
  }
  return {
    comment: v.caption,
    call: [
      `<Terminal${v.cursor ? ' cursor' : ''}${template}>`,
      ...(v.lines ?? []).map((l) => {
        const kind = l.kind ? ` kind="${l.kind}"` : '';
        return l.columns
          ? `  <TerminalLine${kind} columns={${JSON.stringify(l.columns)}} />`
          : `  <TerminalLine${kind}>${l.text}</TerminalLine>`;
      }),
      '</Terminal>',
    ].join('\n'),
  };
}

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI Extended/Terminal',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(["import { Terminal, TerminalLine } from '@invana/ui';"], picked.map(source)),
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
 * A transcript, from `fixtures/ui-extended/terminal.json`: a CLI hand-off shown honestly rather
 * than redrawn as a wizard, and the same component carrying a **run's log**. `level` tints exactly
 * one cell — the one `levelColumn` names, `1` by default — never the message, and the level
 * **word** stays in `columns`, so colour is never the carrier. The live cell streams the log a line
 * at a time, with the cursor on while the run is still writing.
 */
export const TerminalStory: Story = {
  name: 'Terminal',
  render: ({ variant }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v) => (v.live ? <Live v={v} /> : <Draw v={v} />)}
    </VariantGrid>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Every variant draws', async () => {
      for (const v of VARIANTS) await expect(canvas.getByRole('group', { name: v.caption })).toBeInTheDocument();
    });
    const live = within(canvas.getByRole('group', { name: 'Live — the log as it streams' }));
    await step('The log streams, then ends on its last line', async () => {
      await waitFor(() => expect(live.getByText('check_bundle')).toBeInTheDocument(), { timeout: 3000 });
      await userEvent.click(live.getByRole('button', { name: 'Skip to end' }));
      await expect(live.getByText('47 rejections, 3 reasons · done')).toBeInTheDocument();
    });
  },
};
