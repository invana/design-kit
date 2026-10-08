import * as React6 from 'react';
import { ANSWER_KINDS, BLOCK_RENDERERS, ASK_KINDS, useStreamedSpec, ScopeBlock, CitationsBlock, NarrativeBlock, Placeholder, ActionRow, SuggestionChips, patchesOf as patchesOf$1, fromNdjson as fromNdjson$1, fromEventSource as fromEventSource$1, playScript as playScript$1, offsetScript as offsetScript$1, applyBlockPatch, BlockPatchError } from '@invana/blocks';
export { ANSWER_KINDS, ASK_KINDS, BLOCKS, ConfirmCard, Placeholder, SuggestionChips, scriptLength } from '@invana/blocks';
import { cn, EmissionCard as EmissionCard$1, EmissionBody as EmissionBody$1, ChatSessionCaret as ChatSessionCaret$1, ChatSession as ChatSession$1, ChatSessionStatusBar as ChatSessionStatusBar$1, ChatSessionTaskGroup as ChatSessionTaskGroup$1, ChatSessionPromptRow as ChatSessionPromptRow$1, ChatSessionComposer as ChatSessionComposer$1, ChatSessionMessage as ChatSessionMessage$1, ChatSessionTaskRow as ChatSessionTaskRow$1, ChatSessionActivitySubLine as ChatSessionActivitySubLine$1, ChatSessionDisclosure as ChatSessionDisclosure$1, ChatSessionProgressLine as ChatSessionProgressLine$1, ChatSessionActivityRow as ChatSessionActivityRow$1, ClarifyCard as ClarifyCard$1, Eyebrow, PropertyList, PropertyRow, Skeleton, ChatSessionMessageOptions as ChatSessionMessageOptions$1, ChatSessionContextChip as ChatSessionContextChip$1, ChatSessionDisclosureCode as ChatSessionDisclosureCode$1, ChatSessionDisclosureSteps as ChatSessionDisclosureSteps$1, CitationMarker as CitationMarker$1, ClarifyActions as ClarifyActions$1, ClarifyFootnote as ClarifyFootnote$1, EmissionHeader as EmissionHeader$1, TemplatePicker as TemplatePicker$1, chatSessionGutterClass as chatSessionGutterClass$1 } from '@invana/ui';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@invana/forms';

// src/styles/chat-session.tsx
function answerToPage(turn) {
  const blocks = turn.blocks.filter(
    (b) => BLOCK_RENDERERS[b.kind] != null && b.status !== "loading" && b.status !== "empty"
  );
  return { title: turn.title, sections: [{ blocks }] };
}

// src/answers/index.ts
var EmissionCard = EmissionCard$1;
var EmissionBody = EmissionBody$1;
var EmissionHeader = EmissionHeader$1;
var CitationMarker = CitationMarker$1;
var TemplatePicker = TemplatePicker$1;
var ChatSessionFrame = ChatSession$1;
var ChatSessionMessage = ChatSessionMessage$1;
var ChatSessionMessageOptions = ChatSessionMessageOptions$1;
var ChatSessionComposer = ChatSessionComposer$1;
var ChatSessionActivityRow = ChatSessionActivityRow$1;
var ChatSessionActivitySubLine = ChatSessionActivitySubLine$1;
var chatSessionGutterClass = chatSessionGutterClass$1;
var ChatSessionPromptRow = ChatSessionPromptRow$1;
var ChatSessionProgressLine = ChatSessionProgressLine$1;
var ChatSessionCaret = ChatSessionCaret$1;
var ChatSessionDisclosure = ChatSessionDisclosure$1;
var ChatSessionDisclosureCode = ChatSessionDisclosureCode$1;
var ChatSessionDisclosureSteps = ChatSessionDisclosureSteps$1;
var ChatSessionTaskRow = ChatSessionTaskRow$1;
var ChatSessionTaskGroup = ChatSessionTaskGroup$1;
var ChatSessionStatusBar = ChatSessionStatusBar$1;
var ChatSessionContextChip = ChatSessionContextChip$1;
var focus = /* @__PURE__ */ new Map();
var listeners = /* @__PURE__ */ new Set();
function set(turn, n) {
  if (focus.get(turn) === n) return;
  focus.set(turn, n);
  listeners.forEach((l) => l());
}
function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
function useCiteFocus(turn, initial) {
  const pointed = React6.useSyncExternalStore(
    subscribe,
    () => focus.get(turn),
    () => void 0
  );
  return [pointed ?? initial, (n) => set(turn, n)];
}
function toEvent(turn, action, value, block) {
  switch (action) {
    case "reply":
      return { type: "reply", turn, value };
    case "change":
      return { type: "change", turn, value };
    case "skip":
      return { type: "skip", turn };
    case "prompt":
      return { type: "prompt", text: String(value) };
    case "scope": {
      const edit = value;
      return typeof edit?.part === "number" ? { type: "scope", turn, part: edit.part, value: edit.value } : void 0;
    }
    case "open":
      return block >= 0 ? { type: "open", turn, block } : void 0;
    case "action":
      return { type: "action", turn, action: String(value) };
    default:
      return value === void 0 ? { type: "action", turn, action } : { type: "action", turn, action, value };
  }
}
function answerBlock(kind) {
  const Renderer = BLOCK_RENDERERS[kind];
  function AnswerBlock({ turn, block, onEvent }) {
    const index = turn.blocks.indexOf(block);
    return /* @__PURE__ */ jsx(
      Renderer,
      {
        spec: block,
        seamless: true,
        onAction: (action, value) => {
          const event = toEvent(turn.id, action, value, index);
          if (event) onEvent(event);
        }
      }
    );
  }
  AnswerBlock.displayName = `Answer(${kind})`;
  return AnswerBlock;
}
function askBlock(kind) {
  const Renderer = BLOCK_RENDERERS[kind];
  function AskBlock({ turn, options, onEvent }) {
    return /* @__PURE__ */ jsx(
      Renderer,
      {
        spec: options,
        state: turn.state,
        value: turn.value,
        id: turn.id,
        seamless: true,
        onAction: (action, value) => {
          const event = toEvent(turn.id, action, value, -1);
          if (event) onEvent(event);
        }
      }
    );
  }
  AskBlock.displayName = `Ask(${kind})`;
  return AskBlock;
}
function NarrativeAnswer({ block, turn }) {
  const [active, setActive] = useCiteFocus(turn.id, block.active);
  const writing = turn.state === "running" && turn.blocks[turn.blocks.length - 1] === block;
  return /* @__PURE__ */ jsx(
    NarrativeBlock,
    {
      spec: block,
      active,
      onActiveChange: setActive,
      trailing: writing ? /* @__PURE__ */ jsx(ChatSessionCaret, {}) : null
    }
  );
}
function CitationsAnswer({ block, turn }) {
  const [active] = useCiteFocus(turn.id, block.active);
  return /* @__PURE__ */ jsx(CitationsBlock, { spec: block, active });
}
function ScopeAnswer({ block, turn, onEvent }) {
  const fromEnvelope = !turn.blocks.includes(block);
  const fixed = fromEnvelope && turn.envelope?.freshness ? [block.parts.length - 1] : void 0;
  return /* @__PURE__ */ jsx(
    ScopeBlock,
    {
      spec: block,
      fixed,
      onAction: (action, value) => {
        const event = toEvent(turn.id, action, value, -1);
        if (event) onEvent(event);
      }
    }
  );
}
var ProposalBody = answerBlock("proposal");
function ProposalAnswer(props) {
  return /* @__PURE__ */ jsx(EmissionCard, { kind: "proposal", title: props.block.title, citation: props.block.done?.at, children: /* @__PURE__ */ jsx(EmissionBody, { children: /* @__PURE__ */ jsx(ProposalBody, { ...props }) }) });
}
var ANSWER_WRAPPERS = {
  narrative: NarrativeAnswer,
  citations: CitationsAnswer,
  scope: ScopeAnswer,
  proposal: ProposalAnswer
};
var ANSWER_RENDERERS = Object.fromEntries(
  ANSWER_KINDS.map((kind) => [kind, BLOCK_RENDERERS[kind] ? ANSWER_WRAPPERS[kind] ?? answerBlock(kind) : null])
);
var ASK_RENDERERS = Object.fromEntries(
  ASK_KINDS.map((kind) => [kind, BLOCK_RENDERERS[kind] ? askBlock(kind) : null])
);

// src/conversations/registry.ts
var BUILT_IN_ASKS = ASK_RENDERERS;
var BUILT_IN_BLOCKS = ANSWER_RENDERERS;
var BUILT_IN_ASK_TRAITS = {
  suggestions: { frame: "none" },
  confirm: { kind: "confirm" },
  approval: { kind: "proposal" }
};
var BUILT_IN_BLOCK_TRAITS = {
  proposal: { placement: "own" }
};
function resolveRegistry(extra) {
  const askTraits = { ...BUILT_IN_ASK_TRAITS, ...extra?.askTraits };
  const blockTraits = { ...BUILT_IN_BLOCK_TRAITS, ...extra?.blockTraits };
  return {
    asks: { ...BUILT_IN_ASKS, ...extra?.asks },
    blocks: { ...BUILT_IN_BLOCKS, ...extra?.blocks },
    askTraits: (kind) => ({ frame: "card", ...askTraits[kind] }),
    blockTraits: (kind) => ({ placement: "card", ...blockTraits[kind] })
  };
}
var PatchError = class extends Error {
};
function onTurn(spec, id, fn) {
  const index = spec.turns.findIndex((t) => t.id === id);
  if (index < 0) throw new PatchError(`No turn "${id}" in conversation "${spec.id}".`);
  const turns = spec.turns.slice();
  turns[index] = fn(turns[index]);
  return { ...spec, turns };
}
function asAnswer(turn, op) {
  if (turn.role !== "assistant" || turn.kind !== "answer") {
    throw new PatchError(`"${op}" applies to an answer; turn "${turn.id}" is not one.`);
  }
  return turn;
}
function onStep(answer, id, op, fn) {
  const trace = answer.trace ?? [];
  const at = trace.findIndex((s) => s.id === id);
  if (at < 0) throw new PatchError(`"${op}": no step "${id}" on turn "${answer.id}".`);
  return { ...answer, trace: trace.map((s, i) => i === at ? fn(s) : s) };
}
function patchBlock(answer, op, index, patch) {
  const at = index ?? answer.blocks.length - 1;
  const block = answer.blocks[at];
  if (!block) throw new PatchError(`"${op}": turn "${answer.id}" has no block ${at}.`);
  const blocks = answer.blocks.slice();
  try {
    blocks[at] = applyBlockPatch(block, patch);
  } catch (error) {
    if (error instanceof BlockPatchError) {
      throw new PatchError(`"${op}": block ${at} on turn "${answer.id}": ${error.message}`);
    }
    throw error;
  }
  return { ...answer, blocks };
}
function applyPatch(spec, patch) {
  switch (patch.op) {
    case "add-turn":
      if (spec.turns.some((t) => t.id === patch.turn.id)) {
        throw new PatchError(`Turn "${patch.turn.id}" already exists.`);
      }
      return { ...spec, turns: [...spec.turns, patch.turn] };
    case "set-state":
      return onTurn(spec, patch.turn, (turn) => {
        if (turn.role !== "assistant") throw new PatchError(`Turn "${turn.id}" has no state.`);
        if (turn.kind === "ask") {
          return {
            ...turn,
            state: patch.state,
            ...patch.value !== void 0 ? { value: patch.value } : {}
          };
        }
        return { ...turn, state: patch.state };
      });
    case "add-block":
      return onTurn(spec, patch.turn, (turn) => {
        const answer = asAnswer(turn, patch.op);
        return { ...answer, blocks: [...answer.blocks, patch.block] };
      });
    case "patch-block":
      return onTurn(spec, patch.turn, (turn) => patchBlock(asAnswer(turn, patch.op), patch.op, patch.block, patch.patch));
    case "update-block":
      return onTurn(
        spec,
        patch.turn,
        (turn) => patchBlock(asAnswer(turn, patch.op), patch.op, patch.block, { op: "set", fields: patch.fields })
      );
    case "append-text":
      return onTurn(
        spec,
        patch.turn,
        (turn) => patchBlock(asAnswer(turn, patch.op), patch.op, patch.block, { op: "append", at: [patch.field ?? "text"], text: patch.text })
      );
    case "add-trace-step":
      return onTurn(spec, patch.turn, (turn) => {
        const answer = asAnswer(turn, patch.op);
        const trace = answer.trace ?? [];
        const at = patch.step.id ? trace.findIndex((s) => s.id === patch.step.id) : -1;
        const next = at >= 0 ? trace.map((s, i) => i === at ? patch.step : s) : [...trace, patch.step];
        return { ...answer, trace: next };
      });
    case "update-trace-step":
      return onTurn(
        spec,
        patch.turn,
        (turn) => onStep(asAnswer(turn, patch.op), patch.step, patch.op, (s) => ({ ...s, ...patch.fields, id: s.id }))
      );
    case "append-thinking":
      return onTurn(
        spec,
        patch.turn,
        (turn) => onStep(asAnswer(turn, patch.op), patch.step, patch.op, (s) => ({
          ...s,
          thinking: (s.thinking ?? "") + patch.text
        }))
      );
    case "update-turn":
      return onTurn(spec, patch.turn, (turn) => ({ ...turn, ...patch.fields, id: turn.id }));
    case "set-records": {
      const models = spec.access?.models ?? [];
      if (!spec.access || !models.some((m) => m.id === patch.model)) {
        throw new PatchError(`"set-records": no model "${patch.model}" in conversation "${spec.id}".`);
      }
      return {
        ...spec,
        access: {
          ...spec.access,
          models: models.map((m) => m.id === patch.model ? { ...m, records: patch.records } : m)
        }
      };
    }
    case "update-spec":
      return { ...spec, ...patch.fields, id: spec.id, turns: spec.turns };
  }
}
function applyPatches(spec, patches) {
  return patches.reduce(applyPatch, spec);
}
var patchesOf = (source) => patchesOf$1(source);
var fromNdjson = (input) => fromNdjson$1(input);
var fromEventSource = (source, options) => fromEventSource$1(source, options);
var playScript = (script, options) => playScript$1(script, options);
var offsetScript = (script, ms) => offsetScript$1(script, ms);
function deltas(text, by) {
  if (by === "char") return text.match(/[\s\S]{1,3}/g) ?? [];
  return text.match(/\S+\s*|\s+/g) ?? [];
}
function textDeltas(turn, text, { from = 0, every = 40, by = "word", block, field } = {}) {
  return deltas(text, by).map((piece, i) => ({
    at: from + i * every,
    patch: {
      op: "append-text",
      turn,
      text: piece,
      ...block === void 0 ? {} : { block },
      ...field === void 0 ? {} : { field }
    }
  }));
}
function thinkingDeltas(turn, step, text, { from = 0, every = 40, by = "word" } = {}) {
  return deltas(text, by).map((piece, i) => ({
    at: from + i * every,
    patch: { op: "append-thinking", turn, step, text: piece }
  }));
}
var LIVE_STEP = /* @__PURE__ */ new Set(["running", "retrying"]);
var isLive = (turn) => turn.state === "running";
function isRunning(spec) {
  return spec.turns.some((t) => t.role === "assistant" && t.kind === "answer" && isLive(t));
}
function stopPatches(spec, now = Date.now()) {
  const patches = [];
  for (const turn of spec.turns) {
    if (turn.role !== "assistant" || turn.kind !== "answer" || !isLive(turn)) continue;
    for (const step of turn.trace ?? []) {
      if (!step.id || !LIVE_STEP.has(step.state)) continue;
      const started2 = step.startedAt ? Date.parse(step.startedAt) : NaN;
      patches.push({
        op: "update-trace-step",
        turn: turn.id,
        step: step.id,
        fields: {
          state: "stopped",
          thinking: void 0,
          ...Number.isNaN(started2) ? {} : { duration: now - started2 }
        }
      });
    }
    const started = turn.startedAt ? Date.parse(turn.startedAt) : NaN;
    patches.push({
      op: "update-turn",
      turn: turn.id,
      fields: {
        at: new Date(now).toISOString(),
        ...Number.isNaN(started) ? {} : { duration: now - started }
      }
    });
    patches.push({ op: "set-state", turn: turn.id, state: "stopped" });
  }
  return patches;
}
var ChatSessionContext = React6.createContext(null);
function useChatSessionContext() {
  const value = React6.useContext(ChatSessionContext);
  if (!value) throw new Error("A ChatSession part was rendered outside <ChatSession>.");
  return value;
}
var DEFAULT_ICONS = {
  send: "\u2191",
  stop: "\u25A0",
  attach: "+",
  close: "\xD7",
  retry: "\u21BB",
  copy: "\u29C9",
  steps: "\u2261",
  rateUp: "+1",
  rateDown: "\u22121"
};
function useViewState() {
  const [steps, setSteps] = React6.useState({});
  const [records, setRecords] = React6.useState({});
  const [ratings, setRatings] = React6.useState({});
  const stepsOpen = React6.useCallback((turnId, live) => steps[turnId] ?? live, [steps]);
  const toggleSteps = React6.useCallback(
    (turnId, open) => setSteps((prev) => ({ ...prev, [turnId]: open ?? !(prev[turnId] ?? false) })),
    []
  );
  const recordOpen = React6.useCallback(
    (turnId, stepId) => !!records[`${turnId}/${stepId}`],
    [records]
  );
  const toggleRecord = React6.useCallback((turnId, stepId, open) => {
    const key = `${turnId}/${stepId}`;
    setRecords((prev) => ({ ...prev, [key]: open ?? !prev[key] }));
  }, []);
  const rating = React6.useCallback((turnId) => ratings[turnId], [ratings]);
  const setRating = React6.useCallback(
    (turnId, value) => setRatings((prev) => ({ ...prev, [turnId]: value })),
    []
  );
  return { stepsOpen, toggleSteps, recordOpen, toggleRecord, rating, setRating };
}
function useClock(fixed, live, every = 250) {
  const [now, setNow] = React6.useState(() => fixed ?? Date.now());
  React6.useEffect(() => {
    if (fixed !== void 0 || !live) return;
    const timer = setInterval(() => setNow(Date.now()), every);
    return () => clearInterval(timer);
  }, [fixed, live, every]);
  return fixed ?? now;
}

// src/styles/base/format.ts
function formatDuration(ms, { spaced = false } = {}) {
  const gap = spaced ? " " : "";
  if (!Number.isFinite(ms) || ms < 0) return `0${gap}ms`;
  if (ms < 1e3) return `${Math.round(ms)}${gap}ms`;
  if (ms < 6e4) return `${(ms / 1e3).toFixed(1)}${gap}s`;
  const pair = (big, bigUnit, small, smallUnit) => small ? `${big}${gap}${bigUnit} ${small}${gap}${smallUnit}` : `${big}${gap}${bigUnit}`;
  if (ms < 36e5) return pair(Math.floor(ms / 6e4), "m", Math.round(ms % 6e4 / 1e3), "s");
  return pair(Math.floor(ms / 36e5), "h", Math.round(ms % 36e5 / 6e4), "m");
}
function elapsedSince(iso, now) {
  if (!iso) return void 0;
  const then = Date.parse(iso);
  return Number.isNaN(then) ? void 0 : Math.max(0, now - then);
}
function clockTime(iso) {
  if (!iso) return void 0;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return void 0;
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
}
var dayKey = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
function sameDay(a, b) {
  if (!a || !b) return true;
  return dayKey(new Date(a)) === dayKey(new Date(b));
}
function dayLabel(iso, now) {
  const date = new Date(iso);
  const written = date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  const today = new Date(now);
  if (dayKey(date) === dayKey(today)) return `Today \xB7 ${written}`;
  const yesterday = new Date(now - 864e5);
  if (dayKey(date) === dayKey(yesterday)) return `Yesterday \xB7 ${written}`;
  return written;
}

// src/styles/base/model.ts
function exchangesOf(spec) {
  const out = [];
  for (const turn of spec.turns) {
    if (turn.role === "analyst") {
      out.push({ id: turn.id, prompt: turn, replies: [] });
      continue;
    }
    const last = out[out.length - 1];
    if (last) last.replies.push(turn);
    else out.push({ id: turn.id, replies: [turn] });
  }
  return out;
}
var isAnswer = (turn) => turn.role === "assistant" && turn.kind === "answer";
var isAsk = (turn) => turn.role === "assistant" && turn.kind === "ask";
var ACTIVE = /* @__PURE__ */ new Set(["running", "retrying", "waiting"]);
function currentStep(answer) {
  return answer.trace?.find((s) => ACTIVE.has(s.state));
}
function stepTime(step, now) {
  if (step.state === "running" || step.state === "retrying") return elapsedSince(step.startedAt, now);
  return step.duration;
}
function answerTime(answer, now) {
  if (isLive(answer)) return elapsedSince(answer.startedAt, now);
  if (answer.duration !== void 0) return answer.duration;
  if (answer.startedAt && answer.at) {
    const span = Date.parse(answer.at) - Date.parse(answer.startedAt);
    if (!Number.isNaN(span)) return span;
  }
  const steps = answer.trace ?? [];
  return steps.some((s) => s.duration !== void 0) ? steps.reduce((sum, s) => sum + (s.duration ?? 0), 0) : void 0;
}
function runOutcome(answer) {
  if (answer.state === "error") return "failed";
  if (answer.state === "stopped") return "stopped";
  if (isLive(answer)) return answer.trace?.some((s) => s.state === "waiting") ? "waiting" : "live";
  return "done";
}
function stepCount(answer) {
  const steps = answer.trace ?? [];
  return { done: steps.filter((s) => s.state === "done").length, total: steps.length };
}
function exchangeState(exchange, blocks = () => true) {
  let waiting = false;
  for (const reply of exchange.replies) {
    if (isAsk(reply) && reply.state === "pending" && blocks(reply)) waiting = true;
    if (isAnswer(reply)) {
      const outcome = runOutcome(reply);
      if (outcome === "live") return "running";
      if (outcome === "waiting") waiting = true;
    }
  }
  return waiting ? "waiting" : "settled";
}
function threadCounts(spec, blocks) {
  let running = 0;
  let waiting = 0;
  let steps = 0;
  for (const exchange of exchangesOf(spec)) {
    const state = exchangeState(exchange, blocks);
    if (state === "running") running++;
    if (state === "waiting") waiting++;
    for (const reply of exchange.replies) if (isAnswer(reply)) steps += reply.trace?.length ?? 0;
  }
  return { running, waiting, steps };
}
function plainText(answer) {
  return answer.blocks.map((b) => b.text).filter((t) => typeof t === "string" && t.length > 0).join("\n\n").replace(/\*\*(.+?)\*\*/g, "$1").replace(/\[(\d+)\]/g, "");
}
var turnDomId = (spec, turnId) => `chat-${spec.id}-${turnId}`;
function SessionHeader({ onClose, className }) {
  const ctx = useChatSessionContext();
  const prompts = ctx.spec.turns.filter((t) => t.role === "analyst").length;
  return /* @__PURE__ */ jsxs("div", { className: cn("flex h-[34px] shrink-0 items-center gap-2 border-b border-border px-3", className), children: [
    /* @__PURE__ */ jsx("span", { className: "min-w-0 truncate font-medium", children: ctx.spec.title }),
    prompts ? /* @__PURE__ */ jsxs("span", { className: "shrink-0 text-muted-foreground tabular-nums", children: [
      "\xB7 ",
      prompts,
      " ",
      prompts === 1 ? "question" : "questions"
    ] }) : null,
    onClose ? /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: onClose,
        "aria-label": "Close the session",
        title: "Close",
        className: "ml-auto inline-flex size-[22px] shrink-0 items-center justify-center rounded-control text-muted-foreground hover:bg-accent hover:text-foreground",
        children: ctx.icons.close
      }
    ) : null
  ] });
}
var SETTLED_RATEABLE = /* @__PURE__ */ new Set(["complete", "partial"]);
function AnswerActions({ turn }) {
  const ctx = useChatSessionContext();
  const running = ctx.spec.turns.some((t) => isAnswer(t) && runOutcome(t) === "live");
  const rating = ctx.rating(turn.id) ?? turn.rating;
  const text = plainText(turn);
  const rate = (value) => {
    const next = rating === value ? 0 : value;
    ctx.rate(turn.id, next);
    ctx.emit({ type: "rate", turn: turn.id, value: next });
  };
  const built = {
    retry: () => [
      {
        icon: ctx.icons.retry,
        label: "Run again",
        disabled: running,
        onClick: () => ctx.emit({ type: "retry", turn: turn.id })
      }
    ],
    copy: () => text ? [
      {
        icon: ctx.icons.copy,
        label: "Copy",
        onClick: () => {
          void navigator.clipboard?.writeText(text);
          ctx.emit({ type: "copy", turn: turn.id, text });
        }
      }
    ] : [],
    steps: () => {
      if (!turn.trace?.length) return [];
      const open = ctx.stepsOpen(turn.id, false);
      return [{ icon: ctx.icons.steps, label: "Steps", active: open, onClick: () => ctx.setSteps(turn.id, !open) }];
    },
    rate: () => SETTLED_RATEABLE.has(turn.state) ? [
      {
        icon: ctx.icons.rateUp,
        label: "Good answer",
        active: rating === 1,
        activeClassName: "text-success hover:text-success",
        onClick: () => rate(1)
      },
      {
        icon: ctx.icons.rateDown,
        label: "Not what I wanted",
        active: rating === -1,
        activeClassName: "text-destructive hover:text-destructive",
        onClick: () => rate(-1)
      }
    ] : []
  };
  const actions = ctx.actions.flatMap(
    (a) => typeof a === "string" ? built[a]() : !a.states || a.states.includes(turn.state) ? [{ icon: a.icon, label: a.label, onClick: () => ctx.emit({ type: "action", turn: turn.id, action: a.id }) }] : []
  );
  if (!actions.length) return null;
  return /* @__PURE__ */ jsx(
    ChatSessionMessageOptions,
    {
      actions: actions.map((a) => ({
        ...a,
        align: "end",
        className: cn(
          "size-5 hover:bg-transparent [&_svg]:!size-[11px]",
          !a.active && "text-muted-foreground/60 hover:text-foreground"
        )
      }))
    }
  );
}
function AnswerLine({ turn, children }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [
    children ? /* @__PURE__ */ jsx("div", { className: "min-w-0 shrink truncate", children }) : null,
    /* @__PURE__ */ jsx("div", { className: "min-w-0 flex-1", children: /* @__PURE__ */ jsx(AnswerActions, { turn }) })
  ] });
}
function KeyHints({ running }) {
  return running ? /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("span", { children: "esc stop" }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("span", { children: "\u21B5 send" }),
    /* @__PURE__ */ jsx("span", { children: "\u21E7\u21B5 newline" })
  ] });
}
function useStopKey(running, stop) {
  React6.useEffect(() => {
    if (!running) return;
    const onKey = (e) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      e.preventDefault();
      stop();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [running, stop]);
}
var ClarifyCard = ClarifyCard$1;
var ClarifyFootnote = ClarifyFootnote$1;
var ClarifyActions = ClarifyActions$1;

// src/conversations/relative-time.ts
function relativeTime(iso, now) {
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return void 0;
  const minutes = Math.floor((now - then) / 6e4);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return new Date(then).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// src/grammar/stages.ts
var STAGES = [
  { id: "frame", name: "Frame" },
  { id: "scope", name: "Scope" },
  { id: "check", name: "Check data" },
  { id: "analyse", name: "Analyse" },
  { id: "explain", name: "Explain" },
  { id: "act", name: "Act" },
  { id: "monitor", name: "Monitor" }
];

// src/grammar/patterns.ts
var PATTERNS = [
  { id: "snapshot", name: "KPI snapshot", blocks: ["grid", "timeseries", "narrative", "scope"] },
  { id: "bridge", name: "Change explanation", blocks: ["narrative", "waterfall", "ranked", "citations"] },
  { id: "comparison", name: "Comparison", blocks: ["bars", "table", "caveat"] },
  { id: "ranking", name: "Ranked list", blocks: ["ranked", "table"] },
  { id: "profile", name: "Segment profile", blocks: ["table", "bars", "narrative"] },
  { id: "cohort", name: "Cohort matrix", blocks: ["matrix", "narrative"] },
  { id: "forecast", name: "Forecast", blocks: ["timeseries", "record", "caveat"] },
  { id: "anomaly", name: "Anomaly report", blocks: ["timeseries", "timeline", "ranked"] },
  { id: "drivers", name: "Driver ranking", blocks: ["ranked", "narrative", "caveat"] },
  { id: "readout", name: "Experiment readout", blocks: ["metric", "record", "caveat", "proposal"] },
  { id: "scenariot", name: "Scenario table", blocks: ["record", "table", "ranked"] },
  { id: "funnelv", name: "Funnel", blocks: ["funnel", "table"] },
  { id: "spread", name: "Distribution", blocks: ["histogram", "table"] },
  { id: "quality", name: "Quality report", blocks: ["checks", "table", "files"] },
  { id: "e360", name: "Entity 360", blocks: ["record", "timeline", "table"] },
  { id: "relmap", name: "Relationship map", blocks: ["subgraph", "ranked"] },
  { id: "memo", name: "Findings memo", blocks: ["narrative", "citations", "caveat"] },
  { id: "recommend", name: "Recommendation", blocks: ["table", "ranked", "proposal"] },
  { id: "delivery", name: "Scheduled delivery", blocks: ["files", "proposal", "record"] },
  { id: "shortlist", name: "Candidate shortlist", blocks: ["attr", "histogram", "caveat", "proposal"] },
  { id: "significance", name: "Significance test", blocks: ["test", "box", "evidence", "caveat"] },
  { id: "effects", name: "Effect estimates", blocks: ["coef", "forest", "method", "caveat"] },
  { id: "association", name: "Association", blocks: ["correlation", "scatter", "caveat"] },
  { id: "spc", name: "Control report", blocks: ["control", "pareto", "decomposition"] },
  { id: "timeto", name: "Time to event", blocks: ["survival", "quantiles", "dumbbell", "caveat"] },
  { id: "modelcheck", name: "Model check", blocks: ["modeleval", "profile", "pivot", "tornado"] }
];

// src/grammar/asks.ts
var ASK_INTENTS = [
  { id: "clarify", name: "Clarify what was meant", stage: "frame", kind: "single" },
  { id: "measure", name: "Choose the measure", stage: "frame", kind: "single" },
  { id: "definition", name: "Confirm a definition", stage: "frame", kind: "confirm" },
  { id: "hunch", name: "Share a hunch", stage: "frame", kind: "long" },
  { id: "window", name: "Time window", stage: "scope", kind: "period" },
  { id: "baseline", name: "Compare against", stage: "scope", kind: "single" },
  { id: "filter", name: "Filter and segment", stage: "scope", kind: "multi" },
  { id: "granularity", name: "Granularity", stage: "scope", kind: "quick" },
  { id: "entities", name: "Pick entities", stage: "scope", kind: "entity" },
  { id: "threshold", name: "Set a threshold", stage: "scope", kind: "number" },
  { id: "ambiguity", name: "Resolve ambiguity", stage: "check", kind: "single" },
  { id: "dataissue", name: "Handle a data issue", stage: "check", kind: "single" },
  { id: "cost", name: "Approve an expensive run", stage: "check", kind: "confirm" },
  { id: "method", name: "Choose a method", stage: "analyse", kind: "single" },
  { id: "assumptions", name: "Confirm assumptions", stage: "analyse", kind: "multi" },
  { id: "confidence", name: "Confidence level", stage: "analyse", kind: "quick" },
  { id: "objectives", name: "Weigh objectives", stage: "analyse", kind: "weights" },
  { id: "scenario", name: "Scenario inputs", stage: "analyse", kind: "form" },
  { id: "format", name: "Choose the output", stage: "explain", kind: "quick" },
  { id: "rate", name: "Rate the answer", stage: "explain", kind: "scale" },
  { id: "next", name: "Suggest what's next", stage: "explain", kind: "suggestions" },
  { id: "approve", name: "Approve an action", stage: "act", kind: "approval" },
  { id: "schedule", name: "Schedule and share", stage: "monitor", kind: "multistep" },
  { id: "reading", name: "Check my reading", stage: "frame", kind: "interpretation" },
  { id: "fork", name: "Pick a reading", stage: "frame", kind: "fork" },
  { id: "range", name: "Set a range", stage: "scope", kind: "range" },
  { id: "model", name: "Specify the model", stage: "analyse", kind: "modelspec" },
  { id: "plan", name: "Review the plan", stage: "analyse", kind: "plan" },
  { id: "hypothesis", name: "State the hypothesis", stage: "analyse", kind: "hypothesis" }
];

// src/grammar/answers.ts
var ANSWER_INTENTS = [
  { id: "say", name: "Say it in words", kinds: ["narrative"] },
  { id: "figure", name: "One number, or a few", kinds: ["metric", "grid"] },
  { id: "trend", name: "Change over time", kinds: ["timeseries", "control"] },
  { id: "compare", name: "Groups side by side", kinds: ["bars", "dumbbell", "matrix", "funnel"] },
  { id: "rank", name: "Leaders and laggards", kinds: ["ranked", "pareto", "tornado"] },
  { id: "explain-change", name: "What moved the total", kinds: ["waterfall", "decomposition"] },
  { id: "records", name: "Rows, or one entity", kinds: ["table", "record", "attr", "pivot", "profile"] },
  { id: "sequence", name: "What happened when", kinds: ["timeline", "heatstrip"] },
  { id: "spread", name: "The shape of the values", kinds: ["histogram", "box", "quantiles", "survival"] },
  { id: "relate", name: "How things connect", kinds: ["scatter", "correlation", "subgraph"] },
  { id: "stats", name: "Test and model results", kinds: ["test", "coef", "forest", "evidence", "modeleval"] },
  { id: "trust", name: "Method, sources, scope and limits", kinds: ["method", "citations", "scope", "caveat", "cannot", "checks"] },
  { id: "act", name: "A proposed action, or a file", kinds: ["proposal", "files"] },
  { id: "run.steps", name: "What the run did, in order", kinds: ["trace", "gantt"] },
  { id: "run.activity", name: "Which layers were busy", kinds: ["activity"] }
];

// src/grammar/flows.ts
var FLOWS = [
  { id: "kpi", name: "KPI check", template: "How is {measure} tracking against {baseline}?", stages: ["frame", "scope", "analyse", "explain"], asks: ["measure", "window", "baseline"], pattern: "snapshot" },
  { id: "diagnose", name: "Root cause", template: "Why did {measure} change in {period}?", stages: ["frame", "scope", "check", "analyse", "explain", "act"], asks: ["measure", "window", "baseline", "hunch"], pattern: "bridge" },
  { id: "compare", name: "Comparison & benchmark", template: "How does {A} compare with {B} on {measures}?", stages: ["frame", "scope", "analyse", "explain"], asks: ["entities", "measure", "confidence"], pattern: "comparison" },
  { id: "rank", name: "Top-N ranking", template: "Which {entities} lead or lag on {measure}?", stages: ["frame", "scope", "analyse", "explain", "act"], asks: ["measure", "filter", "threshold"], pattern: "ranking" },
  { id: "segment", name: "Segmentation", template: "What groups exist within {population}, and how do they differ?", stages: ["frame", "scope", "analyse", "explain"], asks: ["filter", "method", "assumptions"], pattern: "profile" },
  { id: "cohort", name: "Cohort & retention", template: "How do {cohorts} behave over time?", stages: ["frame", "scope", "analyse", "explain"], asks: ["definition", "window", "granularity"], pattern: "cohort" },
  { id: "forecast", name: "Trend & forecast", template: "Where is {measure} heading?", stages: ["frame", "scope", "analyse", "explain", "monitor"], asks: ["window", "granularity", "method", "assumptions"], pattern: "forecast" },
  { id: "anomaly", name: "Anomaly & monitoring", template: "Tell me when {measure} behaves unusually.", stages: ["scope", "analyse", "act", "monitor"], asks: ["measure", "threshold", "approve", "schedule"], pattern: "anomaly" },
  { id: "drivers", name: "Driver analysis", template: "What moves {measure}?", stages: ["frame", "analyse", "explain"], asks: ["measure", "method", "assumptions"], pattern: "drivers" },
  { id: "experiment", name: "Experiment readout", template: "Did {change} work?", stages: ["frame", "check", "analyse", "explain", "act"], asks: ["entities", "definition", "confidence"], pattern: "readout" },
  { id: "scenario", name: "Scenario & what-if", template: "What happens to {outcome} if {input} changes?", stages: ["frame", "scope", "analyse", "explain", "act"], asks: ["scenario", "assumptions"], pattern: "scenariot" },
  { id: "funnel", name: "Funnel & journey", template: "Where do {entities} drop out of {process}?", stages: ["frame", "scope", "analyse", "explain"], asks: ["definition", "window", "filter"], pattern: "funnelv" },
  { id: "distribution", name: "Distribution & outliers", template: "What does the spread of {measure} look like, and what sits outside it?", stages: ["scope", "analyse", "explain"], asks: ["measure", "filter", "threshold"], pattern: "spread" },
  { id: "audit", name: "Data audit & reconciliation", template: "Can I trust {dataset}? Do {A} and {B} agree?", stages: ["check", "analyse", "explain", "act"], asks: ["definition", "dataissue", "cost"], pattern: "quality" },
  { id: "entity", name: "Entity lookup (360)", template: "Tell me everything about {entity}.", stages: ["frame", "check", "explain"], asks: ["ambiguity", "entities"], pattern: "e360" },
  { id: "network", name: "Relationships & networks", template: "How are {entities} connected?", stages: ["frame", "scope", "check", "analyse", "explain"], asks: ["entities", "threshold", "cost"], pattern: "relmap" },
  { id: "qual", name: "Qualitative synthesis", template: "What are people saying about {topic}?", stages: ["frame", "scope", "analyse", "explain"], asks: ["filter", "window", "hunch"], pattern: "memo" },
  { id: "recommend", name: "Recommendation & priority", template: "What should we do about {problem}, and in what order?", stages: ["analyse", "explain", "act"], asks: ["assumptions", "method", "approve"], pattern: "recommend" },
  { id: "report", name: "Report & schedule", template: "Send me {analysis} every {cadence}.", stages: ["explain", "act", "monitor"], asks: ["format", "schedule", "approve"], pattern: "delivery" },
  { id: "combine", name: "Combination design", template: "Which combination of {candidates} best meets {objectives}?", stages: ["frame", "scope", "analyse", "explain", "act"], asks: ["entities", "objectives", "threshold", "assumptions"], pattern: "shortlist" },
  { id: "significance", name: "Significance test", template: "Is the difference in {measure} between {A} and {B} real?", stages: ["frame", "scope", "analyse", "explain"], asks: ["hypothesis", "confidence", "assumptions"], pattern: "significance" },
  { id: "effects", name: "Effect estimation", template: "How much does each {factor} change {outcome}, holding the others fixed?", stages: ["frame", "scope", "analyse", "explain"], asks: ["model", "plan", "assumptions"], pattern: "effects" },
  { id: "association", name: "Correlation & association", template: "Which {measures} move together, and how strongly?", stages: ["frame", "scope", "check", "analyse", "explain"], asks: ["reading", "filter", "range"], pattern: "association" },
  { id: "spc", name: "Process control", template: "Is {process} in control, and what causes most of the defects?", stages: ["scope", "analyse", "explain", "monitor"], asks: ["window", "granularity", "range"], pattern: "spc" },
  { id: "timeto", name: "Time to event", template: "How long until {event}, and does it differ by {group}?", stages: ["frame", "scope", "analyse", "explain"], asks: ["definition", "fork", "window"], pattern: "timeto" },
  { id: "modelcheck", name: "Model check", template: "How well does {model} predict {outcome}, and where does it fail?", stages: ["check", "analyse", "explain", "act"], asks: ["model", "range", "plan"], pattern: "modelcheck" }
];
var STAGE_NAME = new Map(STAGES.map((s) => [s.id, s.name]));
var stageName = (stage) => (STAGE_NAME.get(stage) ?? stage).toLowerCase();
function AskView({ turn, registry, onEvent, now }) {
  const Renderer = registry.asks[turn.ask.kind];
  const traits = registry.askTraits(turn.ask.kind);
  if (Renderer && traits.frame === "none") {
    return /* @__PURE__ */ jsx(Renderer, { turn, options: turn.ask, onEvent });
  }
  const time = turn.state === "answered" && turn.answeredAt ? relativeTime(turn.answeredAt, now) : void 0;
  return /* @__PURE__ */ jsx(
    ClarifyCard,
    {
      state: turn.state,
      kind: traits.kind,
      step: stageName(turn.stage),
      waiting: turn.state === "pending" ? turn.waiting : void 0,
      time,
      children: Renderer ? /* @__PURE__ */ jsx(Renderer, { turn, options: turn.ask, onEvent }) : /* @__PURE__ */ jsx(Placeholder, { kind: turn.ask.kind, options: turn.ask })
    }
  );
}
var LINES = [[0.6], [0.75], [0.5]];
var CHART = [[1, 110], [0.55, 7]];
var ROWS = [[0.92], [0.74], [0.55], [0.38], [0.4, 7]];
var SHAPE = {
  metric: [[0.45], [0.3, 22], [0.55]],
  grid: [[1, 56]],
  record: [[0.6], [0.75], [0.5], [0.68]],
  table: [[1, 7], [1], [1], [1]],
  attr: [[1, 7], [1], [1], [1]],
  pivot: [[1, 7], [1], [1], [1]],
  coef: [[1, 7], [1], [1], [1]],
  files: [[0.7], [0.55], [0.62]],
  ranked: ROWS,
  timeline: ROWS,
  funnel: ROWS,
  pareto: ROWS,
  tornado: ROWS,
  forest: ROWS,
  dumbbell: ROWS,
  timeseries: CHART,
  bars: CHART,
  waterfall: CHART,
  histogram: CHART,
  matrix: CHART,
  correlation: CHART,
  scatter: CHART,
  box: CHART,
  control: CHART,
  survival: CHART,
  decomposition: CHART,
  modeleval: CHART,
  quantiles: CHART,
  subgraph: CHART
};
function BlockSkeleton({ kind }) {
  const bars = SHAPE[kind] ?? LINES;
  return /* @__PURE__ */ jsx("div", { role: "status", "aria-label": "Loading", className: "flex flex-col gap-1.5 py-0.5", children: bars.map(([width, height], i) => /* @__PURE__ */ jsx(
    Skeleton,
    {
      style: { width: `${width * 100}%`, height: height ?? 9 }
    },
    i
  )) });
}
function BlockEmpty({
  text,
  suggestions,
  onSuggest
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
    /* @__PURE__ */ jsx("p", { className: "m-0 rounded-md border border-dashed border-border px-2 py-3.5 text-center text-sm text-muted-foreground", children: text }),
    suggestions?.length ? /* @__PURE__ */ jsx(SuggestionChips, { items: suggestions, onSelect: onSuggest }) : null
  ] });
}
function BlockCaption({ text, tone }) {
  return /* @__PURE__ */ jsx(
    "p",
    {
      className: cn(
        "m-0 text-xs",
        tone === "warn" ? "text-warning" : tone === "bad" ? "text-destructive" : "text-muted-foreground"
      ),
      children: text
    }
  );
}
function BlockView({ block, turn, registry, onEvent }) {
  const Renderer = registry.blocks[block.kind];
  const body = block.status === "loading" ? /* @__PURE__ */ jsx(BlockSkeleton, { kind: block.kind }) : block.status === "empty" ? /* @__PURE__ */ jsx(
    BlockEmpty,
    {
      text: block.emptyText ?? "Nothing to show.",
      suggestions: block.emptySuggestions,
      onSuggest: (text) => onEvent({ type: "prompt", text })
    }
  ) : !Renderer ? /* @__PURE__ */ jsx(Placeholder, { kind: block.kind, options: block }) : /* @__PURE__ */ jsx(Renderer, { block, turn, onEvent });
  if (!block.caption || block.status) return body;
  return /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-col gap-1.5", children: [
    body,
    /* @__PURE__ */ jsx(BlockCaption, { text: block.caption, tone: block.captionTone })
  ] });
}
function envelopeBlocks(turn) {
  const env = turn.envelope;
  if (!env) return { top: [], bottom: [] };
  const parts = [...env.scope ?? [], ...env.freshness ? [`as of ${env.freshness}`] : []];
  const top = parts.length ? [{ kind: "scope", parts }] : [];
  const bottom = [
    ...env.method ? [{ kind: "method", label: "method", code: env.method }] : [],
    ...(env.caveats ?? []).map((c) => ({ kind: "caveat", label: c.label, text: c.text }))
  ];
  return { top, bottom };
}
function splitBlocks(turn, registry) {
  const { top, bottom } = envelopeBlocks(turn);
  const own = turn.blocks.filter((b) => registry.blockTraits(b.kind).placement === "own");
  const inCard = turn.blocks.filter((b) => registry.blockTraits(b.kind).placement !== "own");
  return { inCard: [...top, ...inCard, ...bottom], own, hasEvidence: inCard.length > 0 };
}
function citationOf(turn) {
  const g = turn.envelope?.grounding;
  return g ? `cite \xB7 ${g.records.toLocaleString("en-GB")}${g.noun ? ` ${g.noun}` : ""}` : void 0;
}
function OutcomeView({
  outcome,
  turn,
  onEvent,
  tone,
  className
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5 rounded-md border border-border px-2 py-1.5",
        tone === "bad" && "border-destructive/50",
        className
      ),
      children: [
        outcome.text ? /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 text-muted-foreground", children: outcome.text }) : null,
        outcome.actions?.length ? /* @__PURE__ */ jsx("div", { className: cn("min-w-0", outcome.text ? "shrink-0" : "flex-1"), children: /* @__PURE__ */ jsx(
          ActionRow,
          {
            actions: outcome.actions,
            onAction: (action) => onEvent({ type: "action", turn: turn.id, action })
          }
        ) }) : null
      ]
    }
  );
}
function BlockStack({ children, className }) {
  return /* @__PURE__ */ jsx("div", { className: cn("flex min-w-0 flex-col gap-3", className), children });
}
function PathIcon({ path, className }) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.3,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": true,
      className: cn("size-3.5 shrink-0", className),
      children: /* @__PURE__ */ jsx("path", { d: path })
    }
  );
}
function ComposerSelect({ control, value, onValueChange, grow }) {
  return /* @__PURE__ */ jsxs(Select, { value, onValueChange, children: [
    /* @__PURE__ */ jsxs(
      SelectTrigger,
      {
        "aria-label": control.label,
        title: control.label,
        className: cn(
          "h-control-sm gap-1 border-0 bg-transparent px-2 shadow-none hover:bg-accent",
          grow ? "w-full min-w-0" : "w-auto shrink-0",
          control.quiet && "text-muted-foreground"
        ),
        children: [
          control.icon ? /* @__PURE__ */ jsx(PathIcon, { path: control.icon }) : null,
          /* @__PURE__ */ jsx(SelectValue, {})
        ]
      }
    ),
    /* @__PURE__ */ jsx(SelectContent, { children: control.options.map((o) => /* @__PURE__ */ jsx(SelectItem, { value: o.value, children: o.label }, o.value)) })
  ] });
}
function AttachmentChip({ name, onRemove }) {
  return /* @__PURE__ */ jsxs("span", { className: "inline-flex max-w-40 items-center gap-1 rounded-control border border-border bg-muted/40 px-2 py-1 text-sm", children: [
    /* @__PURE__ */ jsx("span", { className: "truncate", children: name }),
    onRemove ? /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: onRemove,
        "aria-label": `Remove ${name}`,
        className: "shrink-0 rounded-sm px-0.5 text-muted-foreground hover:bg-accent hover:text-foreground",
        children: "\xD7"
      }
    ) : null
  ] });
}
function initialSettings(composer) {
  const out = {};
  for (const c of composer?.controls ?? []) out[c.id] = c.default ?? c.options[0]?.value ?? "";
  return out;
}
function ComposerBar({ isRunning: isRunning2, onStop }) {
  const { spec, emit, icons, setComposer } = useChatSessionContext();
  const composer = spec.composer;
  const controls = composer?.controls ?? [];
  const [draft, setDraft] = React6.useState("");
  const [files, setFiles] = React6.useState([]);
  const [picks, setPicks] = React6.useState({});
  const settings = initialSettings(composer);
  for (const c of controls) {
    const pick = picks[c.id];
    if (pick !== void 0 && c.options.some((o) => o.value === pick)) settings[c.id] = pick;
  }
  const fileInput = React6.useRef(null);
  const picked = controls.map((c) => c.options.find((o) => o.value === settings[c.id])).filter(Boolean);
  const placeholder = picked.find((o) => o?.placeholder)?.placeholder ?? composer?.placeholder;
  const mono = picked.some((o) => o?.mono);
  const setting = (id, value) => {
    setPicks((prev) => ({ ...prev, [id]: value }));
    emit({ type: "setting", id, value });
  };
  const send = () => {
    const text = draft.trim();
    if (!text && !files.length) return;
    emit({
      type: "prompt",
      text,
      ...controls.length ? { settings } : {},
      ...files.length ? { files } : {}
    });
    setDraft("");
    setFiles([]);
  };
  const attach = composer?.attach;
  const attachOptions = typeof attach === "object" ? attach : {};
  const select = (c, grow) => /* @__PURE__ */ jsx(
    ComposerSelect,
    {
      control: c,
      value: settings[c.id] ?? "",
      onValueChange: (v) => setting(c.id, v),
      grow
    },
    c.id
  );
  const start = controls.filter((c) => (c.align ?? "start") === "start");
  const end = controls.filter((c) => c.align === "end");
  return /* @__PURE__ */ jsx("div", { ref: setComposer, children: /* @__PURE__ */ jsx(
    ChatSessionComposer,
    {
      value: draft,
      onChange: setDraft,
      onSend: send,
      onStop,
      isRunning: isRunning2,
      placeholder,
      textareaClassName: cn("h-[72px] min-h-14", mono && "font-mono"),
      sendIcon: icons.send,
      stopIcon: icons.stop,
      sendDisabled: isRunning2 || !draft.trim() && !files.length,
      attachments: files.length ? files.map((f, i) => /* @__PURE__ */ jsx(
        AttachmentChip,
        {
          name: f.name,
          onRemove: () => setFiles((prev) => prev.filter((_, j) => j !== i))
        },
        `${f.name}-${i}`
      )) : void 0,
      toolbarStart: start.length ? /* @__PURE__ */ jsx(Fragment, { children: start.map((c, i) => select(c, i === start.length - 1)) }) : void 0,
      toolbarEnd: end.length || attach ? /* @__PURE__ */ jsxs(Fragment, { children: [
        end.map((c) => select(c)),
        attach ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: fileInput,
              type: "file",
              hidden: true,
              accept: attachOptions.accept,
              multiple: attachOptions.multiple ?? true,
              onChange: (e) => {
                const list = e.target.files;
                if (list?.length) setFiles((prev) => [...prev, ...Array.from(list)]);
                e.target.value = "";
              }
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => fileInput.current?.click(),
              title: "Attach files",
              "aria-label": "Attach files",
              className: "inline-flex size-7 shrink-0 items-center justify-center rounded-control text-muted-foreground hover:bg-accent",
              children: icons.attach
            }
          )
        ] }) : null
      ] }) : void 0
    }
  ) });
}
var ROW_STATUS = {
  pending: "queued",
  running: "running",
  done: "success",
  failed: "error",
  waiting: "needs-input",
  retrying: "needs-input",
  stopped: "needs-input"
};
var TONE = {
  failed: "text-destructive",
  waiting: "text-warning",
  retrying: "text-warning",
  stopped: "text-warning"
};
function stepDescription(step) {
  const detail = step.state === "failed" ? step.error ?? step.detail : step.detail;
  switch (step.state) {
    case "retrying":
      return [`retrying ${step.attempt ?? 2}${step.attempts ? `/${step.attempts}` : ""}`, detail].filter(Boolean).join(" \xB7 ");
    case "waiting":
      return ["needs input", detail].filter(Boolean).join(" \xB7 ");
    case "stopped":
      return "stopped";
    default:
      return detail;
  }
}
function IoRows({ label, rows }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-col gap-0.5", children: [
    /* @__PURE__ */ jsx(Eyebrow, { children: label }),
    /* @__PURE__ */ jsx(PropertyList, { labelWidth: "auto", variant: "summary", children: rows.map((row, i) => /* @__PURE__ */ jsx(PropertyRow, { label: row.label, mono: row.code, children: row.code ? /* @__PURE__ */ jsx("pre", { className: "m-0 whitespace-pre-wrap break-words", children: row.value }) : row.value }, `${row.label}-${i}`)) })
  ] });
}
function StepRecord({ step }) {
  const input = step.io?.input ?? [];
  const output = step.io?.output ?? [];
  return /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-col gap-2", children: [
    input.length ? /* @__PURE__ */ jsx(IoRows, { label: "Input", rows: input }) : null,
    output.length ? /* @__PURE__ */ jsx(IoRows, { label: "Output", rows: output }) : null,
    step.error ? /* @__PURE__ */ jsx(IoRows, { label: "Error", rows: [{ label: "cause", value: step.error }] }) : null
  ] });
}
var hasRecord = (step) => !!(step.io?.input?.length || step.io?.output?.length || step.error);
function StepRow({ turn, step, detail = true, onSelect, suffix }) {
  const ctx = useChatSessionContext();
  const id = step.id ?? step.label;
  const time = stepTime(step, ctx.now);
  const description = [stepDescription(step), suffix].filter(Boolean).join(" \xB7 ");
  const open = detail && ctx.recordOpen(turn.id, id);
  const select = onSelect ?? (hasRecord(step) ? () => ctx.toggleRecord(turn.id, id) : ctx.opensRuns ? () => ctx.emit({ type: "open-run", turn: turn.id, step: step.id }) : void 0);
  return /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-col", children: [
    /* @__PURE__ */ jsx(
      ChatSessionTaskRow,
      {
        status: ROW_STATUS[step.state],
        name: step.label,
        description: description ? /* @__PURE__ */ jsx("span", { className: TONE[step.state], children: description }) : void 0,
        meta: time !== void 0 ? formatDuration(time) : void 0,
        onClick: select
      }
    ),
    detail && step.thinking && (step.state === "running" || step.state === "retrying") ? /* @__PURE__ */ jsx(ChatSessionActivitySubLine, { className: "pl-[22px] italic", children: step.thinking }) : null,
    open && hasRecord(step) ? /* @__PURE__ */ jsx(
      ChatSessionDisclosure,
      {
        className: "my-0.5 ml-[22px]",
        label: /* @__PURE__ */ jsx("span", { className: "font-mono", children: step.key ?? step.label }),
        meta: [
          step.attempt ? `attempt ${step.attempt}` : void 0,
          step.duration !== void 0 ? formatDuration(step.duration) : void 0
        ].filter(Boolean).join(" \xB7 "),
        open: true,
        onOpenChange: () => ctx.toggleRecord(turn.id, id, false),
        children: /* @__PURE__ */ jsx(StepRecord, { step })
      }
    ) : null
  ] });
}
function StepList({ turn, className }) {
  return /* @__PURE__ */ jsx("div", { className: cn("flex min-w-0 flex-col gap-px", className), children: (turn.trace ?? []).map((step, i) => /* @__PURE__ */ jsx(StepRow, { turn, step }, step.id ?? i)) });
}
var VERB = { done: "Thought for", failed: "Failed after", stopped: "Stopped after" };
function RunSummaryLine({ turn }) {
  const ctx = useChatSessionContext();
  const outcome = runOutcome(turn);
  const verb = VERB[outcome === "failed" || outcome === "stopped" ? outcome : "done"];
  const time = answerTime(turn, ctx.now);
  const { done, total } = stepCount(turn);
  const open = ctx.stepsOpen(turn.id, false);
  return /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-center gap-2 text-muted-foreground", children: [
    /* @__PURE__ */ jsx("span", { className: "select-none text-border", "aria-hidden": true, children: "\u273B" }),
    /* @__PURE__ */ jsxs("span", { className: "min-w-0 truncate", children: [
      verb,
      " ",
      time !== void 0 ? /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "tabular-nums underline-offset-2 hover:text-foreground hover:underline",
          onClick: () => ctx.opensRuns ? ctx.emit({ type: "open-run", turn: turn.id }) : ctx.setSteps(turn.id, !open),
          children: formatDuration(time)
        }
      ) : "\u2014",
      total ? ` \xB7 ${done} of ${total} steps` : null
    ] }),
    total ? /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        "aria-expanded": open,
        "aria-label": open ? "Fold the steps" : "Show the steps",
        className: "hover:text-foreground",
        onClick: () => ctx.setSteps(turn.id, !open),
        children: /* @__PURE__ */ jsx("span", { className: cn("inline-block transition-transform", open && "rotate-90"), children: "\u25B8" })
      }
    ) : null
  ] });
}
var ANSWER_DOT = {
  live: "pending",
  waiting: "info",
  done: "success",
  failed: "error",
  stopped: "warning"
};
var ASK_DOT = {
  pending: "info",
  answered: "success",
  skipped: "default",
  superseded: "default",
  expired: "default"
};
function useJump() {
  const ctx = useChatSessionContext();
  return (turnId) => {
    ctx.setView("chat");
    ctx.toggleSteps(turnId, true);
    ctx.scrollToTurn(turnId);
  };
}
function CliAnswer({ turn }) {
  const ctx = useChatSessionContext();
  const outcome = runOutcome(turn);
  const live = outcome === "live" || outcome === "waiting";
  const { inCard, own, hasEvidence } = splitBlocks(turn, ctx.registry);
  const blocks = [...inCard, ...own];
  const step = currentStep(turn);
  const time = answerTime(turn, ctx.now);
  const showSteps = !!turn.trace?.length && (live || ctx.stepsOpen(turn.id, false));
  const body = live && !hasEvidence ? /* @__PURE__ */ jsx(
    ChatSessionProgressLine,
    {
      className: "-ml-[22px]",
      elapsed: time !== void 0 ? formatDuration(time) : void 0,
      spinner: outcome === "waiting" ? /* @__PURE__ */ jsx("span", { className: "size-1.5 rounded-full bg-info", "aria-hidden": true }) : void 0,
      children: outcome === "waiting" ? "Waiting on your answer" : step ? `${step.label}\u2026` : "Planning\u2026"
    }
  ) : blocks.length ? /* @__PURE__ */ jsx(BlockStack, { className: "whitespace-normal", children: blocks.map((b, i) => /* @__PURE__ */ jsx(BlockView, { block: b, turn, registry: ctx.registry, onEvent: ctx.emit }, `${b.kind}-${i}`)) }) : outcome === "failed" ? "The run failed." : outcome === "stopped" ? "Stopped by you." : null;
  return /* @__PURE__ */ jsx(
    ChatSessionActivityRow,
    {
      status: ANSWER_DOT[outcome],
      meta: !live && turn.meta ? turn.meta : void 0,
      footer: /* @__PURE__ */ jsxs(Fragment, { children: [
        live && turn.trace?.length ? /* @__PURE__ */ jsx(StepList, { turn, className: "pt-0.5" }) : null,
        !live ? (
          // The run in one line, and what can be done with the answer at its right.
          /* @__PURE__ */ jsx(AnswerLine, { turn, children: turn.trace?.length ? /* @__PURE__ */ jsx(RunSummaryLine, { turn }) : null })
        ) : null,
        !live && showSteps ? /* @__PURE__ */ jsx(StepList, { turn, className: "pt-0.5" }) : null,
        turn.outcome && !live ? /* @__PURE__ */ jsx(
          OutcomeView,
          {
            className: "mt-0.5",
            outcome: turn.outcome,
            turn,
            onEvent: ctx.emit,
            tone: outcome === "failed" ? "bad" : void 0
          }
        ) : null,
        outcome === "stopped" ? /* @__PURE__ */ jsx(ChatSessionActivitySubLine, { children: "Interrupted \xB7 ask again, or narrow the question" }) : null
      ] }),
      children: body
    }
  );
}
function CliAsk({ turn }) {
  const ctx = useChatSessionContext();
  return /* @__PURE__ */ jsx(ChatSessionActivityRow, { status: ASK_DOT[turn.state] ?? "default", children: /* @__PURE__ */ jsx("div", { className: "whitespace-normal", children: /* @__PURE__ */ jsx(AskView, { turn, registry: ctx.registry, onEvent: ctx.emit, now: ctx.now }) }) });
}
function CliExchange({ exchange }) {
  const ctx = useChatSessionContext();
  const prompt = exchange.prompt;
  return /* @__PURE__ */ jsxs("div", { className: "contents", children: [
    prompt ? /* @__PURE__ */ jsx("div", { id: turnDomId(ctx.spec, prompt.id), className: "scroll-mt-3", children: /* @__PURE__ */ jsx(ChatSessionPromptRow, { meta: prompt.at ? /* @__PURE__ */ jsx("span", { className: "tabular-nums", children: clockTime(prompt.at) }) : void 0, children: prompt.text }) }) : null,
    exchange.replies.map((reply) => /* @__PURE__ */ jsx("div", { id: turnDomId(ctx.spec, reply.id), className: "min-w-0 scroll-mt-3", children: isAnswer(reply) ? /* @__PURE__ */ jsx(CliAnswer, { turn: reply }) : /* @__PURE__ */ jsx(CliAsk, { turn: reply }) }, reply.id))
  ] });
}
var WEIGHT = { running: 0, waiting: 1, settled: 2 };
function CliTasks() {
  const ctx = useChatSessionContext();
  const jump = useJump();
  const blocks = (ask) => ctx.registry.askTraits(ask.ask.kind).frame === "card";
  const groups = exchangesOf(ctx.spec).filter((e) => e.replies.some((r) => isAnswer(r) && r.trace?.length)).reverse().sort((a, b) => WEIGHT[exchangeState(a, blocks)] - WEIGHT[exchangeState(b, blocks)]);
  return /* @__PURE__ */ jsx(Fragment, { children: groups.map((exchange) => {
    const state = exchangeState(exchange, blocks);
    const answers = exchange.replies.filter(isAnswer);
    const total = answers.reduce((sum, a) => sum + (answerTime(a, ctx.now) ?? 0), 0);
    const when = clockTime(exchange.prompt?.at);
    const said = state === "running" ? "running" : state === "waiting" ? "waiting on you" : formatDuration(total);
    return /* @__PURE__ */ jsx(
      ChatSessionTaskGroup,
      {
        heading: /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "min-w-0 truncate", title: exchange.prompt?.text, children: exchange.prompt?.text ?? ctx.spec.title }),
          /* @__PURE__ */ jsx("span", { className: "shrink-0 font-normal text-muted-foreground tabular-nums", children: [when, said].filter(Boolean).join(" \xB7 ") })
        ] }),
        children: answers.flatMap(
          (a) => (a.trace ?? []).map((s, i) => /* @__PURE__ */ jsx(StepRow, { turn: a, step: s, detail: false, onSelect: () => jump(a.id) }, `${a.id}-${s.id ?? i}`))
        )
      },
      exchange.id
    );
  }) });
}
function PinnedSteps() {
  const ctx = useChatSessionContext();
  const jump = useJump();
  const live = ctx.spec.turns.filter(
    (t) => isAnswer(t) && (runOutcome(t) === "live" || runOutcome(t) === "waiting")
  );
  if (!live.length) return null;
  return /* @__PURE__ */ jsx("div", { className: "border-b border-border px-3 py-1.5", children: live.map((a) => {
    const step = currentStep(a) ?? a.trace?.[0];
    return step ? /* @__PURE__ */ jsx(StepRow, { turn: a, step, detail: false, onSelect: () => jump(a.id) }, a.id) : null;
  }) });
}
function CliSession({ running, onStop, header, onClose, emptyState, className }) {
  const ctx = useChatSessionContext();
  const counts = threadCounts(ctx.spec, (ask) => ctx.registry.askTraits(ask.ask.kind).frame === "card");
  const tasks = ctx.view === "tasks";
  const viewButton = (target, label) => /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      "aria-pressed": ctx.view === target,
      onClick: () => ctx.setView(target),
      className: ctx.view === target ? "font-medium text-foreground" : "hover:text-foreground",
      children: label
    }
  );
  return /* @__PURE__ */ jsxs("div", { className: cn("flex h-full min-h-0 flex-col bg-background", className), children: [
    header === true ? /* @__PURE__ */ jsx(SessionHeader, { onClose }) : header || null,
    /* @__PURE__ */ jsx(
      ChatSessionFrame,
      {
        className: "min-h-0 flex-1",
        autoScrollKey: `${ctx.view}-${ctx.spec.turns.length}`,
        emptyState,
        bodyClassName: tasks ? "gap-[18px]" : void 0,
        footer: /* @__PURE__ */ jsxs("div", { className: "border-t border-border", children: [
          !tasks ? /* @__PURE__ */ jsx(PinnedSteps, {}) : null,
          /* @__PURE__ */ jsx(ComposerBar, { isRunning: running, onStop }),
          /* @__PURE__ */ jsx(
            ChatSessionStatusBar,
            {
              className: "pt-0",
              start: /* @__PURE__ */ jsxs(Fragment, { children: [
                viewButton("chat", "Chat"),
                viewButton("tasks", `Tasks (${counts.steps})`),
                counts.running ? /* @__PURE__ */ jsxs("span", { className: "text-primary", children: [
                  counts.running,
                  " running"
                ] }) : counts.waiting ? /* @__PURE__ */ jsxs("span", { className: "text-warning", children: [
                  counts.waiting,
                  " needs input"
                ] }) : null
              ] }),
              end: ctx.spec.composer?.hints === false ? void 0 : /* @__PURE__ */ jsx(KeyHints, { running })
            }
          )
        ] }),
        children: tasks ? /* @__PURE__ */ jsx(CliTasks, {}) : exchangesOf(ctx.spec).map((e) => /* @__PURE__ */ jsx(CliExchange, { exchange: e }, e.id))
      }
    )
  ] });
}

// src/styles/types.ts
var DEFAULT_ANSWER_ACTIONS = ["retry", "copy", "steps", "rate"];
var TurnLabel = React6.forwardRef(
  ({ align = "start", className, children, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn(
        "font-mono text-xs tracking-wider text-muted-foreground uppercase",
        align === "end" && "text-right",
        className
      ),
      ...props,
      children
    }
  )
);
TurnLabel.displayName = "TurnLabel";
var RUN_WORDS = { done: "Answered in", failed: "Failed after", stopped: "Stopped after" };
function RunLine({ turn }) {
  const ctx = useChatSessionContext();
  const outcome = runOutcome(turn);
  const time = answerTime(turn, ctx.now);
  const at = clockTime(turn.at);
  const words = RUN_WORDS[outcome === "failed" || outcome === "stopped" ? outcome : "done"];
  const open = ctx.stepsOpen(turn.id, false);
  return /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground", children: [
    at ? /* @__PURE__ */ jsx("span", { className: "tabular-nums", children: at }) : null,
    at && time !== void 0 ? /* @__PURE__ */ jsx("span", { "aria-hidden": true, children: "\xB7" }) : null,
    time !== void 0 ? /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        "aria-haspopup": ctx.opensRuns ? "dialog" : void 0,
        "aria-expanded": ctx.opensRuns ? void 0 : open,
        className: "underline decoration-dotted underline-offset-2 hover:text-foreground",
        onClick: () => ctx.opensRuns ? ctx.emit({ type: "open-run", turn: turn.id }) : ctx.setSteps(turn.id, !open),
        children: [
          words,
          " ",
          formatDuration(time, { spaced: true })
        ]
      }
    ) : null
  ] });
}
function WebAnswer({ turn, chrome = true }) {
  const ctx = useChatSessionContext();
  const outcome = runOutcome(turn);
  const live = outcome === "live" || outcome === "waiting";
  const { inCard, own, hasEvidence } = splitBlocks(turn, ctx.registry);
  const block = (b, i) => /* @__PURE__ */ jsx(BlockView, { block: b, turn, registry: ctx.registry, onEvent: ctx.emit }, `${b.kind}-${i}`);
  const steps = !!turn.trace?.length && (live || ctx.stepsOpen(turn.id, outcome === "failed"));
  return /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-col gap-2", children: [
    live && !turn.trace?.length && !hasEvidence ? /* @__PURE__ */ jsx(ChatSessionMessage, { role: "assistant", status: "running", children: "Working" }) : null,
    steps ? /* @__PURE__ */ jsx(EmissionCard, { kind: live ? outcome === "waiting" ? "waiting" : "running" : "steps", children: /* @__PURE__ */ jsx(EmissionBody, { children: /* @__PURE__ */ jsx(StepList, { turn }) }) }) : null,
    hasEvidence ? /* @__PURE__ */ jsx(
      EmissionCard,
      {
        kind: turn.label ?? turn.pattern ?? "answer",
        title: turn.title,
        citation: citationOf(turn) ?? turn.aside ?? (live && !inCard.some((b) => b.status === "loading") ? "writing\u2026" : void 0),
        note: turn.state === "partial" ? turn.state : void 0,
        children: /* @__PURE__ */ jsx(EmissionBody, { children: inCard.map(block) })
      }
    ) : null,
    own.map(block),
    !hasEvidence && !own.length && (outcome === "failed" || outcome === "stopped") ? /* @__PURE__ */ jsx(ChatSessionMessage, { role: "assistant", status: outcome === "failed" ? "error" : "stopped", children: outcome === "failed" ? "The run failed." : "Stopped by you." }) : null,
    turn.outcome && !live ? /* @__PURE__ */ jsx(OutcomeView, { outcome: turn.outcome, turn, onEvent: ctx.emit, tone: outcome === "failed" ? "bad" : void 0 }) : null,
    chrome && !live ? /* @__PURE__ */ jsx(AnswerLine, { turn, children: /* @__PURE__ */ jsx(RunLine, { turn }) }) : null
  ] });
}
function WebExchange({ exchange, dayBreak }) {
  const ctx = useChatSessionContext();
  const you = ctx.spec.analyst ?? "You";
  const assistant = ctx.spec.assistant ?? "Assistant";
  const prompt = exchange.prompt;
  const sentAt = clockTime(prompt?.at);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    dayBreak ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", role: "separator", children: [
      /* @__PURE__ */ jsx("span", { className: "h-px flex-1 bg-border" }),
      /* @__PURE__ */ jsx("span", { children: dayBreak }),
      /* @__PURE__ */ jsx("span", { className: "h-px flex-1 bg-border" })
    ] }) : null,
    prompt ? /* @__PURE__ */ jsxs("div", { id: turnDomId(ctx.spec, prompt.id), className: "flex scroll-mt-3 flex-col gap-1", children: [
      /* @__PURE__ */ jsx(TurnLabel, { align: "end", children: you }),
      /* @__PURE__ */ jsx(ChatSessionMessage, { role: "user", children: prompt.text }),
      sentAt ? /* @__PURE__ */ jsx("span", { className: "self-end text-sm text-muted-foreground tabular-nums", children: sentAt }) : null
    ] }) : null,
    exchange.replies.length ? /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-col gap-2", children: [
      /* @__PURE__ */ jsx(TurnLabel, { children: assistant }),
      exchange.replies.map((reply) => /* @__PURE__ */ jsx("div", { id: turnDomId(ctx.spec, reply.id), className: "min-w-0 scroll-mt-3", children: isAnswer(reply) ? /* @__PURE__ */ jsx(WebAnswer, { turn: reply }) : /* @__PURE__ */ jsx(AskView, { turn: reply, registry: ctx.registry, onEvent: ctx.emit, now: ctx.now }) }, reply.id))
    ] }) : null
  ] });
}
function dayBreaks(exchanges, now) {
  let last;
  return exchanges.map((exchange) => {
    const at = exchange.prompt?.at;
    if (!at) return void 0;
    const label = last === void 0 || !sameDay(last, at) ? dayLabel(at, now) : void 0;
    last = at;
    return label;
  });
}
function WebSession({ running, onStop, header, onClose, emptyState, className }) {
  const ctx = useChatSessionContext();
  const exchanges = exchangesOf(ctx.spec);
  const breaks = dayBreaks(exchanges, ctx.now);
  return /* @__PURE__ */ jsxs("div", { className: cn("flex h-full min-h-0 flex-col bg-background", className), children: [
    header === true ? /* @__PURE__ */ jsx(SessionHeader, { onClose }) : header || null,
    /* @__PURE__ */ jsx(
      ChatSessionFrame,
      {
        className: "min-h-0 flex-1",
        autoScrollKey: ctx.spec.turns.length,
        emptyState,
        bodyClassName: "mx-auto w-full max-w-[52rem] gap-5",
        footer: /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-[52rem]", children: [
          /* @__PURE__ */ jsx(ComposerBar, { isRunning: running, onStop }),
          /* @__PURE__ */ jsx(
            ChatSessionStatusBar,
            {
              className: "pt-0",
              start: ctx.spec.assistant ? /* @__PURE__ */ jsx("span", { className: "truncate", children: ctx.spec.assistant }) : void 0,
              end: ctx.spec.composer?.hints === false ? void 0 : /* @__PURE__ */ jsx(KeyHints, { running })
            }
          )
        ] }),
        children: exchanges.map((exchange, i) => /* @__PURE__ */ jsx(WebExchange, { exchange, dayBreak: breaks[i] }, exchange.id))
      }
    )
  ] });
}
var handlerName = (type) => `on${type.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase())}`;
var ChatSession = React6.forwardRef(function ChatSession2(props, ref) {
  const {
    spec,
    variant = "web",
    stream,
    onStreamEnd,
    onStreamError,
    registry,
    icons,
    now: fixedNow,
    onClose,
    header,
    emptyState,
    view: controlledView,
    defaultView = "chat",
    actions = DEFAULT_ANSWER_ACTIONS,
    className
  } = props;
  const { live, stop: stopStream } = useStreamedSpec(spec, stream, applyPatches, {
    onEnd: onStreamEnd,
    onError: onStreamError,
    stopPatches
  });
  const running = live.turns.some((t) => isAnswer(t) && runOutcome(t) === "live");
  const now = useClock(fixedNow, running);
  const resolved = React6.useMemo(() => resolveRegistry(registry), [registry]);
  const resolvedIcons = React6.useMemo(() => ({ ...DEFAULT_ICONS, ...icons }), [icons]);
  const viewState = useViewState();
  const [uncontrolledView, setUncontrolledView] = React6.useState(defaultView);
  const view = controlledView ?? uncontrolledView;
  const root = React6.useRef(null);
  const composer = React6.useRef(null);
  const setComposer = React6.useCallback((element) => {
    composer.current = element;
  }, []);
  const latest = React6.useRef(props);
  const liveRef = React6.useRef(live);
  React6.useLayoutEffect(() => {
    latest.current = props;
    liveRef.current = live;
  });
  const emit = React6.useCallback((event) => {
    const handler = latest.current[handlerName(event.type)];
    if (typeof handler === "function") handler(event);
    latest.current.onEvent?.(event);
  }, []);
  const stop = React6.useCallback(() => {
    stopStream();
    emit({ type: "stop" });
  }, [stopStream, emit]);
  useStopKey(running, stop);
  const setView = React6.useCallback(
    (next) => {
      if (latest.current.view === void 0) setUncontrolledView(next);
      latest.current.onViewChange?.(next);
    },
    []
  );
  const scrollToTurn = React6.useCallback((turnId) => {
    setTimeout(() => {
      const id = turnDomId(liveRef.current, turnId);
      root.current?.querySelector(`[id="${CSS.escape(id)}"]`)?.scrollIntoView({ block: "start", behavior: "smooth" });
    }, 80);
  }, []);
  const focusComposer = React6.useCallback(() => {
    composer.current?.querySelector("textarea")?.focus();
  }, []);
  React6.useImperativeHandle(
    ref,
    () => ({
      scrollToTurn,
      showSteps: (turnId, open = true) => viewState.toggleSteps(turnId, open),
      openStep: (turnId, stepId) => {
        viewState.toggleSteps(turnId, true);
        viewState.toggleRecord(turnId, stepId, true);
        scrollToTurn(turnId);
      },
      setView,
      focusComposer
    }),
    [scrollToTurn, setView, focusComposer, viewState]
  );
  const context = {
    spec: live,
    registry: resolved,
    emit,
    icons: resolvedIcons,
    now,
    opensRuns: typeof props.onOpenRun === "function",
    stepsOpen: viewState.stepsOpen,
    toggleSteps: viewState.toggleSteps,
    setSteps: (turnId, open) => {
      viewState.toggleSteps(turnId, open);
      emit({ type: "toggle-steps", turn: turnId, open });
    },
    actions,
    recordOpen: viewState.recordOpen,
    toggleRecord: viewState.toggleRecord,
    rating: viewState.rating,
    rate: viewState.setRating,
    view,
    setView,
    scrollToTurn,
    focusComposer,
    setComposer
  };
  const shared = {
    running,
    onStop: stop,
    header: header === void 0 ? !!live.title : header,
    onClose,
    emptyState,
    className
  };
  return /* @__PURE__ */ jsx(ChatSessionContext.Provider, { value: context, children: /* @__PURE__ */ jsx("div", { ref: root, "data-variant": variant, className: "contents", children: variant === "cli" ? /* @__PURE__ */ jsx(CliSession, { ...shared }) : /* @__PURE__ */ jsx(WebSession, { ...shared }) }) });
});
function useChatSession(initial) {
  const [spec, setSpec] = React6.useState(initial);
  const current = React6.useRef(spec);
  const controllers = React6.useRef(/* @__PURE__ */ new Set());
  const [streams, setStreams] = React6.useState(0);
  const set2 = React6.useCallback((next) => {
    current.current = next;
    setSpec(next);
  }, []);
  const apply = React6.useCallback(
    (patch) => set2(applyPatches(current.current, Array.isArray(patch) ? patch : [patch])),
    [set2]
  );
  const run = React6.useCallback(
    async (open) => {
      const controller = new AbortController();
      controllers.current.add(controller);
      setStreams((n) => n + 1);
      try {
        for await (const batch of patchesOf(open(controller.signal))) {
          if (controller.signal.aborted) break;
          set2(applyPatches(current.current, batch));
        }
      } finally {
        controllers.current.delete(controller);
        setStreams((n) => n - 1);
      }
      return current.current;
    },
    [set2]
  );
  const stream = React6.useCallback((source) => run(() => source), [run]);
  const play = React6.useCallback(
    (script, options) => run((signal) => playScript(script, { ...options, signal })),
    [run]
  );
  const abortAll = () => {
    for (const c of controllers.current) c.abort();
    controllers.current.clear();
  };
  const stop = React6.useCallback(() => {
    abortAll();
    set2(applyPatches(current.current, stopPatches(current.current)));
  }, [set2]);
  const reset = React6.useCallback(
    (next) => {
      abortAll();
      set2(next);
    },
    [set2]
  );
  React6.useEffect(() => () => abortAll(), []);
  return { spec, apply, stream, play, stop, reset, streaming: streams > 0, running: isRunning(spec) };
}
function ChatSessionTurn({ turn, onEvent, registry, now }) {
  const resolved = React6.useMemo(() => resolveRegistry(registry), [registry]);
  const view = useViewState();
  const [clock] = React6.useState(() => now ?? Date.now());
  const emit = React6.useCallback((event) => onEvent?.(event), [onEvent]);
  const context = {
    spec: { id: `turn-${turn.id}`, turns: [turn] },
    registry: resolved,
    emit,
    icons: DEFAULT_ICONS,
    now: now ?? clock,
    opensRuns: false,
    stepsOpen: view.stepsOpen,
    toggleSteps: view.toggleSteps,
    setSteps: (turnId, open) => {
      view.toggleSteps(turnId, open);
      emit({ type: "toggle-steps", turn: turnId, open });
    },
    actions: [],
    recordOpen: view.recordOpen,
    toggleRecord: view.toggleRecord,
    rating: view.rating,
    rate: view.setRating,
    view: "chat",
    setView: () => {
    },
    scrollToTurn: () => {
    },
    focusComposer: () => {
    },
    setComposer: () => {
    }
  };
  return /* @__PURE__ */ jsx(ChatSessionContext.Provider, { value: context, children: turn.role === "analyst" ? /* @__PURE__ */ jsx(ChatSessionMessage, { role: "user", children: turn.text }) : turn.kind === "ask" ? /* @__PURE__ */ jsx(AskView, { turn, registry: resolved, onEvent: emit, now: context.now }) : /* @__PURE__ */ jsx(WebAnswer, { turn, chrome: false }) });
}

// src/protocol/events.ts
var EVENT_TYPES = [
  "prompt",
  "reply",
  "skip",
  "change",
  "action",
  "scope",
  "open",
  "template",
  "refine",
  "rate",
  "stop",
  "retry",
  "open-run",
  "setting",
  "copy",
  "toggle-steps"
];

// src/protocol/validate.ts
var ASK_IDS = new Set(ASK_KINDS);
var BLOCK_IDS = new Set(ANSWER_KINDS);
var STAGE_IDS = new Set(STAGES.map((s) => s.id));
var FLOW_IDS = new Set(FLOWS.map((f) => f.id));
var PATTERN_BY = new Map(PATTERNS.map((p) => [p.id, p.blocks]));
var ASK_STATES = /* @__PURE__ */ new Set(["pending", "answered", "skipped", "superseded", "expired"]);
var ANSWER_STATES = /* @__PURE__ */ new Set(["running", "partial", "complete", "cannot", "error", "stopped"]);
var STEP_STATES = /* @__PURE__ */ new Set(["done", "running", "pending", "failed", "waiting", "retrying", "stopped"]);
var notIso = (value) => value !== void 0 && (typeof value !== "string" || Number.isNaN(Date.parse(value)));
var CARRIED = {
  scope: (a) => !!a.envelope?.scope?.length,
  method: (a) => !!a.envelope?.method,
  caveat: (a) => !!a.envelope?.caveats?.length,
  trace: (a) => !!a.trace?.length
};
var ANYWHERE = /* @__PURE__ */ new Set(["narrative", "citations"]);
function checkPattern(turn, issues) {
  if (!turn.pattern) return;
  const expected = PATTERN_BY.get(turn.pattern);
  if (!expected) return;
  const present = new Set(turn.blocks.map((b) => b.kind));
  for (const kind of expected) {
    const carried = CARRIED[kind];
    const has = carried ? carried(turn) : present.has(kind);
    if (!has) {
      issues.push({
        level: "warning",
        turn: turn.id,
        message: `Pattern "${turn.pattern}" expects "${kind}", which this answer does not have.`
      });
    }
  }
  for (const kind of present) {
    if (!expected.includes(kind) && !ANYWHERE.has(kind)) {
      issues.push({
        level: "warning",
        turn: turn.id,
        message: `Block "${kind}" is not part of pattern "${turn.pattern}".`
      });
    }
  }
}
function validate(spec, options = {}) {
  const issues = [];
  const error = (message, turn) => issues.push({ level: "error", turn, message });
  const asks = /* @__PURE__ */ new Set([...ASK_IDS, ...options.extraAsks ?? []]);
  const blocks = /* @__PURE__ */ new Set([...BLOCK_IDS, ...options.extraBlocks ?? []]);
  if (typeof spec?.id !== "string" || !spec.id) error("The conversation has no id.");
  if (spec?.analyst !== void 0 && (typeof spec.analyst !== "string" || !spec.analyst)) {
    error("The analyst's name is not a non-empty string.");
  }
  const controls = spec?.composer?.controls ?? [];
  const controlIds = /* @__PURE__ */ new Set();
  for (const control of controls) {
    if (!control?.id) error("A composer control has no id.");
    else if (controlIds.has(control.id)) error(`Composer control id "${control.id}" is used twice.`);
    else controlIds.add(control.id);
    if (!control?.options?.length) error(`Composer control "${control?.id}" has no options.`);
    else if (control.default !== void 0 && !control.options.some((o) => o.value === control.default)) {
      error(`Composer control "${control.id}" defaults to "${control.default}", which is not one of its options.`);
    }
  }
  if (!Array.isArray(spec?.turns)) {
    error("The conversation has no turns array.");
    return issues;
  }
  const seen = /* @__PURE__ */ new Set();
  for (const turn of spec.turns) {
    const id = typeof turn?.id === "string" ? turn.id : void 0;
    if (!id) {
      error("A turn has no id.");
      continue;
    }
    if (seen.has(id)) error(`Turn id "${id}" is used twice.`, id);
    seen.add(id);
    if (turn.role === "analyst") {
      if (typeof turn.text !== "string" || !turn.text) error("An analyst turn has no text.", id);
      if (notIso(turn.at)) error(`at "${turn.at}" is not an ISO time.`, id);
      continue;
    }
    if (turn.role !== "assistant") {
      error(`Unknown role "${turn.role}".`, id);
      continue;
    }
    if (turn.kind === "ask") {
      if (!STAGE_IDS.has(turn.stage)) error(`Unknown stage "${turn.stage}".`, id);
      if (!ASK_STATES.has(turn.state)) error(`Unknown ask state "${turn.state}".`, id);
      if (!asks.has(turn.ask?.kind)) error(`Unknown ask block "${turn.ask?.kind}".`, id);
      if (turn.answeredAt !== void 0 && Number.isNaN(Date.parse(turn.answeredAt))) {
        error(`answeredAt "${turn.answeredAt}" is not an ISO time.`, id);
      }
      if (turn.ask?.kind === "multistep") {
        for (const step of turn.ask.steps ?? []) {
          if (!asks.has(step.kind)) error(`Unknown ask block "${step.kind}" in step "${step.id}".`, id);
        }
      }
      continue;
    }
    if (turn.kind === "answer") {
      if (!ANSWER_STATES.has(turn.state)) error(`Unknown answer state "${turn.state}".`, id);
      if (turn.flow && !FLOW_IDS.has(turn.flow)) error(`Unknown flow "${turn.flow}".`, id);
      if (turn.pattern && !PATTERN_BY.has(turn.pattern)) error(`Unknown pattern "${turn.pattern}".`, id);
      if (notIso(turn.at)) error(`at "${turn.at}" is not an ISO time.`, id);
      if (notIso(turn.startedAt)) error(`startedAt "${turn.startedAt}" is not an ISO time.`, id);
      const stepIds = /* @__PURE__ */ new Set();
      for (const step of turn.trace ?? []) {
        if (!STEP_STATES.has(step?.state)) error(`Unknown step state "${step?.state}" on "${step?.label}".`, id);
        if (notIso(step?.startedAt)) error(`Step "${step.label}" startedAt "${step.startedAt}" is not an ISO time.`, id);
        if (step?.id) {
          if (stepIds.has(step.id)) error(`Step id "${step.id}" is used twice.`, id);
          stepIds.add(step.id);
        }
      }
      for (const action of turn.outcome?.actions ?? []) {
        if (!action?.id || !action.label) error("An outcome action has no id or label.", id);
      }
      if (!Array.isArray(turn.blocks)) {
        error("An answer has no blocks array.", id);
        continue;
      }
      for (const block of turn.blocks) {
        if (!blocks.has(block?.kind)) error(`Unknown block "${block?.kind}".`, id);
        else if (block.kind in CARRIED) {
          error(`"${block.kind}" is part of the answer, not a block: send it in the ${block.kind === "trace" ? `answer's "trace"` : "envelope"}.`, id);
        }
        if (block?.status !== void 0 && block.status !== "loading" && block.status !== "empty") {
          error(`Unknown block status "${block.status}".`, id);
        }
        if (block?.status === "empty" && !block.emptyText) {
          error(`An empty "${block.kind}" block does not say what is missing in emptyText.`, id);
        }
      }
      checkPattern(turn, issues);
      continue;
    }
    error(`Unknown assistant turn kind "${turn.kind}".`, id);
  }
  return issues;
}

export { ANSWER_INTENTS, ASK_INTENTS, BUILT_IN_ASKS, BUILT_IN_ASK_TRAITS, BUILT_IN_BLOCKS, BUILT_IN_BLOCK_TRAITS, ChatSession, ChatSessionActivityRow, ChatSessionActivitySubLine, ChatSessionCaret, ChatSessionComposer, ChatSessionContextChip, ChatSessionDisclosure, ChatSessionDisclosureCode, ChatSessionDisclosureSteps, ChatSessionFrame, ChatSessionMessage, ChatSessionMessageOptions, ChatSessionProgressLine, ChatSessionPromptRow, ChatSessionStatusBar, ChatSessionTaskGroup, ChatSessionTaskRow, ChatSessionTurn, CitationMarker, ClarifyActions, ClarifyCard, ClarifyFootnote, DEFAULT_ANSWER_ACTIONS, EVENT_TYPES, EmissionBody, EmissionCard, EmissionHeader, FLOWS, PATTERNS, PatchError, STAGES, TemplatePicker, TurnLabel, answerTime, answerToPage, applyPatch, applyPatches, chatSessionGutterClass, clockTime, currentStep, dayLabel, elapsedSince, exchangesOf, formatDuration, fromEventSource, fromNdjson, isLive, isRunning, offsetScript, patchesOf, plainText, playScript, resolveRegistry, runOutcome, stepTime, stopPatches, textDeltas, thinkingDeltas, threadCounts, useChatSession, validate };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map