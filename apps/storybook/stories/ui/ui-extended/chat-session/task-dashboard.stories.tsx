import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ChatSession,
  ChatSessionComposer,
  ChatSessionStatusBar,
  ChatSessionTaskGroup,
  ChatSessionTaskRow,
} from "@invana/ui";
import { ArrowUp } from "lucide-react";
import { useState } from "react";

// The session dashboard: what a chat product shows between sessions — every
// background task grouped by state, with a composer to start a new one.

const NEEDS_INPUT = [
  {
    id: "n1",
    name: "rename-review",
    description: "Focus auto-show hidden elements on select, or keep current behavior?",
    meta: "38d",
  },
];

const COMPLETED = [
  {
    id: "c1",
    name: "positioning",
    description: '"Invana becomes the OS" ratified as internal north star',
    meta: "2m",
  },
  {
    id: "c2",
    name: "knowledge-access",
    description: '"Team superpowers" showcase frame ratified with edits',
    meta: "2m",
  },
  {
    id: "c3",
    name: "value-proposition",
    description: "Invana is a trust product, not ease — pitch drafted",
    meta: "1m",
  },
  {
    id: "c4",
    name: "product-dpr",
    description: "Copying v3 to mvp/08-2026.1/ and restoring v2 in place",
    meta: "1h",
  },
  {
    id: "c5",
    name: "rfc-drafts",
    description: "mvp.md, engine.md, api.md updated; model graph sliced",
    meta: "9m",
  },
];

function TaskDashboardDemo() {
  const [draft, setDraft] = useState("");
  const [opened, setOpened] = useState<string | null>(null);

  const row = (
    t: { id: string; name: string; description: string; meta: string },
    status: "needs-input" | "success",
  ) => (
    <ChatSessionTaskRow
      key={t.id}
      status={status}
      name={t.name}
      description={t.description}
      meta={t.meta}
      onClick={() => setOpened(t.id)}
      className={opened === t.id ? "bg-accent" : undefined}
    />
  );

  return (
    <div className="h-[560px] w-[760px] border border-border rounded-md bg-background overflow-hidden">
      <ChatSession
        bodyClassName="p-4 gap-5"
        footer={
          <>
            <ChatSessionComposer
              value={draft}
              onChange={setDraft}
              onSend={() => setDraft("")}
              placeholder="Describe a task for a new session…"
              sendIcon={<ArrowUp className="w-4 h-4" />}
            />
            <ChatSessionStatusBar
              start={<span className="text-primary">▸▸ auto mode</span>}
              end={
                <>
                  <span>1 awaiting input · 5 completed</span>
                  <span>? for shortcuts</span>
                </>
              }
            />
          </>
        }
      >
        <ChatSessionTaskGroup heading="Needs input">
          {NEEDS_INPUT.map((t) => row(t, "needs-input"))}
        </ChatSessionTaskGroup>
        <ChatSessionTaskGroup heading="Completed">
          {COMPLETED.map((t) => row(t, "success"))}
        </ChatSessionTaskGroup>
      </ChatSession>
    </div>
  );
}

const meta: Meta<typeof ChatSessionTaskGroup> = {
  title: "UI/UI Extended/ChatSession",
  component: ChatSessionTaskGroup,
  parameters: { layout: "centered" },
  render: () => <TaskDashboardDemo />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const TaskDashboard: Story = {};
