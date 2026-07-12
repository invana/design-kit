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
  RotateCw,
  Sparkles,
  Square,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Streaming is nothing more than a message whose text grows over time — the same
// in-place growth ChatSession's auto-follow is built to track. This story fakes a
// token stream to show that: the reply types itself out and the view stays pinned
// to the bottom as it does. Icons stay in the story, never in `@invana/ui`.

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** True while the reply is still streaming — shows the caret, hides actions. */
  streaming?: boolean;
  meta?: string;
}

// Canned replies streamed word-by-word. `send` cycles through them.
const REPLIES = [
  "Your graph has 8,412 nodes across 4 labels — Airport, City, Country, and Airline. Airports are the densest, with an average of 6.3 route relationships each. The most connected hub is Frankfurt (FRA) with 291 outbound routes, followed by Amsterdam (AMS) and Istanbul (IST). Traffic clusters into three loosely-connected regions: a European core, a North-American core, and a smaller Asia-Pacific web bridged mainly through Dubai and Singapore.",
  "Running the traversal now… I expanded outward from Frankfurt along ROUTE edges and pulled 100 neighbouring airports plus their 50 connecting routes. Most are within Europe, but a long-haul tail reaches JFK, GRU and NRT. Nothing looks orphaned — every node in this batch has at least one return path, so the subgraph stays fully connected.",
  "Here's what stands out: degree distribution is heavily skewed — a handful of mega-hubs carry the bulk of the connectivity while the long tail of regional airports has just one or two routes. That's a classic scale-free shape, so if you want to stress-test resilience, start by removing the top five hubs and watch how quickly the graph fragments.",
];

const SEED_QUESTION = "Summarise the airports graph for me.";

/** Blinking caret shown at the tail of a streaming reply. */
function StreamCaret() {
  return (
    <span
      className="ml-0.5 inline-block h-4 w-[2px] -mb-0.5 bg-foreground/70 animate-pulse"
      aria-hidden
    />
  );
}

function ChatSessionStreamingDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "u0", role: "user", content: SEED_QUESTION },
    { id: "a0", role: "assistant", content: "", streaming: true },
  ]);
  const [draft, setDraft] = useState("");
  const [isStreaming, setIsStreaming] = useState(true);
  const [model, setModel] = useState("qwen");

  // Track live timers so the stream (and Stop) clean up on unmount.
  const timerRef = useRef<number | null>(null);
  const replyIndexRef = useRef(0);
  const startedRef = useRef(false);

  const clearTimer = () => {
    if (timerRef.current != null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Type `fullText` into `replyId` one word at a time, then settle it with meta.
  const streamInto = (replyId: string, fullText: string) => {
    const words = fullText.split(" ");
    let i = 0;
    setIsStreaming(true);
    clearTimer();
    timerRef.current = window.setInterval(() => {
      i += 1;
      const partial = words.slice(0, i).join(" ");
      setMessages((prev) =>
        prev.map((m) => (m.id === replyId ? { ...m, content: partial } : m)),
      );
      if (i >= words.length) {
        clearTimer();
        setMessages((prev) =>
          prev.map((m) =>
            m.id === replyId
              ? {
                  ...m,
                  streaming: false,
                  meta: `local · qwen · ${words.length} tokens · ${(words.length * 0.045).toFixed(1)}s`,
                }
              : m,
          ),
        );
        setIsStreaming(false);
      }
    }, 55);
  };

  // Kick off the seed reply once on mount so the stream is visible immediately.
  // biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    streamInto("a0", REPLIES[0]);
    replyIndexRef.current = 1;
    return clearTimer;
  }, []);

  const stop = () => {
    clearTimer();
    setIsStreaming(false);
    // Freeze the partial reply where it stopped and drop the caret.
    setMessages((prev) =>
      prev.map((m) => (m.streaming ? { ...m, streaming: false } : m)),
    );
  };

  const send = () => {
    const text = draft.trim();
    if (!text || isStreaming) return;
    const userId = `u-${messages.length}`;
    const replyId = `a-${messages.length}`;
    setMessages((prev) => [
      ...prev,
      { id: userId, role: "user", content: text },
      { id: replyId, role: "assistant", content: "", streaming: true },
    ]);
    setDraft("");
    const reply = REPLIES[replyIndexRef.current % REPLIES.length];
    replyIndexRef.current += 1;
    // Let the new nodes mount before the interval starts writing to them.
    window.setTimeout(() => streamInto(replyId, reply), 60);
  };

  // Re-stream a settled reply in place — the "regenerate" affordance.
  const regenerate = (m: ChatMessage) => {
    if (isStreaming) return;
    setMessages((prev) =>
      prev.map((x) =>
        x.id === m.id ? { ...x, streaming: true, meta: undefined } : x,
      ),
    );
    window.setTimeout(() => streamInto(m.id, m.content), 60);
  };

  const options = (m: ChatMessage) => [
    {
      icon: <RotateCw className="w-3 h-3" />,
      label: "Regenerate",
      onClick: () => regenerate(m),
    },
    {
      icon: <Code className="w-3 h-3" />,
      label: "View query",
      onClick: () => console.log("View query", m.id),
    },
    {
      icon: <Copy className="w-3 h-3" />,
      label: "Copy",
      onClick: () => navigator.clipboard?.writeText(m.content),
    },
    {
      icon: <Info className="w-3 h-3" />,
      label: "View context",
      onClick: () => console.log("View context", m.id),
    },
  ];

  const composer = (
    <ChatSessionComposer
      value={draft}
      onChange={setDraft}
      onSend={send}
      onStop={stop}
      isRunning={isStreaming}
      placeholder="Ask anything about your graph…"
      sendIcon={<ArrowUp className="w-4 h-4" />}
      stopIcon={<Square className="w-3 h-3 fill-current" />}
      toolbarStart={
        <Select value={model} onValueChange={setModel}>
          <SelectTrigger className="h-7 w-full min-w-0 border-0 bg-transparent gap-1 px-2 hover:bg-accent text-muted-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="qwen">local · qwen/qwen3.6-27b</SelectItem>
            <SelectItem value="gpt">openai · gpt-4o-mini</SelectItem>
          </SelectContent>
        </Select>
      }
    />
  );

  return (
    // A sized panel so ChatSession has a height to fill.
    <div className="h-[720px] w-[440px] border border-border rounded-md bg-background overflow-hidden">
      <ChatSession footer={composer} autoScrollKey={messages.length}>
        {messages.map((m) =>
          m.role === "user" ? (
            <ChatSessionMessage key={m.id} role="user">
              {m.content}
            </ChatSessionMessage>
          ) : (
            <ChatSessionMessage
              key={m.id}
              role="assistant"
              icon={<Sparkles className="w-3.5 h-3.5 text-muted-foreground" />}
              meta={m.meta}
              actions={
                m.streaming ? undefined : (
                  <ChatSessionMessageOptions actions={options(m)} />
                )
              }
            >
              {m.content}
              {m.streaming && <StreamCaret />}
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
  render: () => <ChatSessionStreamingDemo />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Streaming: Story = {};
