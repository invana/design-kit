import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { expect, userEvent, within } from 'storybook/test';
import { AppLayoutAgents, type AppLayoutAgentsProps } from '@invana/themes/app-agents/layout';
import { ThemeProvider, ThemeSelector } from '@invana/themes';
import { ActivityBlock, type ActivityOptions } from '@invana/blocks';
import {
  AgentHeader,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  Button,
  EmptyState,
  FloatingPanel,
  LogCard,
  NavHorizontalItems,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
  StatusDot,
  type LogLine,
} from '@invana/ui';
import {
  ChatSession,
  useChatSession,
  type ConversationEvent,
  type ConversationSpec,
  type PatchScript,
} from '@invana/assistant';
import {
  Activity,
  Focus,
  Globe,
  Maximize,
  Minimize,
  Monitor,
  Moon,
  Palette,
  ScrollText,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Users,
} from 'lucide-react';

import data from '../../../fixtures/themes/app-agents.json';
import { CHAT_ICONS, logEvent } from '../../assistant/chat-kit';
import { SettingsDialog } from './settings-dialog';

/**
 * The thread as the API would send it: the spec it opens on, the ask that plays in
 * after it, and the answer that streams once the ask is answered.
 */
const FIXTURE = data as unknown as {
  stars: number;
  sessions: string[];
  spec: ConversationSpec;
  opening: PatchScript;
  answer: PatchScript;
  /** The run's layer activity once settled, and its log lines at their time after the start. */
  activity: ActivityOptions & { logs: { at: number; log: LogLine }[] };
};

const ASK = 'q1';

const HEADER_ICONS = { world: <Globe />, group: <Users />, lens: <Focus />, governance: <ShieldCheck /> };

/** Where the session stands, from its turns: working, held on the analyst, or idle. */
function statusOf(spec: ConversationSpec): React.ComponentProps<typeof AgentHeader>['status'] {
  const assistant = spec.turns.filter((t) => t.role === 'assistant');
  if (assistant.some((t) => t.kind === 'answer' && t.state === 'running')) return { tone: 'running', label: 'running…' };
  const waiting = assistant.filter((t) => t.kind === 'ask' && t.state === 'pending').length;
  if (waiting) return { tone: 'info', label: `needs input (${waiting})`, short: `needs ${waiting}` };
  return { tone: 'muted', label: 'idle' };
}

/** Plays the thread in, then answers the scope ask the way the API would. */
function Conversation({
  onRunStart,
  onOpenSettings,
}: {
  /** The answer started streaming — the run the activity panel follows. */
  onRunStart: () => void;
  onOpenSettings: () => void;
}) {
  const chat = useChatSession(FIXTURE.spec);
  const opened = React.useRef(false);
  const answered = React.useRef(false);

  React.useEffect(() => {
    if (opened.current) return;
    opened.current = true;
    void chat.play(FIXTURE.opening);
  }, [chat]);

  const settle = (value: unknown) => {
    chat.apply({ op: 'set-state', turn: ASK, state: 'answered', value });
    if (answered.current) return;
    answered.current = true;
    onRunStart();
    void chat.play(FIXTURE.answer);
  };

  const onEvent = (event: ConversationEvent) => {
    logEvent(event);
    if ((event.type === 'reply' || event.type === 'change') && event.turn === ASK) settle(event.value);
  };

  return (
    <ChatSession
      spec={chat.spec}
      variant="cli"
      icons={CHAT_ICONS}
      header={
        // The session's header is the host's: here, the agent header, fed from the spec the API
        // sends (its agent, access, budget and governance) and the session switcher.
        <AgentHeader
          title={<SessionCrumb />}
          agent={chat.spec.agent}
          status={statusOf(chat.spec)}
          access={chat.spec.access}
          lens={chat.spec.scope?.Lens}
          budget={chat.spec.budget}
          governance={chat.spec.governance as React.ComponentProps<typeof AgentHeader>['governance']}
          icons={HEADER_ICONS}
          onRequestAccess={action('onRequestAccess')}
          onOpenSettings={onOpenSettings}
        />
      }
      onEvent={onEvent}
      onStop={chat.stop}
    />
  );
}

const CELL_MS = 250;
const CELLS = FIXTURE.activity.lanes[0]!.cells.length;

/**
 * The run as the runtime would report it: one slice of layer activity every 250 ms after the
 * answer starts, and each log line at its time. Slices not yet reached are empty — the lane
 * fills in as the run goes.
 */
function useRunActivity() {
  const [tick, setTick] = React.useState<number | null>(null);
  const [lines, setLines] = React.useState<LogLine[]>([]);
  const timers = React.useRef<number[]>([]);
  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const start = React.useCallback(() => {
    setTick(0);
    for (let i = 1; i <= CELLS; i++) timers.current.push(window.setTimeout(() => setTick(i), i * CELL_MS));
    for (const { at, log } of FIXTURE.activity.logs)
      timers.current.push(window.setTimeout(() => setLines((l) => [...l, log]), at));
  }, []);

  const live = tick != null && tick < CELLS;
  const reached = tick ?? 0;
  const { logs: _logs, ...settled } = FIXTURE.activity;
  // The step the run is in is the band the last slice falls in.
  let edge = 0;
  const spec: ActivityOptions = {
    ...settled,
    state: live ? 'live' : 'settled',
    bands: settled.bands?.map((b) => {
      const from = edge;
      edge += b.span;
      return { ...b, current: live && reached >= from && reached < edge };
    }),
    lanes: settled.lanes.map((lane) => ({
      ...lane,
      rate: tick == null ? '—' : lane.rate,
      cells: lane.cells.map((v, i) => (i < reached ? v : null)),
      marks: lane.marks?.filter((m) => m.at < reached),
    })),
    hint: tick == null ? 'No run yet · hollow: not touched' : undefined,
  };
  const step = spec.bands?.findIndex((b) => b.current) ?? -1;
  return { spec, lines, live, started: tick != null, step, start };
}

/**
 * The open session, in the title's place on the conversation's header; its caret lists the
 * other sessions, and picking one opens it.
 */
function SessionCrumb() {
  const [active, setActive] = React.useState(FIXTURE.sessions[0]);
  return (
    <NavHorizontalItems
      items={[
        {
          key: 'session',
          name: 'Sessions',
          label: active,
          menuTrigger: 'caret',
          menuItems: FIXTURE.sessions
            .filter((name) => name !== active)
            .map((name) => ({ id: name, label: name, onSelect: () => setActive(name) })),
          className: '!p-0 font-bold',
        },
      ]}
    />
  );
}

const MODE_ICONS = { light: Sun, dark: Moon, system: Monitor };

/** The header theme picker, as the Explorer ships it. It drives the story's own `ThemeProvider`. */
function ThemeMenu() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="[&_svg]:size-5" title="Theme & appearance">
          <Palette />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <ThemeSelector layout="form" showAccent={false} modeIcons={MODE_ICONS} />
      </PopoverContent>
    </Popover>
  );
}

/** Puts the whole page in or out of full screen, and follows Esc leaving it. */
function FullScreenToggle() {
  const [full, setFull] = React.useState(false);
  React.useEffect(() => {
    const sync = () => setFull(document.fullscreenElement != null);
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);
  const toggle = () =>
    void (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen());
  return (
    <Button variant="ghost" size="icon-sm" className="[&_svg]:size-5" title={full ? 'Exit full screen' : 'Full screen'} onClick={toggle}>
      {full ? <Minimize /> : <Maximize />}
    </Button>
  );
}

/** Stars the graph: the star fills and the count takes the reader's star. */
function StarButton() {
  const [starred, setStarred] = React.useState(false);
  const count = FIXTURE.stars + (starred ? 1 : 0);
  return (
    <Button
      variant="ghost"
      size="sm"
      className="[&_svg]:size-5"
      title={starred ? 'Unstar' : 'Star'}
      aria-pressed={starred}
      onClick={() => setStarred((s) => !s)}
    >
      <Star className={starred ? 'fill-current' : undefined} />
      <span className="tabular-nums">{count.toLocaleString()}</span>
    </Button>
  );
}

/** Opens the graph's settings: data, LLMs, governance and third-party services. */
function SettingsButton({ onOpen }: { onOpen: () => void }) {
  return (
    <Button variant="ghost" size="icon-sm" className="[&_svg]:size-5" title="Settings" onClick={onOpen}>
      <Settings />
    </Button>
  );
}

/** Shows or hides a floating panel; `count` beside the icon while there is something to flag. */
function PanelToggle({
  icon,
  label,
  pressed,
  count,
  onToggle,
}: {
  icon: React.ReactNode;
  label: string;
  pressed: boolean;
  count?: React.ReactNode;
  onToggle: () => void;
}) {
  return (
    <Button
      variant={pressed ? 'secondary' : 'ghost'}
      size="sm"
      className="[&_svg]:size-5"
      title={pressed ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
      aria-label={label}
      aria-pressed={pressed}
      onClick={onToggle}
    >
      {icon}
      {count != null ? <span className="tabular-nums">{count}</span> : null}
    </Button>
  );
}

/**
 * The shell with its state: the run the conversation starts feeds the activity and log panels,
 * which float over the work and are shown or hidden from the header; settings open from the
 * header or from the conversation's data and governance links.
 */
function AgentsApp(args: AppLayoutAgentsProps) {
  const activity = useRunActivity();
  const [showActivity, setShowActivity] = React.useState(true);
  const [showLogs, setShowLogs] = React.useState(false);
  const [activityFolded, setActivityFolded] = React.useState(false);
  const [logsFolded, setLogsFolded] = React.useState(false);
  const [settings, setSettings] = React.useState(false);
  const errors = activity.lines.filter((l) => l.level === 'error').length;

  return (
    <>
      <AppLayoutAgents
        {...args}
        header={{
          ...args.header,
          rightNavItems: [
            { name: 'Stars', label: <StarButton />, className: '!px-1 !py-0' },
            {
              name: 'Activity',
              label: (
                <PanelToggle
                  icon={<Activity />}
                  label="Activity"
                  pressed={showActivity}
                  count={activity.live ? <StatusDot tone="running" label="running" /> : undefined}
                  onToggle={() => setShowActivity((v) => !v)}
                />
              ),
              className: '!px-1 !py-0',
            },
            {
              name: 'Logs',
              label: (
                <PanelToggle
                  icon={<ScrollText />}
                  label="Logs"
                  pressed={showLogs}
                  count={errors ? <StatusDot tone="error" label={`${errors} errors`} /> : undefined}
                  onToggle={() => setShowLogs((v) => !v)}
                />
              ),
              className: '!px-1 !py-0',
            },
            { name: 'Theme & appearance', label: <ThemeMenu />, className: '!px-1 !py-0' },
            { name: 'Full screen', label: <FullScreenToggle />, className: '!px-1 !py-0' },
            {
              name: 'Assistant',
              label: 'Assistant',
              icon: Sparkles,
              iconClassName: 'size-5',
              onClick: () => {},
              className: 'ml-1 !px-2 !py-1',
            },
            { name: 'Settings', label: <SettingsButton onOpen={() => setSettings(true)} />, className: '!px-1 !py-0' },
          ],
        }}
        leftSection={{
          content: <Conversation onRunStart={activity.start} onOpenSettings={() => setSettings(true)} />,
        }}
        overlay={
          showActivity || showLogs ? (
            <>
              {showActivity ? (
                <FloatingPanel
                  title="Activity"
                  aside={
                    activity.live
                      ? `step ${activity.step + 1} of ${FIXTURE.activity.bands?.length}`
                      : activity.started
                        ? `by layer · ${(CELLS * CELL_MS) / 1000} s`
                        : 'by layer'
                  }
                  summary={activity.live ? 'running' : activity.started ? 'settled' : 'no run yet'}
                  collapsed={activityFolded}
                  onCollapsedChange={setActivityFolded}
                  onClose={() => setShowActivity(false)}
                  bodyClassName="p-3"
                >
                  <ActivityBlock spec={activity.spec} />
                </FloatingPanel>
              ) : null}
              {showLogs ? (
                <LogCard
                  lines={activity.lines}
                  live={activity.live}
                  collapsed={logsFolded}
                  onCollapsedChange={setLogsFolded}
                  onClose={() => setShowLogs(false)}
                />
              ) : null}
            </>
          ) : null
        }
      />
      <SettingsDialog open={settings} onOpenChange={setSettings} scope="accounts-graph" />
    </>
  );
}

const meta: Meta<typeof AppLayoutAgents> = {
  title: 'Themes/AppAgents/Default',
  component: AppLayoutAgents,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The agents shell: the conversation rail on the left and the work on the right — drag the
 * handle between them to resize, or past the rail's minimum to collapse it.
 * The thread plays in from `fixtures/themes/app-agents.json`; pick a scope and the answer
 * streams in. The rail's header names the session, the agent and its status, then the data it
 * reaches (record counts arrive live), its lens, token budget and governance. The run's activity
 * — every system it touches — and its log float over the work, toggled from the header.
 */
export const Default: Story = {
  // Self-themed: the header's picker owns the theme, so the global toolbar
  // decorator stands down (as on the Explorer).
  parameters: { selfThemed: true },
  render: (args) => (
    <ThemeProvider defaultTheme="default" defaultMode="dark" storageKey={null}>
      <AgentsApp {...args} />
    </ThemeProvider>
  ),
  args: {
    // As Studio's Explorer draws it: brand and the trail on the left. The open session is
    // on the conversation's own header, where its switcher sits beside the agent.
    header: {
      left: (
        <div className="flex items-center gap-1">
          <span className="select-none px-2 text-xl font-bold">Invana Studio</span>
          <Separator orientation="vertical" className="h-4" />
          <Breadcrumb className="px-1.5">
            <BreadcrumbList className="gap-1.5 font-bold sm:gap-1.5">
              <BreadcrumbItem>
                <BreadcrumbLink href="#">
                  ravi-merugu
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">
                  accounts-graph
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      ),
      // The right side — stars, the activity and log toggles, theme, full screen, the
      // assistant and settings — is drawn by `AgentsApp`, which owns their state.
    },
    mainSection: {
      content: (
        <EmptyState
          title="Canvas"
          description="The work the agents act on — a graph, a document, a board."
        />
      ),
    },
  },
  play: async ({ canvasElement, step }) => {
    const c = within(canvasElement);
    await step('The rail header shows one session; another is picked from its dropdown', async () => {
      await expect(c.queryByText('Board pack')).not.toBeInTheDocument();
      await userEvent.click(c.getByRole('button', { name: 'Sessions menu' }));
      await userEvent.click(await within(document.body).findByRole('menuitem', { name: 'Board pack' }));
      await expect(c.getByText('Board pack')).toBeInTheDocument();
    });
    await step('The data reach lists every model, the denied ones too, with a request', async () => {
      await userEvent.click(c.getByRole('button', { name: /^Data reach/ }));
      const reach = within(await within(document.body).findByRole('dialog'));
      await expect(reach.getByText('HR records')).toBeInTheDocument();
      await expect(reach.getByRole('button', { name: /Request access to 2 models/ })).toBeInTheDocument();
      await userEvent.keyboard('{Escape}');
    });
    await step('The scope ask plays in, and picking one streams the answer', async () => {
      await userEvent.click(await c.findByText('Top 50 by ARR', {}, { timeout: 3000 }));
      await expect(await c.findByText('Acme Robotics', {}, { timeout: 8000 })).toBeInTheDocument();
    });
    await step('The activity panel fills in as the run goes: a refusal on Graph, data leaving to a third party', async () => {
      await expect(await c.findByText(/by layer · 4 s/, {}, { timeout: 6000 })).toBeInTheDocument();
      await expect(c.getAllByTitle(/^Graph · cell \d+ · 250 ms · refused$/)).toHaveLength(1);
      await expect(c.getAllByTitle(/^Third party · cell \d+ · 250 ms · egress$/)).toHaveLength(1);
    });
    await step('The log panel opens from the header and shows the refusal', async () => {
      await userEvent.click(c.getByRole('button', { name: 'Logs' }));
      await expect(await c.findByText('HR records denied (lens: funding-watch)', {}, { timeout: 3000 })).toBeInTheDocument();
    });
    await step('Settings opens on the data: the datasets and the graph built from them', async () => {
      await userEvent.click(c.getByRole('button', { name: 'Settings' }));
      const dialog = within(await within(document.body).findByRole('dialog'));
      await expect(dialog.getByText('Crunchbase')).toBeInTheDocument();
      await expect(dialog.getByText('EVIDENCED_BY')).toBeInTheDocument();
    });
  },
};
