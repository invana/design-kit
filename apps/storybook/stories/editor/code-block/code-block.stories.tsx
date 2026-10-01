import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { CodeBlock, type CodeBlockProps } from '@invana/editor';
import { PanelBox } from '@invana/ui';

import variants from '../../../fixtures/editor/code-block.json';
import { ReplayFrame, useReplay } from '../../_story/replay';
import { jsx, snippets, sourceFor, variantArg } from '../../_story/source';
import { VariantBoard, type Variant } from '../../_story/variant-board';

interface CodeVariant extends Variant {
  props: Omit<CodeBlockProps, 'value'> & { value?: string };
  /** A document that grows: each step merges one key in, and `done` is merged when the last lands. */
  live?: { file: string; every: number; steps: { key: string; value: unknown }[]; done: Record<string, unknown> };
}

const VARIANTS = variants as CodeVariant[];

/** The document after `n` steps — what the run's `result.json` says by then. */
const documentAt = (live: NonNullable<CodeVariant['live']>, n: number) => {
  const doc = Object.fromEntries(live.steps.slice(0, n).map((s) => [s.key, s.value]));
  return JSON.stringify(n === live.steps.length ? { ...doc, ...live.done } : doc, null, 2);
};

/** `result.json` while the run is still going: each finished task merges its key in. */
function LiveValue({ v }: { v: CodeVariant }) {
  const live = v.live!;
  const replay = useReplay(live.steps.length - 1, { every: live.every });
  const done = replay.at + 1;
  return (
    <ReplayFrame replay={replay} noun="key" width={v.width}>
      <PanelBox title={live.file} aside={replay.done ? `${done} keys · done` : `${done} keys · tailing`} flush>
        <CodeBlock {...v.props} value={documentAt(live, done)} />
      </PanelBox>
    </ReplayFrame>
  );
}

const meta = {
  title: 'Editor/CodeBlock',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { CodeBlock } from '@invana/editor';"],
            picked.map((v) =>
              v.live
                ? {
                    comment: v.caption,
                    setup: [
                      '// A new `value` goes into the open view as a transaction — no remount, so a reader',
                      '// scrolled inside the capped block mid-run stays where they were.',
                      'const [result, setResult] = React.useState({});',
                      'React.useEffect(() => run.subscribe((key, value) => setResult((r) => ({ ...r, [key]: value }))), []);',
                    ].join('\n'),
                    call: jsx('CodeBlock', {
                      language: { literal: v.props.language! },
                      value: 'JSON.stringify(result, null, 2)',
                      maxHeight: v.props.maxHeight ? String(v.props.maxHeight) : undefined,
                    }),
                  }
                : {
                    comment: v.caption,
                    data: { value: v.props.value },
                    call: jsx('CodeBlock', {
                      language: { literal: v.props.language! },
                      value: 'value',
                      showLineNumbers: v.props.showLineNumbers ? 'true' : undefined,
                      maxHeight: v.props.maxHeight ? String(v.props.maxHeight) : undefined,
                    }),
                  },
            ),
          ),
        ),
      },
    },
  },
  args: { variant: 'All' },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<{ variant: string }>;

/**
 * Code, shown as it is — the DAG in a hand-off, a query in a diagnosis — from
 * `fixtures/editor/code-block.json`. Read-only by construction: no cursor, no illusion that
 * typing does anything, so there is no callback to log.
 *
 * - One document per language it is really handed; `plain` paints nothing, for output that is
 *   not code.
 * - **Line Numbers** — a plan version as the engine holds it; a reader copies a line by its
 *   number. Off by default: a five-line snippet does not need a gutter.
 * - **Max Height** — caps the block and scrolls inside CodeMirror, so the editor knows its own
 *   viewport instead of rendering every line into a box that clips them.
 * - **Live Value** — `result.json` while the run is going, replayed: each new `value` goes into
 *   the existing view as a transaction, so a scroll inside it mid-run stays put.
 */
export const CodeBlockStory: Story = {
  name: 'CodeBlock',
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => (v.live ? <LiveValue v={v} /> : <CodeBlock {...v.props} value={v.props.value ?? ''} />)}
    </VariantBoard>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Every variant draws', async () => {
      for (const v of VARIANTS) await expect(canvas.getByRole('group', { name: v.caption })).toBeInTheDocument();
    });
    await step('The live document reaches its last key', async () => {
      const live = within(canvas.getByRole('group', { name: 'Live Value' }));
      await userEvent.click(live.getByRole('button', { name: 'Skip to end' }));
      await expect(live.getByText(/keys · done/)).toBeInTheDocument();
    });
  },
};
