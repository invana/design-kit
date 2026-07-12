import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ChatSession,
  ChatSessionComposer,
  ChatSessionMessage,
  ChatSessionMessageOptions,
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
  Share2,
  Square,
  ThumbsDown,
  ThumbsUp,
  Timer,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

// The reference design is icon-agnostic: lucide lives only here in the story,
// never inside `@invana/ui`. Icons are handed to the components as props.

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** Assistant meta line — e.g. "Cypher · 50 rows · 12ms". */
  meta?: string;
  feedback?: "up" | "down" | null;
  /** File names attached to a user turn. */
  attachments?: string[];
}

/** A removable file chip — used both in the composer tray and in sent turns. */
function AttachmentChip({
  name,
  onRemove,
}: {
  name: string;
  onRemove?: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 max-w-[160px] rounded-md border border-border bg-muted/40 px-2 py-1 text-xs">
      <Paperclip className="w-3 h-3 shrink-0 text-muted-foreground" />
      <span className="truncate">{name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 rounded-sm text-muted-foreground hover:text-foreground hover:bg-accent"
          aria-label={`Remove ${name}`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}

// A canned expand→result thread that mirrors the Sessions panel screenshot.
const SEED: ChatMessage[] = [
  {
    id: "u1",
    role: "user",
    content: 'Expand neighbours of "4:08b0108e-03ff-4806-87cc-8c26275ed31b:3933"',
  },
  {
    id: "a1",
    role: "assistant",
    content: "Added 100 nodes and 50 relationships.",
    meta: "Cypher · 50 rows · 12ms",
  },
  {
    id: "u2",
    role: "user",
    content: 'Expand neighbours of "4:08b0108e-03ff-4806-87cc-8c26275ed31b:4818"',
  },
  {
    id: "a2",
    role: "assistant",
    content: "Added 100 nodes and 50 relationships.",
    meta: "Cypher · 50 rows · 16ms",
  },
  {
    id: "u3",
    role: "user",
    content: 'Expand neighbours of "4:08b0108e-03ff-4806-87cc-8c26275ed31b:4819"',
  },
  {
    id: "a3",
    role: "assistant",
    content: "Added 24 nodes and 12 relationships.",
    meta: "Cypher · 12 rows · 5ms",
  },
];

function ChatSessionDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>(SEED);
  const [draft, setDraft] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("nl");
  const [model, setModel] = useState("qwen");
  const [timeoutS, setTimeoutS] = useState("120");
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (list: FileList | null) => {
    if (!list?.length) return;
    setFiles((prev) => [...prev, ...Array.from(list)]);
  };
  const removeFile = (index: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  const setFeedback = (id: string, value: "up" | "down") =>
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, feedback: m.feedback === value ? null : value }
          : m,
      ),
    );

  const send = () => {
    const text = draft.trim();
    const attached = files;
    // Allow sending with attachments only (no text), matching the design.
    if (!text && attached.length === 0) return;
    const userId = `u-${messages.length}`;
    const replyId = `a-${messages.length}`;
    // Stand-in for a real upload: the attachments travel with the message.
    console.log("Sending message", {
      text,
      files: attached.map((f) => ({ name: f.name, size: f.size, type: f.type })),
    });
    setMessages((prev) => [
      ...prev,
      {
        id: userId,
        role: "user",
        content: text,
        attachments: attached.length ? attached.map((f) => f.name) : undefined,
      },
      { id: replyId, role: "assistant", content: "Thinking…" },
    ]);
    setDraft("");
    setFiles([]);
    setIsRunning(true);
    // Fake a backend round-trip so the running state is visible.
    window.setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === replyId
            ? {
                ...m,
                content: "Added 8 nodes and 4 relationships.",
                meta: "Cypher · 4 rows · 4ms",
              }
            : m,
        ),
      );
      setIsRunning(false);
    }, 1400);
  };

  const runningId = isRunning ? messages[messages.length - 1]?.id : null;

  const options = (m: ChatMessage) =>
    [
      { icon: <RotateCw className="w-3 h-3" />, label: "Re-run query" },
      { icon: <Code className="w-3 h-3" />, label: "View query" },
      { icon: <Copy className="w-3 h-3" />, label: "Copy" },
      { icon: <Info className="w-3 h-3" />, label: "View context" },
      {
        icon: <ThumbsUp className="w-3 h-3" />,
        label: "Good answer",
        align: "end" as const,
        active: m.feedback === "up",
        activeClassName: "text-green-500 hover:text-green-500",
        onClick: () => setFeedback(m.id, "up"),
      },
      {
        icon: <ThumbsDown className="w-3 h-3" />,
        label: "Not what I wanted",
        align: "end" as const,
        active: m.feedback === "down",
        activeClassName: "text-red-500 hover:text-red-500",
        onClick: () => setFeedback(m.id, "down"),
      },
    ];

  const composer = (
    <ChatSessionComposer
      value={draft}
      onChange={setDraft}
      onSend={send}
      onStop={() => setIsRunning(false)}
      isRunning={isRunning}
      placeholder="Ask anything about your graph…"
      sendIcon={<ArrowUp className="w-4 h-4" />}
      stopIcon={<Square className="w-3 h-3 fill-current" />}
      // Enable the send button when there is text OR at least one attachment.
      sendDisabled={isRunning || (draft.trim().length === 0 && files.length === 0)}
      attachments={
        files.length > 0
          ? files.map((f, i) => (
              <AttachmentChip
                key={`${f.name}-${i}`}
                name={f.name}
                onRemove={() => removeFile(i)}
              />
            ))
          : undefined
      }
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
              <SelectItem value="300">5m</SelectItem>
            </SelectContent>
          </Select>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files);
              // Reset so selecting the same file again still fires onChange.
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-7 w-7 shrink-0 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent"
            title="Attach files"
            aria-label="Attach files"
          >
            <Paperclip className="w-4 h-4" />
          </button>
        </>
      }
    />
  );

  return (
    // A sized panel so ChatSession has a height to fill — matches the studio's
    // right-hand Sessions panel.
    <div className="h-[720px] w-[440px] border border-border rounded-md bg-background overflow-hidden">
      <ChatSession footer={composer} autoScrollKey={messages.length}>
        {messages.map((m) =>
          m.role === "user" ? (
            <ChatSessionMessage
              key={m.id}
              role="user"
              icon={<Share2 className="w-3.5 h-3.5" />}
            >
              {m.content && <span>{m.content}</span>}
              {m.attachments?.length ? (
                <span
                  className={`flex flex-wrap gap-1 ${m.content ? "mt-1.5" : ""}`}
                >
                  {m.attachments.map((name, i) => (
                    <AttachmentChip key={`${name}-${i}`} name={name} />
                  ))}
                </span>
              ) : null}
            </ChatSessionMessage>
          ) : (
            <ChatSessionMessage
              key={m.id}
              role="assistant"
              status={m.id === runningId ? "running" : "idle"}
              meta={m.meta}
              actions={
                m.id === runningId ? undefined : (
                  <ChatSessionMessageOptions actions={options(m)} />
                )
              }
            >
              {m.content}
            </ChatSessionMessage>
          ),
        )}
      </ChatSession>
    </div>
  );
}

const meta: Meta<typeof ChatSession> = {
  title: "UI/UI Extended/ChatSession",
  component: ChatSession,
  parameters: { layout: "centered" },
  render: () => <ChatSessionDemo />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
