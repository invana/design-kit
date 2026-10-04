import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { AppLayoutAgents, type AppLayoutAgentsProps } from '@invana/themes/app-agents/layout';
import { ThemeProvider } from '@invana/themes';
import { BoardPages, type ActionContext, type BoardPagesSpec, type PanelRegistry } from '@invana/boards';
import { AgentHeader, Button } from '@invana/ui';
import { ChatSession, useChatSession, type ConversationEvent, type ConversationSpec, type PatchScript } from '@invana/assistant';
import { Home, ListOrdered, Table } from 'lucide-react';

import shell from '../../../fixtures/themes/app-agents.json';
import steps from '../../../fixtures/themes/playbook.json';
import { CHAT_ICONS, logEvent } from '../../assistant/chat-kit';
import { PlayableTablePanel } from './playbook/playable-table';
import { appendStep, panelsOf, PlaybookProvider, usePlaybook, type Playbook as Script, type Step } from './playbook/playbook';
import { PlaybookPanel, type Refused } from './playbook/playbook-panel';
import { tableOps } from './playbook/table-ops';

/** The agents shell's thread and boards — the same JSON `Themes/AppAgents/Default` opens on. */
const SHELL = shell as unknown as {
  spec: ConversationSpec;
  opening: PatchScript;
  answer: PatchScript;
  boards: BoardPagesSpec;
};

/**
 * The steps the agent sends while it answers, each at its time after the answer starts: calls
 * to the boards' tables by their panel id. One calls a table that is not there.
 */
const PLAYBOOK = steps as unknown as { title: string; steps: { at: number; step: Step }[] };

const ASK = 'q1';

/** The icon names the boards' JSON uses. */
const BOARD_ICONS = { home: Home, table: Table };

/** The work's tables answer to the playbook by their panel id. */
const BOARD_REGISTRY: PanelRegistry = { table: PlayableTablePanel };

/** What can be told what, by id — read from the boards, as Studio would. */
const PANELS = panelsOf(SHELL.boards).panels;
const OPS = { table: tableOps };

/**
 * The agent's steps as the API would send them beside its answer: each is checked against the
 * op set of the table it calls and recorded, or refused with why — a refused step never enters
 * the record, so it cannot break the steps after it.
 */
function useAgentSteps() {
  const [playbook, setPlaybook] = React.useState<Script>({ version: 1, title: PLAYBOOK.title, steps: [] });
  const [refused, setRefused] = React.useState<Refused[]>([]);
  const timers = React.useRef<number[]>([]);
  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // The record as of the last step recorded, so two steps in one tick both land.
  const latest = React.useRef(playbook);
  const record = React.useCallback((step: Step) => {
    const result = appendStep(latest.current, step, { kindOf: (id) => PANELS.get(id)?.kind, ops: OPS });
    if ('playbook' in result) {
      latest.current = result.playbook;
      setPlaybook(result.playbook);
      return;
    }
    action('step refused')(step.id, result.problems);
    setRefused((r) => [...r, { step, problems: result.problems }]);
  }, []);

  const start = React.useCallback(() => {
    for (const { at, step } of PLAYBOOK.steps) timers.current.push(window.setTimeout(() => record(step), at));
  }, [record]);

  return { playbook, refused, start };
}

/** Plays the thread in, then answers the scope ask the way the API would. */
function Conversation({ onRunStart }: { onRunStart: () => void }) {
  const chat = useChatSession(SHELL.spec);
  const opened = React.useRef(false);
  const answered = React.useRef(false);

  React.useEffect(() => {
    if (opened.current) return;
    opened.current = true;
    void chat.play(SHELL.opening);
  }, [chat]);

  const onEvent = (event: ConversationEvent) => {
    logEvent(event);
    if ((event.type !== 'reply' && event.type !== 'change') || event.turn !== ASK) return;
    chat.apply({ op: 'set-state', turn: ASK, state: 'answered', value: event.value });
    if (answered.current) return;
    answered.current = true;
    onRunStart();
    void chat.play(SHELL.answer);
  };

  return (
    <ChatSession
      spec={chat.spec}
      variant="cli"
      icons={CHAT_ICONS}
      header={<AgentHeader title={chat.spec.title} agent={chat.spec.agent} budget={chat.spec.budget} />}
      onEvent={onEvent}
      onStop={chat.stop}
    />
  );
}

/**
 * The shell with the playbook: the conversation starts the run, the agent's steps arrive and
 * are recorded, and the work follows them — the page of each step is shown as it is played.
 */
function PlaybookApp(args: AppLayoutAgentsProps) {
  const agent = useAgentSteps();
  const play = usePlaybook(agent.playbook);
  const [show, setShow] = React.useState(true);
  const [folded, setFolded] = React.useState(false);

  // The page shown is the host's: the reader picks one, and moving to a step shows the page
  // its first call lands on — the change is never on a page nobody is looking at.
  const [page, setPage] = React.useState(SHELL.boards.active ?? SHELL.boards.pages[0]!.id);
  const [seenStep, setSeenStep] = React.useState(play.current);
  if (seenStep !== play.current) {
    setSeenStep(play.current);
    const on = play.targets[0] ? PANELS.get(play.targets[0])?.page : undefined;
    if (on) setPage(on);
  }
  const onBoardAction = (id: string, ctx?: ActionContext) => {
    if (id === 'page' && ctx?.pageId) setPage(ctx.pageId);
    action('onAction')(id, ctx);
  };

  return (
    <AppLayoutAgents
      {...args}
      header={{
        ...args.header,
        rightNavItems: [
          {
            name: 'Playbook',
            label: (
              <Button
                variant={show ? 'secondary' : 'ghost'}
                size="sm"
                aria-label="Playbook"
                aria-pressed={show}
                onClick={() => setShow((v) => !v)}
              >
                <ListOrdered />
                {play.steps.length ? play.steps.length : null}
              </Button>
            ),
            className: '!px-1 !py-0',
          },
        ],
      }}
      leftSection={{ content: <Conversation onRunStart={agent.start} /> }}
      // The work: the open boards behind one tab strip; its tables answer to the playbook by
      // their panel id.
      mainSection={{
        content: (
          <PlaybookProvider router={play.router}>
            <BoardPages
              spec={{ ...SHELL.boards, active: page, selectAction: 'page' }}
              registry={BOARD_REGISTRY}
              icons={BOARD_ICONS}
              onAction={onBoardAction}
            />
          </PlaybookProvider>
        ),
      }}
      overlay={
        show ? (
          <PlaybookPanel
            play={play}
            refused={agent.refused}
            collapsed={folded}
            onCollapsedChange={setFolded}
            onClose={() => setShow(false)}
          />
        ) : null
      }
    />
  );
}

const meta: Meta<typeof AppLayoutAgents> = {
  title: 'Themes/AppAgents/Playbook',
  component: AppLayoutAgents,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The agents shell with a **playbook**: while it answers, the agent changes the work in steps.
 * A step is calls to a table by its panel id — update a cell, add rows, mark a row or a cell,
 * open a note on it — and the table does what it is told; the playbook only records the steps,
 * holds the position, and hands each table its calls.
 *
 * Pick a scope in the conversation: the answer streams, then the steps arrive and the work
 * follows the newest, showing its page. Step back and forward, or pick a step, and every table
 * shows the work as it stood then. A step calling a table the boards do not have is refused
 * before it is recorded. A story-only prototype of the RFC
 * `feat-2026-10-05-the-work-cannot-be-played-step-by-step`; the steps are in
 * `fixtures/themes/playbook.json`.
 */
export const Playbook: Story = {
  // Self-themed, as the agents shell is: no global toolbar decorator.
  parameters: { selfThemed: true },
  render: (args) => (
    <ThemeProvider defaultTheme="default" defaultMode="dark" storageKey={null}>
      <PlaybookApp {...args} />
    </ThemeProvider>
  ),
  args: {
    header: { left: 'Invana Studio' },
  },
  play: async ({ canvasElement, step }) => {
    const c = within(canvasElement);
    await step('Before the run the work opens on the welcome board, and the playbook has no steps', async () => {
      await expect(c.getByText('Welcome to accounts-graph')).toBeVisible();
      await expect(c.getAllByText('no steps yet').length).toBeGreaterThan(0);
    });
    await step('Picking a scope streams the answer', async () => {
      await userEvent.click(await c.findByText('Top 50 by ARR', {}, { timeout: 3000 }));
    });
    await step("The agent's steps arrive: the Accounts page opens and the newest note is open", async () => {
      await expect(await c.findByText('step 4 of 4', {}, { timeout: 15000 })).toBeInTheDocument();
      await expect(c.getByRole('button', { name: 'Who owns Initech' })).toBeInTheDocument();
      await expect(c.getByText('Recent funding')).toBeVisible();
      await expect(await within(document.body).findByText('Owns Initech Cloud: −7% growth, $8M bridge.')).toBeVisible();
    });
    await step('A step calling a table the boards do not have is refused, and never recorded', async () => {
      await expect(c.getByText(/Refused “Add Initech to the pipeline”: no target "pipeline"/)).toBeInTheDocument();
    });
    await step("Stepping back undoes a step's calls: Initech's bridge row leaves, then its growth returns to −4%", async () => {
      await userEvent.click(c.getByRole('button', { name: 'Previous step' }));
      await userEvent.click(c.getByRole('button', { name: 'Previous step' }));
      await waitFor(() => expect(c.queryByText('$8M')).not.toBeInTheDocument());
      await expect(c.getByText('-7%')).toBeInTheDocument();
      await userEvent.click(c.getByRole('button', { name: 'Previous step' }));
      await waitFor(() => expect(c.queryByText('-7%')).not.toBeInTheDocument());
      // The thread's answer may list −4% too; the board's cell is among them.
      await expect(c.getAllByText('-4%').length).toBeGreaterThan(0);
    });
    await step('Latest plays the work forward to the newest step again', async () => {
      await userEvent.click(c.getByRole('button', { name: 'Latest' }));
      await expect(await c.findByText('$8M')).toBeInTheDocument();
      await expect(c.getByText('-7%')).toBeInTheDocument();
      await expect(c.queryByRole('button', { name: 'Latest' })).not.toBeInTheDocument();
    });
  },
};
