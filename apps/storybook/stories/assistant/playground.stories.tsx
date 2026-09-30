import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppLayoutV2 } from '@invana/themes/app-v2/layout';
import {
  Avatar,
  AvatarFallback,
  Button,
  EmptyState,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  SectionHeader,
  SegmentedControl,
  TabbedPanel,
  Terminal,
  TerminalLine,
  TraceList,
  TraceStep,
  TypographyMuted,
} from '@invana/ui';
import {
  ChatSession,
  clockTime,
  formatDuration,
  useChatSession,
  type AnswerTurn,
  type ChatSessionHandle,
  type ChatSessionVariant,
  type ConversationEvent,
  type ConversationSpec,
  type PatchScript,
} from '@invana/assistant';
import {
  USERS,
  clarifyRun,
  confirmRun,
  failRun,
  longRun,
  openingSpec,
  respond,
  sendRun,
  type UserData,
  type UserId,
} from '@invana/assistant/fixtures';
import { Activity, ListChecks, Play, ScrollText } from 'lucide-react';

import { CHAT_ICONS, logEvent } from './chat-kit';

// The assistant as a whole product, in an app shell: pick a user, a variant
// and a width, then play the moments of a conversation — a prompt answered, a
// question asked back, a costly run, a failure, a stop — into their thread.
// Everything the chat draws comes from the user's JSON
// (`packages/assistant/src/data/conversations/`); everything around it is
// story chrome standing in for the host: the run inspector, the event log.

type Run = (user: UserData, id: string, start: number) => PatchScript;

interface Moment {
  title: string;
  body: string;
  play: (ctx: {
    run: (build: Run) => void;
    stopAfter: (ms: number) => void;
    handle: ChatSessionHandle | null;
    spec: ConversationSpec;
  }) => void;
  /** Only this variant has it — the Tasks view is the console's. */
  only?: ChatSessionVariant;
}

const MOMENTS: Moment[] = [
  {
    title: 'Send',
    body: 'The prompt lands and the reply appears at once with its plan: four queued steps. Understand streams its reasoning; Execute counts batches; the answer writes itself in, then its blocks, then the follow-ups.',
    play: ({ run }) => run(sendRun),
  },
  {
    title: 'Needs input',
    body: 'Understand ends with a question instead of a query. The step turns amber and the ask appears; answering it resumes the same run.',
    play: ({ run }) => run(clarifyRun),
  },
  {
    title: 'A costly question',
    body: 'Before a heavy run, the assistant states what yes costs and asks. Yes runs it in full; no narrows it and says so — a partial answer.',
    play: ({ run }) => run(confirmRun),
  },
  {
    title: 'Failure and retry',
    body: 'A retry is a visible state, never a silent pause. When every attempt fails the step goes red, the reply says why and offers what to do next.',
    play: ({ run }) => run(failRun),
  },
  {
    title: 'Stop',
    body: 'Stop a run in flight: the running step is marked stopped and the steps after it stay queued. This one stops itself after 1.7 s.',
    play: ({ run, stopAfter }) => {
      run(longRun);
      stopAfter(1700);
    },
  },
  {
    title: 'Open a step',
    body: 'Any step opens its record: what went in, what came out, the attempt.',
    play: ({ handle, spec }) => {
      const last = [...spec.turns].reverse().find((t): t is AnswerTurn => t.role === 'assistant' && t.kind === 'answer' && !!t.trace?.[0]?.id);
      if (last?.trace?.[0]?.id) handle?.openStep(last.id, last.trace[0].id);
    },
  },
  {
    title: 'Tasks view',
    body: 'The status bar switches to Tasks: every step of every reply, grouped by prompt, running and waiting ones on top.',
    play: ({ handle }) => handle?.setView('tasks'),
    only: 'cli',
  },
];

const WIDTHS = ['280', '320', '420', '560', '720', 'fill'];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2);

function describe(event: ConversationEvent): string {
  const { type, ...rest } = event;
  const fields = Object.entries(rest)
    .filter(([k]) => k !== 'files')
    .map(([k, v]) => `${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`)
    .join(' · ');
  return fields ? `${type} · ${fields}` : type;
}

/** Play a run from now, under a fresh turn id. */
function playNow(play: (script: PatchScript) => Promise<unknown>, user: UserData, build: Run) {
  const start = Date.now();
  void play(build(user, `t${start.toString(36)}`, start));
}

function UserList({ value, onChange }: { value: UserId; onChange: (id: UserId) => void }) {
  return (
    <div>
      <SectionHeader title="Users" count={Object.keys(USERS).length} />
      <ItemGroup>
        {(Object.entries(USERS) as [UserId, UserData][]).map(([id, user]) => (
          <Item key={id} size="sm" selected={id === value} onClick={() => onChange(id)}>
            <ItemMedia>
              <Avatar>
                <AvatarFallback>{initials(user.name)}</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{user.name}</ItemTitle>
              <ItemDescription>{user.role}</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </div>
  );
}

function MomentList({ moments, running, onPlay }: { moments: Moment[]; running: boolean; onPlay: (m: Moment) => void }) {
  return (
    <ItemGroup>
      {moments.map((m) => (
        <Item key={m.title} size="sm">
          <ItemContent>
            <ItemTitle>{m.title}</ItemTitle>
            <ItemDescription>{m.body}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" size="sm" disabled={running && m.title !== 'Stop'} onClick={() => onPlay(m)}>
              Play
            </Button>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  );
}

/** The run behind an answer, opened from its elapsed time — the host's own view of a job. */
function RunView({ turn }: { turn: AnswerTurn | null }) {
  if (!turn) return <EmptyState title="No run open" description="Click an answer's elapsed time to open the run behind it." />;
  return (
    <div>
      <SectionHeader title={turn.title ?? turn.id} count={turn.meta} />
      <TraceList>
        {(turn.trace ?? []).map((s, i) => (
          <TraceStep
            key={s.id ?? i}
            name={s.key ?? s.label}
            duration={s.duration !== undefined ? formatDuration(s.duration) : s.state}
            status={s.state}
          />
        ))}
      </TraceList>
    </div>
  );
}

function EventLog({ lines }: { lines: string[] }) {
  if (!lines.length) return <EmptyState title="No events yet" description="Send a prompt, answer an ask, press an action…" />;
  return (
    <Terminal>
      {lines.map((line, i) => (
        <TerminalLine key={i} kind="output">
          {line}
        </TerminalLine>
      ))}
    </Terminal>
  );
}

interface PlaygroundProps {
  /** The user the playground opens on — a link to one user's thread. */
  user?: UserId;
  /** The variant it opens in. */
  variant?: ChatSessionVariant;
}

function AssistantPlayground({ user: initialUser = 'network', variant: initialVariant = 'web' }: PlaygroundProps) {
  const [userId, setUserId] = React.useState<UserId>(initialUser);
  const user = USERS[userId];
  const chat = useChatSession(() => openingSpec(user, Date.now()));
  const handle = React.useRef<ChatSessionHandle>(null);
  const [variant, setVariant] = React.useState<ChatSessionVariant>(initialVariant);
  const [width, setWidth] = React.useState('420');
  const [tab, setTab] = React.useState('moments');
  const [log, setLog] = React.useState<string[]>([]);
  const [run, setRun] = React.useState<AnswerTurn | null>(null);
  const specRef = React.useRef(chat.spec);
  React.useEffect(() => {
    specRef.current = chat.spec;
  });

  const note = (line: string) => setLog((prev) => [`${clockTime(new Date().toISOString())}  ${line}`, ...prev].slice(0, 80));
  const onEvent = (event: ConversationEvent) => {
    note(describe(event));
    logEvent(event);
    if (event.type === 'stop') return;
    // The API's side: what it would stream back.
    const script = respond(user, event, specRef.current, Date.now());
    if (script) void chat.play(script);
  };

  const pickUser = (id: UserId) => {
    chat.stop();
    setUserId(id);
    setRun(null);
    setLog([]);
    chat.reset(openingSpec(USERS[id], Date.now()));
  };

  const moments = MOMENTS.filter((m) => !m.only || m.only === variant);
  const play = (m: Moment) =>
    m.play({
      run: (build) => playNow(chat.play, user, build),
      stopAfter: (ms) => setTimeout(() => chat.stop(), ms),
      handle: handle.current,
      spec: specRef.current,
    });

  return (
    <AppLayoutV2
      header={{
        left: <SectionHeader bare title="Assistant" count={`${user.name} · ${user.model}`} />,
        right: (
          <>
            <SegmentedControl
              size="xs"
              value={variant}
              onValueChange={(v) => setVariant(v as ChatSessionVariant)}
              options={[
                { value: 'web', label: 'Web' },
                { value: 'cli', label: 'CLI' },
              ]}
            />
            <SegmentedControl
              size="xs"
              value={width}
              onValueChange={setWidth}
              options={WIDTHS.map((w) => ({ value: w, label: w === 'fill' ? 'Fill' : `${w} px` }))}
            />
          </>
        ),
      }}
      leftSection={{ content: <UserList value={userId} onChange={pickUser} />, defaultSize: '280px' }}
      mainSection={{
        content: (
          <ChatFrame width={width}>
            <ChatSession
              key={userId}
              ref={handle}
              variant={variant}
              spec={chat.spec}
              icons={CHAT_ICONS}
              onEvent={onEvent}
              onStop={chat.stop}
              onOpenRun={(e) => {
                setRun((specRef.current.turns.find((t) => t.id === e.turn) as AnswerTurn) ?? null);
                setTab('run');
              }}
              onClose={() => note('close')}
            />
          </ChatFrame>
        ),
      }}
      rightSection={{
        defaultSize: '360px',
        content: (
          <TabbedPanel
            activeTab={tab}
            onTabChange={setTab}
            tabs={[
              { value: 'moments', label: 'Moments', icon: Play, content: <MomentList moments={moments} running={chat.running} onPlay={play} /> },
              { value: 'run', label: 'Run', icon: ListChecks, content: <RunView turn={run} /> },
              { value: 'events', label: 'Events', icon: ScrollText, content: <EventLog lines={log} /> },
            ]}
          />
        ),
      }}
      footer={{
        left: <TypographyMuted>{user.role}</TypographyMuted>,
        right: (
          <TypographyMuted>
            <Activity className="inline size-3" /> {chat.running ? 'running' : 'idle'} · {variant} · {width === 'fill' ? 'fill' : `${width} px`}
          </TypographyMuted>
        ),
      }}
    />
  );
}

/** The chat at the width picked, centred in the main area — a Studio rail, a panel, or the whole page. */
function ChatFrame({ width, children }: { width: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full justify-center bg-muted/30">
      <div className="h-full border-x border-border bg-background" style={{ width: width === 'fill' ? '100%' : Number(width) }}>
        {children}
      </div>
    </div>
  );
}

const meta: Meta<typeof AssistantPlayground> = {
  title: 'Assistant/Playground',
  component: AssistantPlayground,
  parameters: { layout: 'fullscreen' },
  args: { user: 'network', variant: 'web' },
  argTypes: {
    user: { control: 'select', options: Object.keys(USERS) },
    variant: { control: 'inline-radio', options: ['web', 'cli'] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The full assistant experience: every user's thread, both variants, every width, and the moments of a
 * conversation played into it. Pick a user on the left, a variant and a width in the header, then
 * press Play on a moment — or type a prompt of your own. Answers you open land in Run; everything the
 * session sends lands in Events and the Actions panel.
 */
export const Playground: Story = {
  // A changed control opens the playground afresh on it.
  render: (args) => <AssistantPlayground key={`${args.user}-${args.variant}`} {...args} />,
};
