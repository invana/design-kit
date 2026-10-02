import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { AppLayoutAgents } from '@invana/themes/app-agents/layout';
import { ThemeProvider, ThemeSelector } from '@invana/themes';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  Button,
  EmptyState,
  NavHorizontalItems,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
} from '@invana/ui';
import {
  ChatSession,
  useChatSession,
  type ConversationEvent,
  type ConversationSpec,
  type PatchScript,
} from '@invana/assistant';
import {
  Maximize,
  Minimize,
  Monitor,
  Moon,
  Palette,
  Settings,
  Sparkles,
  Star,
  Sun,
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
};

const ASK = 'q1';

/** Plays the thread in, then answers the scope ask the way the API would. */
function Conversation() {
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
    void chat.play(FIXTURE.answer);
  };

  const onEvent = (event: ConversationEvent) => {
    logEvent(event);
    if ((event.type === 'reply' || event.type === 'change') && event.turn === ASK) settle(event.value);
  };

  return <ChatSession spec={chat.spec} variant="cli" icons={CHAT_ICONS} onEvent={onEvent} onStop={chat.stop} />;
}

/**
 * The open session as the last crumb of the trail, drawn as the crumbs are; its
 * caret lists the other sessions, and picking one opens it.
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
          className: '!p-0 font-bold text-foreground hover:!bg-transparent hover:text-primary',
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
function SettingsButton() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="ghost" size="icon-sm" className="[&_svg]:size-5" title="Settings" onClick={() => setOpen(true)}>
        <Settings />
      </Button>
      <SettingsDialog open={open} onOpenChange={setOpen} scope="accounts-graph" />
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
 * streams in.
 */
export const Default: Story = {
  // Self-themed: the header's picker owns the theme, so the global toolbar
  // decorator stands down (as on the Explorer).
  parameters: { selfThemed: true },
  render: (args) => (
    <ThemeProvider defaultTheme="default" defaultMode="dark" storageKey={null}>
      <AppLayoutAgents {...args} />
    </ThemeProvider>
  ),
  args: {
    // As Studio's Explorer draws it: brand and the trail, ending in the open
    // session, on the left; stars, the theme, full screen, the assistant and settings on the right.
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
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <SessionCrumb />
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      ),
      // The Explorer's right side — the theme and the assistant — with the
      // graph's stars, a full-screen toggle and its settings.
      rightNavItems: [
        { name: 'Stars', label: <StarButton />, className: '!px-1 !py-0' },
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
        { name: 'Settings', label: <SettingsButton />, className: '!px-1 !py-0' },
      ],
    },
    leftSection: { content: <Conversation /> },
    mainSection: {
      content: (
        <EmptyState
          title="Canvas"
          description="The work the agents act on — a graph, a document, a dashboard."
        />
      ),
    },
  },
  play: async ({ canvasElement, step }) => {
    const c = within(canvasElement);
    await step('The trail shows one session; another is picked from its dropdown', async () => {
      await expect(c.queryByText('Board pack')).not.toBeInTheDocument();
      await userEvent.click(c.getByRole('button', { name: 'Sessions menu' }));
      await userEvent.click(await within(document.body).findByRole('menuitem', { name: 'Board pack' }));
      await expect(c.getByText('Board pack')).toBeInTheDocument();
    });
    await step('The scope ask plays in, and picking one streams the answer', async () => {
      await userEvent.click(await c.findByText('Top 50 by ARR', {}, { timeout: 3000 }));
      await expect(await c.findByText('Acme Robotics', {}, { timeout: 8000 })).toBeInTheDocument();
    });
    await step('Settings opens on the data: the datasets and the graph built from them', async () => {
      await userEvent.click(c.getByRole('button', { name: 'Settings' }));
      const dialog = within(await within(document.body).findByRole('dialog'));
      await expect(dialog.getByText('Crunchbase')).toBeInTheDocument();
      await expect(dialog.getByText('EVIDENCED_BY')).toBeInTheDocument();
    });
  },
};
