import type { Decorator } from '@storybook/react-vite';
import type { ChatSessionIcons } from '@invana/assistant';
import {
  ArrowUp,
  Copy,
  List,
  Paperclip,
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

/** Draw the story in a panel `width` wide and `height` tall, as a rail or a page. */
export const inPanel =
  (width: number | string, height = 720): Decorator =>
  (Story) => (
    <div className="border border-border shadow-md" style={{ width, height }}>
      <Story />
    </div>
  );

/** The variant as a control on every ChatSession story. */
export const VARIANT_ARG_TYPES = {
  variant: { control: 'inline-radio', options: ['web', 'cli'] },
} as const;
