import * as React from "react";
import { Button } from "../../ui/button";
import { cn } from "../../../lib/utils";

export interface ChatSessionComposerProps {
  /** Controlled input value. */
  value: string;
  onChange: (value: string) => void;
  /** Fired on the send button and on Enter (Shift+Enter inserts a newline). */
  onSend: () => void;
  /** Fired on the stop button, shown in place of send while `isRunning`. */
  onStop?: () => void;
  /** Swaps send → stop and keeps Enter from re-submitting mid-run. */
  isRunning?: boolean;
  /** Disables the textarea and send button. */
  disabled?: boolean;
  placeholder?: string;
  /** Left-aligned toolbar slot — mode/model selects, etc. Grows to fill and truncates. */
  toolbarStart?: React.ReactNode;
  /** Toolbar slot between the start controls and the send button — timeout, attach, … */
  toolbarEnd?: React.ReactNode;
  /** Chips row above the input (attachments). Border-separated when present. */
  attachments?: React.ReactNode;
  /** Send button icon — icon-agnostic, pass your own (e.g. `<ArrowUp />`). */
  sendIcon?: React.ReactNode;
  /** Stop button icon, shown while running (e.g. `<Square />`). */
  stopIcon?: React.ReactNode;
  /** Override the send button's disabled state. Defaults to disabled when the
   *  input is empty (or the composer is `disabled`). */
  sendDisabled?: boolean;
  className?: string;
  textareaClassName?: string;
}

/**
 * The chat-style bottom bar: a bordered card with a growable textarea on top and
 * a toolbar (start slot / end slot / send-or-stop) underneath. Enter submits,
 * Shift+Enter inserts a newline.
 *
 * Deliberately dependency-free — no query-language editor or provider selects
 * are baked in. Drop your own controls into `toolbarStart` / `toolbarEnd` (and
 * a QL editor into a custom layout if you need one).
 */
export function ChatSessionComposer({
  value,
  onChange,
  onSend,
  onStop,
  isRunning = false,
  disabled = false,
  placeholder = "Ask anything…",
  toolbarStart,
  toolbarEnd,
  attachments,
  sendIcon,
  stopIcon,
  sendDisabled,
  className,
  textareaClassName,
}: ChatSessionComposerProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (!isRunning && !disabled) onSend();
    }
  };

  const isSendDisabled =
    sendDisabled ?? (disabled || value.trim().length === 0);

  return (
    <div className={cn("p-3", className)}>
      <div className="rounded-md border border-border bg-card shadow-sm overflow-hidden focus-within:border-ring transition-colors">
        {attachments && (
          <div className="px-2 py-1.5 border-b border-border max-h-24 overflow-y-auto flex items-start gap-1 flex-wrap">
            {attachments}
          </div>
        )}

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "block w-full min-h-16 h-24 max-h-64 bg-transparent p-2 text-foreground outline-none resize-y placeholder:text-muted-foreground",
            textareaClassName,
          )}
        />

        <div className="px-2 py-1.5 border-t border-border flex items-center gap-1.5">
          {/* Start controls grow into the free width so long content truncates
              instead of shoving the send button off a narrow panel. */}
          <div className="flex-1 min-w-0 flex items-center gap-1.5">
            {toolbarStart}
          </div>
          {toolbarEnd}

          {isRunning ? (
            <Button
              size="icon"
              className="h-7 w-7 shrink-0 rounded-full"
              onClick={onStop}
              title="Stop"
              aria-label="Stop"
            >
              {stopIcon}
            </Button>
          ) : (
            <Button
              size="icon"
              className="h-7 w-7 shrink-0 rounded-full"
              onClick={onSend}
              disabled={isSendDisabled}
              title="Send"
              aria-label="Send"
            >
              {sendIcon}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
