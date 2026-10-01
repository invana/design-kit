import * as React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@invana/forms"
import { cn } from "@invana/ui"

import { ChatSessionComposer } from "../../conversations/thread"
import type { ComposerControl, ComposerSpec } from "../../protocol/types"
import { useChatSessionContext } from "./context"

/** A 16×16 stroked icon from its path data, as the API sends one. */
export function PathIcon({ path, className }: { path: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn("size-3.5 shrink-0", className)}
    >
      <path d={path} />
    </svg>
  )
}

export interface ComposerSelectProps {
  control: ComposerControl
  value: string
  onValueChange: (value: string) => void
  /** Let the select take the free width and truncate — the model name. */
  grow?: boolean
}

/**
 * A select that sits in the composer's toolbar: borderless, compact, the
 * value alone until opened. `quiet` mutes it — a setting rather than the mode.
 */
export function ComposerSelect({ control, value, onValueChange, grow }: ComposerSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        aria-label={control.label}
        title={control.label}
        className={cn(
          "h-7 gap-1 border-0 bg-transparent px-2 shadow-none hover:bg-accent",
          grow ? "w-full min-w-0" : "w-auto shrink-0",
          control.quiet && "text-muted-foreground",
        )}
      >
        {control.icon ? <PathIcon path={control.icon} /> : null}
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {control.options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/** A file waiting to be sent, removable until it is. */
export function AttachmentChip({ name, onRemove }: { name: string; onRemove?: () => void }) {
  return (
    <span className="inline-flex max-w-40 items-center gap-1 rounded-control border border-border bg-muted/40 px-2 py-1 text-sm">
      <span className="truncate">{name}</span>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${name}`}
          className="shrink-0 rounded-sm px-0.5 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          ×
        </button>
      ) : null}
    </span>
  )
}

/** Every control's value: what was picked, else its default, else its first option. */
export function initialSettings(composer: ComposerSpec | undefined): Record<string, string> {
  const out: Record<string, string> = {}
  for (const c of composer?.controls ?? []) out[c.id] = c.default ?? c.options[0]?.value ?? ""
  return out
}

export interface ComposerBarProps {
  isRunning: boolean
  onStop: () => void
}

/**
 * The composer, drawn from the spec's `composer`: the prompt, the toolbar's
 * controls at the start and end, attach, and send — or stop while a run is in
 * flight. The same in every variant. A pick that sets a placeholder or mono
 * type (a query language) changes the prompt box to match.
 */
export function ComposerBar({ isRunning, onStop }: ComposerBarProps) {
  const { spec, emit, icons, setComposer } = useChatSessionContext()
  const composer = spec.composer
  const controls = composer?.controls ?? []
  const [draft, setDraft] = React.useState("")
  const [files, setFiles] = React.useState<File[]>([])
  // Only what the analyst picked is held; every other control reads its
  // default, so a control the spec adds later starts there, and one it drops
  // is forgotten.
  const [picks, setPicks] = React.useState<Record<string, string>>({})
  const settings = initialSettings(composer)
  for (const c of controls) {
    const pick = picks[c.id]
    if (pick !== undefined && c.options.some((o) => o.value === pick)) settings[c.id] = pick
  }
  const fileInput = React.useRef<HTMLInputElement>(null)

  const picked = controls.map((c) => c.options.find((o) => o.value === settings[c.id])).filter(Boolean)
  const placeholder = picked.find((o) => o?.placeholder)?.placeholder ?? composer?.placeholder
  const mono = picked.some((o) => o?.mono)

  const setting = (id: string, value: string) => {
    setPicks((prev) => ({ ...prev, [id]: value }))
    emit({ type: "setting", id, value })
  }

  const send = () => {
    const text = draft.trim()
    if (!text && !files.length) return
    emit({
      type: "prompt",
      text,
      ...(controls.length ? { settings } : {}),
      ...(files.length ? { files } : {}),
    })
    setDraft("")
    setFiles([])
  }

  const attach = composer?.attach
  const attachOptions = typeof attach === "object" ? attach : {}
  const select = (c: ComposerControl, grow?: boolean) => (
    <ComposerSelect
      key={c.id}
      control={c}
      value={settings[c.id] ?? ""}
      onValueChange={(v) => setting(c.id, v)}
      grow={grow}
    />
  )
  const start = controls.filter((c) => (c.align ?? "start") === "start")
  const end = controls.filter((c) => c.align === "end")

  return (
    <div ref={setComposer}>
      <ChatSessionComposer
        value={draft}
        onChange={setDraft}
        onSend={send}
        onStop={onStop}
        isRunning={isRunning}
        placeholder={placeholder}
        textareaClassName={cn("h-[72px] min-h-14", mono && "font-mono")}
        sendIcon={icons.send}
        stopIcon={icons.stop}
        sendDisabled={isRunning || (!draft.trim() && !files.length)}
        attachments={
          files.length
            ? files.map((f, i) => (
                <AttachmentChip
                  key={`${f.name}-${i}`}
                  name={f.name}
                  onRemove={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                />
              ))
            : undefined
        }
        // The last start control takes the free width: it is the one that truncates.
        toolbarStart={start.length ? <>{start.map((c, i) => select(c, i === start.length - 1))}</> : undefined}
        toolbarEnd={
          end.length || attach ? (
            <>
              {end.map((c) => select(c))}
              {attach ? (
                <>
                  <input
                    ref={fileInput}
                    type="file"
                    hidden
                    accept={attachOptions.accept}
                    multiple={attachOptions.multiple ?? true}
                    onChange={(e) => {
                      const list = e.target.files
                      if (list?.length) setFiles((prev) => [...prev, ...Array.from(list)])
                      // Reset, so choosing the same file again still fires.
                      e.target.value = ""
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    title="Attach files"
                    aria-label="Attach files"
                    className="inline-flex size-7 shrink-0 items-center justify-center rounded-control text-muted-foreground hover:bg-accent"
                  >
                    {icons.attach}
                  </button>
                </>
              ) : null}
            </>
          ) : undefined
        }
      />
    </div>
  )
}
