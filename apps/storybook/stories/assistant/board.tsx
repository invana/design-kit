import { Eyebrow } from '@invana/ui';
import { ChatSessionTurn, type ConversationEvent, type Turn } from '@invana/assistant';

/** One cell of an artboard: the caption the Design Kit Spec gives it, and the turn it draws. */
export interface BoardVariant {
  caption: string;
  turn: Turn;
  /** Draw the cell at 280px, as the board's "At 280px" variant does. */
  narrow?: boolean;
  /** The clock an answered ask's time is read against, so it reads the same every run. */
  now?: number;
}

export interface BoardProps {
  variants: BoardVariant[];
  onEvent: (event: ConversationEvent) => void;
}

/**
 * Story chrome, not a kit component: lays a preset's variants out as its artboard on the
 * Design Kit Spec does — four 320px columns, a caption over each cell — so a story
 * reads one-to-one against its board.
 */
export function Board({ variants, onEvent }: BoardProps) {
  return (
    <div className="grid grid-cols-[repeat(4,320px)] items-start gap-x-10 gap-y-12">
      {variants.map((v) => (
        <div key={v.caption} className="flex min-w-0 flex-col gap-2" style={{ width: v.narrow ? 280 : 320 }}>
          <Eyebrow>{v.caption}</Eyebrow>
          <ChatSessionTurn turn={v.turn} onEvent={onEvent} now={v.now} />
        </div>
      ))}
    </div>
  );
}
