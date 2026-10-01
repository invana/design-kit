import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import {
  ChatSession as ChatSessionView,
  playScript,
  type ChatSessionAnswerAction,
  type ChatSessionProps,
  type ConversationEvent,
} from '@invana/assistant';
import { CONVERSATIONS, STREAMING_SCRIPT, type ConversationId } from '@invana/assistant/fixtures';

import data from '../../../../fixtures/assistant/chat-session.json';
import { inline, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard } from '../../../_story/variant-board';
import { ACTION_ICONS, CHAT_ICONS, chatCallbacks, RailPanel } from '../../chat-kit';

type Action = Extract<ChatSessionAnswerAction, string> | { id: string; label: string; icon?: string };

/** One conversation: the thread it draws, and how the session is set up around it. */
interface SessionVariant {
  caption: string;
  conversation: ConversationId;
  /** The panel it draws in: the Studio rail's width, and its height. */
  width: number;
  height?: number;
  /** A recorded run the session plays in as it mounts — `streaming` is the one there is. */
  stream?: 'streaming';
  props: { variant: 'web' | 'cli'; defaultView?: 'chat' | 'tasks'; actions?: Action[] };
}

const VARIANTS = data as unknown as SessionVariant[];

/** The recorded run, opened afresh each time a cell mounts. */
const STREAMS = {
  streaming: (signal: AbortSignal) => playScript(STREAMING_SCRIPT, { signal }),
};

const LOOKS = ['as recorded', 'web', 'cli'] as const;

type Args = Omit<Partial<ChatSessionProps>, 'variant'> & {
  variant: string;
  /** Draw every conversation in one look, or each as it was recorded. */
  look: (typeof LOOKS)[number];
};

const actionsOf = (actions: Action[] | undefined): ChatSessionAnswerAction[] | undefined =>
  actions?.map((a) => (typeof a === 'string' ? a : { id: a.id, label: a.label, icon: a.icon ? ACTION_ICONS[a.icon] : undefined }));

const meta = {
  title: 'Assistant/Conversations/ChatSession',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import { ChatSession, playScript } from '@invana/assistant';",
              "import { CONVERSATIONS, STREAMING_SCRIPT } from '@invana/assistant/fixtures';",
            ],
            picked.map((v) => ({
              comment: v.caption,
              setup: [
                `// The whole thread, as the API sends it (fixtures/conversations/*.json).`,
                `const spec = CONVERSATIONS.${v.conversation};`,
                ...(v.stream ? ['// Its words arrive as `append-text` patches — here a recorded script.', 'const stream = (signal) => playScript(STREAMING_SCRIPT, { signal });'] : []),
                '// Every interaction is a ConversationEvent — { type: "rate", turn, value }, { type: "copy", turn, text }, …',
                'const onEvent = (event) => api.send(event);',
              ].join('\n'),
              call: [
                '<ChatSession',
                '  spec={spec}',
                ...(v.stream ? ['  stream={stream}'] : []),
                `  variant="${v.props.variant}"`,
                ...(v.props.defaultView ? [`  defaultView="${v.props.defaultView}"`] : []),
                ...(v.props.actions ? [`  actions={${inline(v.props.actions)}}`] : []),
                '  icons={icons}',
                '  onEvent={onEvent}',
                '/>',
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: VARIANTS[0].caption, look: 'as recorded', ...chatCallbacks() },
  argTypes: {
    variant: variantArg(VARIANTS),
    look: { control: 'inline-radio', options: LOOKS },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * The whole assistant, driven by JSON: pick a conversation. Graph expansions — three answered,
 * each with what it added, and actions beside each answer's time chosen by `actions` (the
 * built-ins by name, and `Pin to report` of your own, sent as an `action` event). The agent
 * console with work in flight, a parked question and a running agent pinned above the composer.
 * Every background task on the Tasks view. A reply that writes itself in from a recorded
 * `stream`. An answer's `envelope.method` as a bare `▸ method` line. And who is speaking over
 * each turn. Every interaction lands in the Actions panel through its own callback, then
 * `onEvent`, and in the cell's log.
 */
export const ChatSession: Story = {
  render: ({ variant, look, onEvent, ...handlers }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => (
        <RailPanel height={v.height}>
          <ChatSessionView
            {...handlers}
            spec={CONVERSATIONS[v.conversation]}
            stream={v.stream ? STREAMS[v.stream] : undefined}
            variant={look === 'as recorded' ? v.props.variant : look}
            defaultView={v.props.defaultView}
            actions={actionsOf(v.props.actions)}
            icons={CHAT_ICONS}
            onEvent={(event: ConversationEvent) => {
              onEvent?.(event);
              log('onEvent', event);
            }}
          />
        </RailPanel>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const c = within(within(canvasElement).getByRole('group', { name: 'Graph expansions' }));
    await step('Rate an answer: the event reaches its callback, then onEvent', async () => {
      await userEvent.click(c.getAllByRole('button', { name: 'Good answer' })[0]);
      await expect(args.onRate).toHaveBeenCalledWith(expect.objectContaining({ type: 'rate', value: 1 }));
      await expect(args.onEvent).toHaveBeenCalledWith(expect.objectContaining({ type: 'rate', value: 1 }));
      await expect(c.getByRole('list', { name: 'Events' })).toHaveTextContent('"type": "rate"');
    });
  },
};
