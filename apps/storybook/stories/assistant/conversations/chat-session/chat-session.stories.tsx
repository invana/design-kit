import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import {
  ChatSession as ChatSessionView,
  type ChatSessionProps,
  type ComposerContext,
  type ConversationEvent,
  type ConversationPatch,
  type ConversationSpec,
  type PatchScript,
  playScript,
  useChatSession,
} from '@invana/assistant';
import { CONVERSATIONS, DUB_DELAYS_RUN } from '@invana/assistant/fixtures';

import data from '../../../../fixtures/assistant/chat-session.json';
import { CHAT_ICONS, chatCallbacks } from '../../chat-kit';

/**
 * Everything the story draws is JSON: the spec the API sends, the run it streams
 * as patches (up to the approval, and after it), and the board nodes the host
 * offers as context. Edit any of them in Controls.
 */
type Args = Partial<ChatSessionProps> & {
  /** The conversation as the API sends it. */
  spec: ConversationSpec;
  /** The run, as recorded patches: up to the step that waits on the analyst, and once it is approved. */
  run: { before: PatchScript; after: PatchScript };
  /** Nodes on the board beside the session; selecting one adds it to the composer's context. */
  board: ComposerContext[];
  /** The panel it draws in: a page's assistant, or the narrow rail. */
  width: '880' | '320';
  /** Show the JSON going in and the events coming out. */
  json: boolean;
};

/** A recorded run, played as it arrives; a wait's `$NOW` is the time it is played. */
async function* play(script: PatchScript, signal: AbortSignal): AsyncGenerator<ConversationPatch[]> {
  for await (const batch of playScript(script, { signal })) {
    yield JSON.parse(
      JSON.stringify(batch).replaceAll('"$NOW"', JSON.stringify(new Date().toISOString())),
    ) as ConversationPatch[];
  }
}

/** The spec as sent, its run starting now: the player stands in for the API. */
const startingNow = (spec: ConversationSpec): ConversationSpec => {
  const startedAt = new Date().toISOString();
  return { ...spec, turns: spec.turns.map((t) => (t.role === 'assistant' && t.kind === 'answer' ? { ...t, startedAt } : t)) };
};

const LABEL = 'text-xs font-semibold uppercase tracking-[0.06em]';

/**
 * The host around the session: it holds the spec (`useChatSession`), streams the
 * run into it, adds and removes context chips as board nodes are selected, and
 * goes on with the run when the step that waits is approved. It knows no data.
 */
function Host({ spec, run, board, width, json, onEvent, ...handlers }: Args) {
  const chat = useChatSession(() => startingNow(spec));
  const [replay, setReplay] = React.useState(0);
  const [out, setOut] = React.useState<ConversationEvent[]>([]);
  const context = chat.spec.composer?.context ?? [];
  const setContext = (next: ComposerContext[]) =>
    chat.apply({ op: 'update-spec', fields: { composer: { ...chat.spec.composer, context: next } } });

  // biome-ignore lint/correctness/useExhaustiveDependencies: new JSON or a replay starts the run again
  React.useEffect(() => {
    const controller = new AbortController();
    chat.reset(startingNow(spec));
    void chat.stream(play(run.before, controller.signal));
    return () => {
      controller.abort();
      chat.stop();
    };
  }, [spec, run, replay]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex w-full flex-wrap items-center gap-2 border-b border-dashed border-border pb-2 text-sm text-muted-foreground">
        <span>Select a node to add it to the context:</span>
        {board.map((node) => {
          const on = context.some((c) => c.id === node.id);
          return (
            <button
              key={node.id}
              type="button"
              aria-pressed={on}
              onClick={() => setContext(on ? context.filter((c) => c.id !== node.id) : [...context, node])}
              className="rounded-control border border-border px-2 py-0.5 text-foreground aria-pressed:border-primary aria-pressed:bg-secondary"
            >
              {node.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => {
            setOut([]);
            setReplay((n) => n + 1);
          }}
          className="ml-auto rounded-control border border-border px-2.5 py-0.5 text-foreground"
        >
          Replay the run
        </button>
      </div>
      {json ? (
        <div className="grid max-h-60 w-full grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-3 overflow-auto border-b border-dashed border-border pb-2 text-sm text-muted-foreground">
          <div className="flex min-w-0 flex-col gap-1">
            <span className={LABEL}>
              In · the one prop, <span className="font-mono">spec</span> (the run arrives as patches over time)
            </span>
            <pre className="m-0 font-mono text-[11px] leading-[15px] whitespace-pre-wrap text-foreground">
              {JSON.stringify({ ...chat.spec, turns: `[${chat.spec.turns.length} turns]` }, null, 1)}
            </pre>
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className={LABEL}>Out · events the component emits (last 5)</span>
            <pre className="m-0 font-mono text-[11px] leading-[15px] whitespace-pre-wrap text-foreground">
              {out.length ? out.map((e) => JSON.stringify(e)).join('\n') : '(nothing yet: pick a model, select a node, answer an approval)'}
            </pre>
          </div>
        </div>
      ) : null}
      <div
        className="border border-border"
        style={{ width: width === '320' ? 320 : '100%', maxWidth: 880, height: 1000 }}
      >
        <ChatSessionView
          {...handlers}
          spec={chat.spec}
          icons={CHAT_ICONS}
          actions={['steps', 'report']}
          onRemoveContext={(e) => {
            handlers.onRemoveContext?.(e);
            setContext(context.filter((c) => c.id !== e.id));
          }}
          onAction={(e) => {
            handlers.onAction?.(e);
            if (e.action === 'approve') void chat.stream(play(run.after, new AbortController().signal));
          }}
          onStop={(e) => {
            handlers.onStop?.(e);
            chat.stop();
          }}
          onEvent={(e: ConversationEvent) => {
            onEvent?.(e);
            setOut((prev) => [...prev, e].slice(-5));
          }}
        />
      </div>
    </div>
  );
}

const meta = {
  title: 'Assistant/Conversations/ChatSession',
  parameters: { layout: 'padded' },
  args: {
    spec: CONVERSATIONS.dubDelays,
    run: DUB_DELAYS_RUN,
    board: data.board,
    width: '880',
    json: false,
    ...chatCallbacks(),
  },
  argTypes: {
    spec: { control: 'object' },
    run: { control: 'object' },
    board: { control: 'object' },
    width: { control: 'inline-radio', options: ['880', '320'] },
    json: { control: 'boolean', name: 'JSON in and out' },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * The assistant, as RV-D14 draws it — from JSON alone. The spec goes in (the
 * models and agents the World allows, the context, the budget) and the run
 * streams in as patches: each step a short row (its tool in mono, what it did,
 * its time) that opens to what went in, how it was parsed, the policy it ran
 * under, what came back and what the LLM saw. Step 5 reads over the limit, so
 * the run waits on you: **Approve once** sends `action: approve` and the run
 * goes on; **Stop the run** sends `stop`. The answer writes itself in under the
 * steps; the run line's two toggles open every step and the run report. Every
 * interaction comes out as a JSON event — turn on **JSON in and out** to watch
 * both, or edit the spec, the run or the board in Controls; drop the `agent`
 * control from the spec to see the composer without agents.
 */
export const ChatSession: Story = {
  render: (args) => <Host {...args} />,
  play: async ({ canvasElement, step }) => {
    const c = within(canvasElement);
    await step('The question sits on the right, and the first step streams in as a row', async () => {
      await expect(c.getByText(/Which operators had the most delayed departures/)).toBeVisible();
      await expect(await c.findByText('get_schema', {}, { timeout: 3000 })).toBeVisible();
    });
    await step('The composer offers the World’s models, and the budget', async () => {
      await expect(c.getByRole('button', { name: 'Models this World allows' })).toHaveTextContent('claude-opus-5-5');
      await expect(c.getByRole('img', { name: 'Token budget used' })).toBeInTheDocument();
    });
  },
};
