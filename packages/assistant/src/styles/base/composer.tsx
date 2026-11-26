import * as React from "react"
import { Button, cn, Popover, PopoverContent, PopoverTrigger } from "@invana/ui"
import { colorVarByString } from "@invana/styling/color"

import type { ComposerContext, ComposerControl, ComposerSpec } from "../../protocol/types"
import { useChatSessionContext } from "./context"
import { LABEL } from "./steps"

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

/** What the next prompt is about, removable: its dot, what it is, its name, and × to send `remove-context`. */
export function ContextChip({ chip, onRemove }: { chip: ComposerContext; onRemove: () => void }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-control border border-border bg-card py-px pr-0.5 pl-2 text-sm">
      <span aria-hidden className="size-2 shrink-0 rounded-full" style={{ background: colorVarByString(chip.kind ?? chip.label) }} />
      {chip.kind ? <span className="text-muted-foreground">{chip.kind}</span> : null}
      <span className="min-w-0 truncate font-mono font-semibold">{chip.label}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${chip.label}`}
        title="Remove from the context"
        className="inline-flex size-[18px] shrink-0 items-center justify-center rounded-sm text-muted-foreground hover:bg-accent hover:text-foreground"
      >
        ×
      </button>
    </span>
  )
}

export interface ControlMenuProps {
  control: ComposerControl
  value: string
  onValueChange: (value: string) => void
  /** Held shut: a run is live, and the pick is fixed until it ends. */
  disabled?: boolean
}

/**
 * A composer setting as a quiet button — the model in mono, an agent behind
 * its icon — that opens its list upward, over the thread: the control's label
 * as the heading, each option with what it is under it, and the control's
 * note at the foot.
 */
export function ControlMenu({ control, value, onValueChange, disabled }: ControlMenuProps) {
  const [open, setOpen] = React.useState(false)
  const picked = control.options.find((o) => o.value === value)
  const many = control.options.filter((o) => !o.disabled).length > 1
  const mono = !control.icon
  return (
    <Popover open={open && !disabled} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={control.label}
          aria-haspopup="listbox"
          disabled={disabled}
          title={disabled ? "Fixed while a question runs. Change it for the next one." : control.label}
          className="-ml-1.5 inline-flex min-w-0 items-center gap-1.5 rounded-control px-1.5 py-0.5 text-muted-foreground enabled:hover:bg-accent enabled:hover:text-foreground disabled:opacity-55"
        >
          {control.icon ? <PathIcon path={control.icon} className="size-3" /> : null}
          <span className={cn("truncate text-xs", mono && "font-mono")}>{picked?.label ?? control.placeholder}</span>
          {many ? <span aria-hidden className="text-[10px]">▴</span> : null}
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="start" sideOffset={8} className="flex w-72 flex-col p-0">
        <span className={cn(LABEL, "px-2.5 pt-2 pb-1")}>{control.label}</span>
        <div role="listbox" aria-label={control.label} className="flex flex-col">
          {control.options.map((o) => {
            const selected = o.value === value
            const sub = [o.group, o.hint].filter(Boolean).join(" · ")
            return (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={selected}
                aria-disabled={o.disabled}
                disabled={o.disabled}
                onClick={() => {
                  onValueChange(o.value)
                  setOpen(false)
                }}
                className={cn(
                  "grid grid-cols-[16px_minmax(0,1fr)] gap-x-2 gap-y-0.5 px-2.5 py-[7px] text-left disabled:cursor-not-allowed disabled:opacity-45",
                  selected ? "bg-secondary" : "enabled:hover:bg-accent",
                )}
              >
                <span className="text-xs leading-[18px]">{selected ? "✓" : ""}</span>
                <span className="flex min-w-0 flex-col">
                  <span className={cn("font-semibold", mono ? "font-mono text-xs" : "text-base")}>{o.label}</span>
                  {sub ? <span className="text-sm text-muted-foreground">{sub}</span> : null}
                </span>
              </button>
            )
          })}
        </div>
        {control.note ? (
          <span className="border-t border-border px-2.5 py-1.5 text-sm text-muted-foreground">{control.note}</span>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}

/** Tokens spent in the session, of its budget: a thin bar and the words. */
function Budget({ used, limit }: { used: number; limit: number }) {
  const share = limit ? Math.min(used / limit, 1) : 0
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground tabular-nums">
      <span
        role="img"
        aria-label="Token budget used"
        className="inline-block h-1 w-16 overflow-hidden rounded-full bg-secondary @md:w-[120px]"
      >
        <span className="block h-full bg-primary" style={{ width: `${(share * 100).toFixed(1)}%` }} />
      </span>
      {(used / 1000).toFixed(1)}k of {Math.round(limit / 1000)}k tokens
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
 * The composer, drawn from the spec's `composer`: the context chips, the
 * prompt, the toolbar's controls at the start and end, attach, and send — or
 * stop while a run is in flight. A pick that sets a placeholder or mono
 * type (a query language) changes the prompt box to match.
 */
export function ComposerBar({ isRunning, onStop }: ComposerBarProps) {
  const { spec, emit, icons, setComposer } = useChatSessionContext()
  const composer = spec.composer
  const controls = composer?.controls ?? []
  const context = composer?.context ?? []
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
    if (c.value !== undefined) settings[c.id] = c.value
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
      ...(context.length ? { context: context.map((c) => c.id) } : {}),
      ...(controls.length ? { settings } : {}),
      ...(files.length ? { files } : {}),
    })
    setDraft("")
    setFiles([])
  }

  const attach = composer?.attach
  const attachOptions = typeof attach === "object" ? attach : {}
  const label = composer?.label ?? "Message"

  return (
    <div ref={setComposer} className="relative flex shrink-0 flex-col gap-2 border-t border-border px-3 py-3 @md:px-6">
      {context.length || files.length ? (
        <div className="flex max-h-16 flex-wrap items-center gap-1.5 overflow-y-auto">
          {context.map((c) => (
            <ContextChip key={c.id} chip={c} onRemove={() => emit({ type: "remove-context", id: c.id })} />
          ))}
          {files.map((f, i) => (
            <AttachmentChip
              key={`${f.name}-${i}`}
              name={f.name}
              onRemove={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
            />
          ))}
          {context.length > 1 ? (
            <button
              type="button"
              className="text-sm text-info hover:text-foreground"
              onClick={() => {
                for (const c of context) emit({ type: "remove-context", id: c.id })
              }}
            >
              Clear all
            </button>
          ) : null}
        </div>
      ) : null}
      <textarea
        aria-label={label}
        placeholder={placeholder}
        rows={2}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault()
            if (!isRunning) send()
          }
        }}
        className={cn(
          "w-full resize-none rounded-control border border-input bg-card px-2.5 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          mono && "font-mono",
        )}
      />
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        {controls.map((c) => (
          <ControlMenu
            key={c.id}
            control={c}
            value={settings[c.id] ?? ""}
            onValueChange={(v) => setting(c.id, v)}
            disabled={isRunning}
          />
        ))}
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
        <span className="grow" />
        {spec.budget ? <Budget used={spec.budget.used} limit={spec.budget.limit} /> : null}
        {isRunning ? (
          <Button size="sm" variant="outline" onClick={onStop}>
            Stop
          </Button>
        ) : (
          <Button size="sm" onClick={send} disabled={!draft.trim() && !files.length}>
            Send
          </Button>
        )}
      </div>
    </div>
  )
}
