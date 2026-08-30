import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ChatSession,
  ChatSessionActivityRow,
  type ChatSessionActivityStatus,
  ChatSessionActivitySubLine,
  ChatSessionComposer,
  ChatSessionDisclosure,
  ChatSessionMessageOptions,
  ChatSessionProgressLine,
  ChatSessionPromptRow,
  ChatSessionStatusBar,
  ChatSessionTaskGroup,
  ChatSessionTaskRow,
  type ChatSessionTaskStatus,
} from "@invana/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@invana/forms";
import {
  ArrowUp,
  Code,
  Copy,
  Info,
  Paperclip,
  RotateCw,
  Square,
  ThumbsDown,
  ThumbsUp,
  Timer,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Icons stay story-side: the chat-session family is icon-agnostic and takes
// glyph/icon nodes as props.

interface ConsoleItem {
  id: string;
  kind: "prompt" | "activity";
  status?: ChatSessionActivityStatus;
  text: string;
  /** "└"-prefixed detail line under an activity row. */
  sub?: string;
  /** Generated query shown in a disclosure under the answer. */
  query?: string;
  queryMeta?: string;
  queryOpen?: boolean;
  /** Show the re-run / view-query / copy / vote toolbar. */
  withOptions?: boolean;
  feedback?: "up" | "down" | null;
}

interface ConsoleTask {
  id: string;
  name: string;
  description: string;
  status: ChatSessionTaskStatus;
  meta?: string;
}

const CYPHER = `MATCH (n)-[r]-(m)
WHERE elementId(n) = "4:08b0…:3933"
RETURN n, r, m LIMIT 50`;

// Seeded mid-session so every row type is visible before the first send.
const SEED_ITEMS: ConsoleItem[] = [
  {
    id: "s1",
    kind: "prompt",
    text: "stop all the background tasks and summarise what changed",
  },
  {
    id: "s2",
    kind: "activity",
    status: "success",
    text: "schema-agent(Collect affected node types)",
    sub: "Backgrounded agent · 2 queries running",
  },
  {
    id: "s3",
    kind: "activity",
    status: "info",
    text: "I've asked the schema agent to confirm what changed — one moment while it checks.",
  },
  {
    id: "s4",
    kind: "activity",
    status: "warning",
    text: "API Error: can't reach the query server — retrying (ENOTFOUND)",
  },
  {
    id: "s5",
    kind: "activity",
    status: "success",
    text: "All background tasks are stopped. Two label counts changed while the sync ran; nothing else was touched.",
    withOptions: true,
    query: CYPHER,
    queryMeta: "50 rows · 12ms",
    queryOpen: false,
  },
];

const SEED_TASKS: ConsoleTask[] = [
  { id: "t-main", name: "main", description: "", status: "running" },
  {
    id: "t-schema",
    name: "schema-agent",
    description: "Collect affected node types",
    status: "success",
    meta: "2s · ↑ 18.4k tokens",
  },
  {
    id: "t-rename",
    name: "rename-review",
    description: "Rename HideShowLayersPanel — keep current behavior?",
    status: "needs-input",
    meta: "38d",
  },
];

function AgentConsoleDemo() {
  const [items, setItems] = useState<ConsoleItem[]>(SEED_ITEMS);
  const [tasks, setTasks] = useState<ConsoleTask[]>(SEED_TASKS);
  const [view, setView] = useState<"chat" | "tasks">("chat");
  const [draft, setDraft] = useState("");
  const [mode, setMode] = useState("nl");
  const [model, setModel] = useState("qwen");
  const [timeoutS, setTimeoutS] = useState("120");
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timersRef = useRef<number[]>([]);

  // Clear all simulation timers (stop button, unmount).
  const clearTimers = () => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  };
  useEffect(() => clearTimers, []);

  // Tick the progress line's elapsed readout while a run is in flight.
  useEffect(() => {
    if (!isRunning) return;
    const interval = window.setInterval(
      () => setElapsed((s) => s + 1),
      1000,
    );
    return () => window.clearInterval(interval);
  }, [isRunning]);

  const updateTask = (id: string, patch: Partial<ConsoleTask>) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    );

  const run = (prompt: string) => {
    const stamp = Date.now();
    const taskId = `t-${stamp}`;
    setItems((prev) => [
      ...prev,
      { id: `p-${stamp}`, kind: "prompt", text: prompt },
    ]);
    setTasks((prev) => [
      ...prev,
      {
        id: taskId,
        name: "query-agent",
        description: "Translate prompt and run it",
        status: "running",
      },
    ]);
    setElapsed(0);
    setIsRunning(true);

    // Fake agent lifecycle: spawn note → settled answer.
    timersRef.current.push(
      window.setTimeout(() => {
        setItems((prev) => [
          ...prev,
          {
            id: `a-${stamp}-spawn`,
            kind: "activity",
            status: "success",
            text: "query-agent(Translate prompt to Cypher)",
            sub: "Backgrounded agent · 1 query running",
          },
        ]);
      }, 900),
      window.setTimeout(() => {
        setItems((prev) => [
          ...prev,
          {
            id: `a-${stamp}-done`,
            kind: "activity",
            status: "success",
            text: "Added 24 nodes and 12 relationships.",
            withOptions: true,
            query: CYPHER,
            queryMeta: "12 rows · 5ms",
            queryOpen: false,
          },
        ]);
        updateTask(taskId, { status: "success", meta: "3s · ↑ 4.1k tokens" });
        setIsRunning(false);
      }, 2600),
    );
  };

  const send = () => {
    const text = draft.trim();
    if (!text || isRunning) return;
    setDraft("");
    run(text);
  };

  const stop = () => {
    clearTimers();
    setIsRunning(false);
    setItems((prev) => [
      ...prev,
      {
        id: `stop-${Date.now()}`,
        kind: "activity",
        status: "warning",
        text: "Interrupted · run stopped by user",
      },
    ]);
    setTasks((prev) =>
      prev.map((t) =>
        t.status === "running" && t.id !== "t-main"
          ? { ...t, status: "needs-input", meta: "stopped" }
          : t,
      ),
    );
  };

  const patchItem = (id: string, patch: Partial<ConsoleItem>) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    );

  const lastPrompt = [...items].reverse().find((i) => i.kind === "prompt");

  const options = (item: ConsoleItem) => [
    {
      icon: <RotateCw className="w-3 h-3" />,
      label: "Re-run query",
      disabled: isRunning,
      onClick: () => lastPrompt && run(lastPrompt.text),
    },
    {
      icon: <Code className="w-3 h-3" />,
      label: "View query",
      active: item.queryOpen,
      onClick: () => patchItem(item.id, { queryOpen: !item.queryOpen }),
    },
    {
      icon: <Copy className="w-3 h-3" />,
      label: "Copy",
      onClick: () => navigator.clipboard?.writeText(item.text),
    },
    { icon: <Info className="w-3 h-3" />, label: "View context" },
    {
      icon: <ThumbsUp className="w-3 h-3" />,
      label: "Good answer",
      align: "end" as const,
      active: item.feedback === "up",
      activeClassName: "text-success hover:text-success",
      onClick: () =>
        patchItem(item.id, {
          feedback: item.feedback === "up" ? null : "up",
        }),
    },
    {
      icon: <ThumbsDown className="w-3 h-3" />,
      label: "Not what I wanted",
      align: "end" as const,
      active: item.feedback === "down",
      activeClassName: "text-destructive hover:text-destructive",
      onClick: () =>
        patchItem(item.id, {
          feedback: item.feedback === "down" ? null : "down",
        }),
    },
  ];

  const runningCount = tasks.filter((t) => t.status === "running").length;
  const needsInput = tasks.filter((t) => t.status === "needs-input");
  const completed = tasks.filter((t) => t.status === "success");
  const running = tasks.filter((t) => t.status === "running");

  const viewButton = (target: "chat" | "tasks", label: string) => (
    <button
      type="button"
      onClick={() => setView(target)}
      className={
        view === target
          ? "font-medium text-foreground"
          : "text-muted-foreground hover:text-foreground"
      }
    >
      {label}
    </button>
  );

  // ── Footer: pinned tasks strip + composer + status bar, all live. ──
  const footer = (
    <>
      {view === "chat" && (
        <div className="border-t border-border px-3 py-1.5">
          {tasks
            .filter((t) => t.id === "t-main" || t.status === "running")
            .map((t) => (
              <ChatSessionTaskRow
                key={t.id}
                status={t.status}
                name={t.name}
                description={t.description}
                meta={t.meta}
                onClick={() => setView("tasks")}
              />
            ))}
        </div>
      )}

      <ChatSessionComposer
        value={draft}
        onChange={setDraft}
        onSend={send}
        onStop={stop}
        isRunning={isRunning}
        placeholder={
          mode === "ql"
            ? "MATCH (n) WHERE … RETURN n"
            : "Ask anything about your graph…"
        }
        textareaClassName={mode === "ql" ? "font-mono" : undefined}
        sendIcon={<ArrowUp className="w-4 h-4" />}
        stopIcon={<Square className="w-3 h-3 fill-current" />}
        toolbarStart={
          <>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger className="h-7 w-auto shrink-0 border-0 bg-transparent gap-1 px-2 hover:bg-accent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nl">Natural Language</SelectItem>
                <SelectItem value="ql">Query Language</SelectItem>
              </SelectContent>
            </Select>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="h-7 w-full min-w-0 border-0 bg-transparent gap-1 px-2 hover:bg-accent text-muted-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="qwen">local · qwen/qwen3.6-27b</SelectItem>
                <SelectItem value="gpt">openai · gpt-4o-mini</SelectItem>
                <SelectItem value="claude">anthropic · claude-sonnet-5</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
        toolbarEnd={
          <>
            <Select value={timeoutS} onValueChange={setTimeoutS}>
              <SelectTrigger
                className="h-7 w-auto shrink-0 border-0 bg-transparent gap-1 px-2 hover:bg-accent text-muted-foreground"
                title="LLM + query timeout"
              >
                <Timer className="w-3.5 h-3.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30s</SelectItem>
                <SelectItem value="60">1m</SelectItem>
                <SelectItem value="120">2m</SelectItem>
              </SelectContent>
            </Select>
            <button
              type="button"
              className="h-7 w-7 shrink-0 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent"
              title="Attach files"
              aria-label="Attach files"
            >
              <Paperclip className="w-4 h-4" />
            </button>
          </>
        }
      />

      <ChatSessionStatusBar
        start={
          <>
            {viewButton("chat", "Chat")}
            {viewButton(
              "tasks",
              `Tasks (${tasks.length - 1})`,
            )}
            <span className="text-primary">▸▸ auto</span>
          </>
        }
        end={
          <>
            <span>
              {runningCount} agent{runningCount === 1 ? "" : "s"}
            </span>
            <span>? for shortcuts</span>
          </>
        }
      />
    </>
  );

  return (
    <div className="h-[720px] w-[480px] border border-border rounded-md bg-background overflow-hidden">
      <ChatSession
        footer={footer}
        autoScrollKey={`${view}-${items.length}-${isRunning}`}
      >
        {view === "chat" ? (
          <>
            {items.map((item) =>
              item.kind === "prompt" ? (
                <ChatSessionPromptRow key={item.id}>
                  {item.text}
                </ChatSessionPromptRow>
              ) : (
                <ChatSessionActivityRow
                  key={item.id}
                  status={item.status}
                  actions={
                    item.withOptions ? (
                      <ChatSessionMessageOptions actions={options(item)} />
                    ) : undefined
                  }
                  footer={
                    <>
                      {item.sub && (
                        <ChatSessionActivitySubLine>
                          {item.sub}
                        </ChatSessionActivitySubLine>
                      )}
                      {item.query && item.queryOpen && (
                        <ChatSessionDisclosure
                          label="cypher"
                          meta={item.queryMeta}
                          defaultOpen
                          contentClassName="font-mono whitespace-pre"
                        >
                          {item.query}
                        </ChatSessionDisclosure>
                      )}
                    </>
                  }
                >
                  {item.text}
                </ChatSessionActivityRow>
              ),
            )}
            {isRunning && (
              <ChatSessionProgressLine elapsed={`${elapsed}s`}>
                Waiting for 1 background agent to finish
              </ChatSessionProgressLine>
            )}
          </>
        ) : (
          <>
            {running.length > 0 && (
              <ChatSessionTaskGroup heading="Running">
                {running.map((t) => (
                  <ChatSessionTaskRow
                    key={t.id}
                    status={t.status}
                    name={t.name}
                    description={t.description}
                    meta={t.meta}
                    onClick={() => setView("chat")}
                  />
                ))}
              </ChatSessionTaskGroup>
            )}
            {needsInput.length > 0 && (
              <ChatSessionTaskGroup heading="Needs input">
                {needsInput.map((t) => (
                  <ChatSessionTaskRow
                    key={t.id}
                    status={t.status}
                    name={t.name}
                    description={t.description}
                    meta={t.meta}
                    onClick={() => setView("chat")}
                  />
                ))}
              </ChatSessionTaskGroup>
            )}
            {completed.length > 0 && (
              <ChatSessionTaskGroup heading="Completed">
                {completed.map((t) => (
                  <ChatSessionTaskRow
                    key={t.id}
                    status={t.status}
                    name={t.name}
                    description={t.description}
                    meta={t.meta}
                    onClick={() => setView("chat")}
                  />
                ))}
              </ChatSessionTaskGroup>
            )}
          </>
        )}
      </ChatSession>
    </div>
  );
}

const meta: Meta<typeof ChatSession> = {
  title: "UI/UI Extended/ChatSession",
  component: ChatSession,
  parameters: { layout: "centered" },
  render: () => <AgentConsoleDemo />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AgentConsole: Story = {};
