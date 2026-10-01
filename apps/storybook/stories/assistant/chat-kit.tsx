import type * as React from 'react';
import { action } from 'storybook/actions';
import { fn } from 'storybook/test';
import { EVENT_TYPES, type ChatSessionProps, type ChatSessionIcons, type ConversationEvent } from '@invana/assistant';
import {
  ArrowUp,
  Copy,
  List,
  Paperclip,
  Pin,
  RotateCw,
  Square,
  ThumbsDown,
  ThumbsUp,
  X,
} from 'lucide-react';

// Story chrome, not kit components. The kit ships no icons, so every ChatSession
// story hands it this set; and a session fills its parent's height, so a story
// sets it in a panel the size of the Studio rail it stands for.

export const CHAT_ICONS: ChatSessionIcons = {
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

/** Icons for a host's own answer actions, named in JSON (`"icon": "pin"`). */
export const ACTION_ICONS: Record<string, React.ReactNode> = {
  pin: <Pin className="size-3" />,
};

/** A session in a panel `height` tall, as the rail or page it stands for; its width is the cell's. */
export function RailPanel({ height = 720, children }: { height?: number; children: React.ReactNode }) {
  return (
    <div className="border border-border shadow-md" style={{ height }}>
      {children}
    </div>
  );
}

/** `open-run` → `onOpenRun`: the callback prop an event goes to. */
const handlerName = (type: string) => `on${type.replace(/(^|-)([a-z])/g, (_, __, c: string) => c.toUpperCase())}`;

/**
 * A spy for every callback a ChatSession takes — one per event (`onRetry`, `onCopy`,
 * `onToggleSteps`, `onAction`, `onOpenRun`, …), then `onEvent` and the rest — so every
 * interaction shows in the Actions panel. Derived from the protocol's event list, so an event
 * added there is logged here with no change. Spread it into a story's args.
 */
export function chatCallbacks(): Partial<ChatSessionProps> {
  const handlers = Object.fromEntries(EVENT_TYPES.map((type) => [handlerName(type), fn().mockName(handlerName(type))]));
  return {
    ...handlers,
    onEvent: fn().mockName('onEvent'),
    onClose: fn().mockName('onClose'),
    onStreamEnd: fn().mockName('onStreamEnd'),
    onViewChange: fn().mockName('onViewChange'),
  };
}

/** For a story that renders ChatSession itself: log an event to the Actions panel under its callback. */
export function logEvent(event: ConversationEvent) {
  action(handlerName(event.type))(event);
  action('onEvent')(event);
}
