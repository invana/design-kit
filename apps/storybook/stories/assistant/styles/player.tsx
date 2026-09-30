import * as React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Eyebrow,
  SegmentedControl,
  TraceList,
  TraceStep,
  TypographyH6,
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
  AIRPORTS_COMPOSER,
  SESSIONS,
  airportsSpec,
  askScenario,
  clarifyScenario,
  confirmScenario,
  failScenario,
  longScenario,
  respond,
} from '@invana/assistant/fixtures';
import {
  ArrowUp,
  Copy,
  List,
  Paperclip,
  RotateCw,
  Square,
  ThumbsDown,
  ThumbsUp,
  X,
} from 'lucide-react';

// Story chrome, not a kit component: a ChatSession driven by recorded runs,
// with a Play button per moment of the walkthrough. The session is the kit;
// everything around it is here so a walkthrough reads one-to-one with the
// Session Task Trace board. Icons stay story-side: the kit ships none.

const ICONS = {
  send: <ArrowUp className="size-4" />,
  stop: <Square className="size-3 fill-current" />,
  attach: <Paperclip className="size-4" />,
  close: <X className="size-3.5" />,
  retry: <RotateCw className="size-3" />,
  copy: <Copy className="size-3" />,
  steps: <List className="size-3" />,
  rateUp: <ThumbsUp className="size-3" />,
  rateDown: <ThumbsDown className="size-3" />,
};

interface Moment {
  title: string;
  body: string;
  play: (ctx: { run: (build: (id: string, start: number) => PatchScript) => void; stopAfter: (ms: number) => void; handle: ChatSessionHandle | null }) => void;
  /** Only this variant has it — the Tasks view is the console's. */
  only?: ChatSessionVariant;
}

const MOMENTS: Moment[] = [
  {
    title: 'Send',
    body: 'The prompt lands and the reply appears at once with its plan: four queued steps. Understand pulses and its reasoning streams under it; Validate, Execute and Project follow, Execute counting rows as batches land. The answer writes itself in, then its table, then what it produced — and the steps fold to one line.',
    play: ({ run }) => run(askScenario),
  },
  {
    title: 'Needs input',
    body: 'Understand ends with a question instead of a query. The step turns amber, the ask appears with its options, and the run waits on you. Picking an option resumes the same run; the steps continue rather than starting over.',
    play: ({ run }) => run(clarifyScenario),
  },
  {
    title: 'A costly question',
    body: 'Before a full scan, the assistant states what yes costs and asks. Yes runs it; the other answer narrows it and says so — a partial answer, ranked.',
    play: ({ run }) => run(confirmScenario),
  },
  {
    title: 'Failure and retry',
    body: 'A retry is a visible state, never a silent pause: retrying 2/3 with its own elapsed. When every attempt fails the step goes red, the reply says why, and offers what to do next — Try again runs it again.',
    play: ({ run }) => run(failScenario),
  },
  {
    title: 'Stop',
    body: 'Press esc, or stop in the composer, while a run is in flight. The running step is marked stopped, the steps after it stay queued so you can see how far it got. This one stops itself after 1.7 s.',
    play: ({ run, stopAfter }) => {
      run(longScenario);
      stopAfter(1700);
    },
  },
  {
    title: 'Open a step',
    body: 'Any step opens its record: what went in, what came out, the attempt. For Understand that is the prompt, the schema, the prior turns and the proposed query.',
    play: ({ handle }) => handle?.openStep('t0-a', 'understand'),
  },
  {
    title: 'Tasks view',
    body: 'The status bar switches to Tasks: every step of every reply, grouped by prompt, newest first, with running and waiting ones on top. A row jumps to its reply.',
    play: ({ handle }) => handle?.setView('tasks'),
    only: 'cli',
  },
];

/** The research sessions, each a whole thread of asks and answers, with the airports composer. */
const THREADS: { value: string; label: string; spec: () => ConversationSpec }[] = [
  { value: 'airports', label: 'Airports', spec: () => airportsSpec(Date.now()) },
  ...Object.entries(SESSIONS).map(([key, spec]) => ({
    value: key,
    label: spec.analyst ?? key,
    spec: () => ({ ...spec, composer: spec.composer ?? AIRPORTS_COMPOSER }),
  })),
];

function describe(event: ConversationEvent): string {
  const { type, ...rest } = event;
  const fields = Object.entries(rest)
    .filter(([k]) => k !== 'files')
    .map(([k, v]) => `${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`)
    .join(' · ');
  return fields ? `${type} · ${fields}` : type;
}

/** The run behind an answer, opened from its elapsed time — the host's own view of a job. */
function RunDialog({ turn, onClose }: { turn: AnswerTurn | null; onClose: () => void }) {
  return (
    <Dialog open={!!turn} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Run · {turn?.id}</DialogTitle>
        </DialogHeader>
        <TraceList>
          {(turn?.trace ?? []).map((s, i) => (
            <TraceStep
              key={s.id ?? i}
              name={s.key ?? s.label}
              duration={s.duration !== undefined ? formatDuration(s.duration) : s.state}
              status={s.state}
            />
          ))}
        </TraceList>
      </DialogContent>
    </Dialog>
  );
}

/** Play a scenario from now, under a fresh turn id. */
function playNow(play: (script: PatchScript) => Promise<unknown>, build: (id: string, start: number) => PatchScript) {
  const start = Date.now();
  void play(build(`t${start.toString(36)}`, start));
}

export interface ScenarioPlayerProps {
  variant: ChatSessionVariant;
  /** The panel's widths to switch between, the first shown first. */
  widths: number[];
}

export function ScenarioPlayer({ variant, widths }: ScenarioPlayerProps) {
  const chat = useChatSession(() => airportsSpec(Date.now()));
  const handle = React.useRef<ChatSessionHandle>(null);
  const [width, setWidth] = React.useState(widths[0]);
  const [thread, setThread] = React.useState('airports');
  const [log, setLog] = React.useState<string[]>([]);
  const [run, setRun] = React.useState<AnswerTurn | null>(null);
  const specRef = React.useRef(chat.spec);
  React.useEffect(() => {
    specRef.current = chat.spec;
  });

  const note = (line: string) => setLog((prev) => [`${clockTime(new Date().toISOString())}  ${line}`, ...prev].slice(0, 40));
  const onEvent = (event: ConversationEvent) => {
    note(describe(event));
    if (event.type === 'stop') return;
    // The API's side: what it would stream back.
    const script = respond(event, specRef.current, Date.now());
    if (script) void chat.play(script);
  };

  const moments = MOMENTS.filter((m) => !m.only || m.only === variant);
  const ctx = {
    run: (build: (id: string, start: number) => PatchScript) => playNow(chat.play, build),
    stopAfter: (ms: number) => setTimeout(() => chat.stop(), ms),
  };

  return (
    <div className="mx-auto grid max-w-[1280px] items-start gap-9 px-6 py-8 md:grid-cols-[auto_minmax(0,1fr)]">
      <div className="flex flex-col gap-2 md:sticky md:top-5">
        <div className="border border-border shadow-md" style={{ width, height: 760 }}>
          <ChatSession
            ref={handle}
            variant={variant}
            spec={chat.spec}
            icons={ICONS}
            onEvent={onEvent}
            onStop={chat.stop}
            onOpenRun={(e) => setRun((specRef.current.turns.find((t) => t.id === e.turn) as AnswerTurn) ?? null)}
            onClose={() => note('close')}
          />
        </div>
        <SegmentedControl
          size="xs"
          value={String(width)}
          onValueChange={(v) => setWidth(Number(v))}
          options={widths.map((w) => ({ value: String(w), label: `${w} px` }))}
        />
      </div>

      <div className="flex min-w-0 flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Eyebrow>Thread</Eyebrow>
          <SegmentedControl
            size="xs"
            value={thread}
            onValueChange={(v) => {
              setThread(v);
              const next = THREADS.find((t) => t.value === v);
              if (next) chat.reset(next.spec());
            }}
            options={THREADS.map((t) => ({ value: t.value, label: t.label }))}
          />
          <TypographyMuted>
            The research sessions are whole threads of asks and answer blocks, drawn from their JSON by the
            same component. Play works on any thread.
          </TypographyMuted>
        </div>

        <div>
          {moments.map((m, i) => (
            <div key={m.title} className="grid grid-cols-[28px_1fr_auto] items-start gap-3 border-t border-border py-3.5 first:border-t-0">
              <span className="pt-0.5 font-mono text-muted-foreground">{i + 1}</span>
              <div className="flex flex-col gap-1">
                <TypographyH6>{m.title}</TypographyH6>
                <TypographyMuted>{m.body}</TypographyMuted>
              </div>
              <Button variant="outline" size="sm" disabled={chat.running && m.title !== 'Stop'} onClick={() => m.play({ ...ctx, handle: handle.current })}>
                Play
              </Button>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1.5">
          <Eyebrow>Events · what the session sent</Eyebrow>
          <pre className="m-0 max-h-60 overflow-auto border border-border bg-card p-2 font-mono text-xs text-muted-foreground">
            {log.length ? log.join('\n') : 'Send a prompt, answer an ask, press an action…'}
          </pre>
        </div>
      </div>

      <RunDialog turn={run} onClose={() => setRun(null)} />
    </div>
  );
}
