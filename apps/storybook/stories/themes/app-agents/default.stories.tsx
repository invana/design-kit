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
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  EmptyState,
  NavHorizontalItems,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
  type NavHorizontalItem,
} from '@invana/ui';
import {
  ChatSession,
  useChatSession,
  type ConversationEvent,
  type ConversationSpec,
  type PatchScript,
} from '@invana/assistant';
import {
  Monitor,
  Moon,
  MoreHorizontal,
  Palette,
  Sparkles,
  Sun,
} from 'lucide-react';

import data from '../../../fixtures/themes/app-agents.json';
import { CHAT_ICONS, logEvent } from '../../assistant/chat-kit';

/**
 * The thread as the API would send it: the spec it opens on, the ask that plays in
 * after it, and the answer that streams once the ask is answered.
 */
const FIXTURE = data as unknown as {
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

/** How many sessions the header shows before the rest fold into `…`. */
const SHOWN = 3;

/**
 * The open sessions as header nav: the first three, then `…` holding the rest.
 * A session picked from `…` takes the last visible place, so the open one is
 * always on the strip.
 */
function SessionsNav() {
  const [order, setOrder] = React.useState(FIXTURE.sessions);
  const [active, setActive] = React.useState(order[0]);

  const open = (name: string) => {
    setActive(name);
    if (order.indexOf(name) >= SHOWN) {
      setOrder((o) => [...o.slice(0, SHOWN - 1), name, ...o.slice(SHOWN - 1).filter((n) => n !== name)]);
    }
  };

  const items: NavHorizontalItem[] = [
    ...order.slice(0, SHOWN).map((name) => ({ name, label: name, onClick: () => open(name) })),
    {
      name: 'More sessions',
      icon: MoreHorizontal,
      menuItems: order.slice(SHOWN).map((name) => ({ id: name, label: name, onSelect: () => open(name) })),
    },
  ];

  return <NavHorizontalItems items={items} activeKey={active} />;
}

const MODE_ICONS = { light: Sun, dark: Moon, system: Monitor };

/** The header theme picker, as the Explorer ships it. It drives the story's own `ThemeProvider`. */
function ThemeMenu() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-xs" title="Theme & appearance">
          <Palette />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <ThemeSelector layout="form" showAccent={false} modeIcons={MODE_ICONS} />
      </PopoverContent>
    </Popover>
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
    // As Studio's Explorer draws it: brand, the trail and the open sessions on
    // the left; what the canvas holds, the theme and the assistant on the right.
    header: {
      left: (
        <div className="flex items-center gap-1">
          <span className="select-none px-2 text-xl font-bold">Invana Studio</span>
          <Separator orientation="vertical" className="h-4" />
          <Breadcrumb className="px-1.5">
            <BreadcrumbList className="gap-1.5 font-bold text-foreground sm:gap-1.5">
              <BreadcrumbItem>
                <BreadcrumbLink href="#" className="hover:text-primary">
                  ravi-merugu
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-muted-foreground" />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-bold">accounts-graph</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Separator orientation="vertical" className="h-4" />
          <SessionsNav />
        </div>
      ),
      // The Explorer's right side: what the canvas holds, the theme, the assistant.
      rightNavItems: [
        {
          name: 'Entities in view',
          label: <span className="tabular-nums text-muted-foreground">9 of 12,408</span>,
          className: '!px-1.5',
        },
        { name: 'Theme & appearance', label: <ThemeMenu />, className: '!p-0' },
        {
          name: 'Assistant',
          label: 'Assistant',
          icon: Sparkles,
          iconClassName: 'size-4',
          onClick: () => {},
          className: '!bg-primary/10 !text-primary !px-2 !py-1 hover:!bg-primary/15',
        },
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
    await step('A session folded under … takes the last visible place when picked', async () => {
      await expect(c.queryByText('Board pack')).not.toBeInTheDocument();
      await userEvent.click(c.getByRole('button', { name: /More sessions/ }));
      await userEvent.click(await within(document.body).findByRole('menuitem', { name: 'Board pack' }));
      await expect(c.getByText('Board pack')).toBeInTheDocument();
      await expect(c.queryByText('SOC 2 gaps')).not.toBeInTheDocument();
    });
    await step('The scope ask plays in, and picking one streams the answer', async () => {
      await userEvent.click(await c.findByText('Top 50 by ARR', {}, { timeout: 3000 }));
      await expect(await c.findByText('Acme Robotics', {}, { timeout: 8000 })).toBeInTheDocument();
    });
  },
};
