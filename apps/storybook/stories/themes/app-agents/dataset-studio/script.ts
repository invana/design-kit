import type { AnswerTurn, AskSpec, BlockSpec, ConversationPatch, Outcome, TraceStep } from '@invana/assistant';

import type { Step } from '../playbook/playbook';

/**
 * What the API sends after an event, as one script: conversation patches and playbook steps
 * on one clock. A patch changes the thread; a step changes the work — and is recorded, so the
 * reader can play the work back step by step.
 */
export type Entry = { at: number } & ({ patch: ConversationPatch } | { step: Step });
export type Script = Entry[];

/** A script written in order: each entry `after` ms after the one before. */
export class Writer {
  entries: Script = [];
  private clock = 0;
  constructor(private readonly turnId: () => string) {}

  wait(ms: number) {
    this.clock += ms;
    return this;
  }
  patch(patch: ConversationPatch, after = 0) {
    this.clock += after;
    this.entries.push({ at: this.clock, patch });
    return this;
  }
  step(step: Omit<Step, 'id'> & { id?: string }, after = 0) {
    this.clock += after;
    this.entries.push({ at: this.clock, step: { id: step.id ?? `step-${stepSeq++}`, ...step } });
    return this;
  }

  /** The analyst's words, as their turn. */
  analyst(text: string) {
    return this.patch({ op: 'add-turn', turn: { id: this.turnId(), role: 'analyst', text } });
  }

  /** An answer that says something and settles. */
  say(text: string, { blocks = [], ...extra }: Partial<AnswerTurn> & { blocks?: BlockSpec[] } = {}, after = 450) {
    const id = this.turnId();
    this.patch(
      {
        op: 'add-turn',
        turn: { ...extra, id, role: 'assistant', kind: 'answer', state: 'complete', blocks: [{ kind: 'narrative', text }, ...blocks] },
      },
      after,
    );
    return id;
  }

  /** An ask that waits for the reader. */
  ask(ask: AskSpec, after = 400) {
    const id = this.turnId();
    this.patch({ op: 'add-turn', turn: { id, role: 'assistant', kind: 'ask', stage: 'scope', state: 'pending', ask } }, after);
    return id;
  }

  /** A running answer whose steps are played by `run`; it settles on `settle`. */
  run(title: string, after = 300) {
    const id = this.turnId();
    this.patch({ op: 'add-turn', turn: { id, role: 'assistant', kind: 'answer', state: 'running', title, trace: [], blocks: [] } }, after);
    const run = {
      id,
      start: (stepId: string, label: string, after = 0) => {
        this.patch({ op: 'add-trace-step', turn: id, step: { id: stepId, label, state: 'running' } }, after);
        return run;
      },
      settle: (stepId: string, fields: Partial<TraceStep>, after = 0) => {
        this.patch({ op: 'update-trace-step', turn: id, step: stepId, fields: { state: 'done', ...fields } }, after);
        return run;
      },
      block: (block: BlockSpec, after = 0) => {
        this.patch({ op: 'add-block', turn: id, block }, after);
        return run;
      },
      done: (outcome?: Outcome, state: AnswerTurn['state'] = 'complete', after = 200) => {
        if (outcome) this.patch({ op: 'update-turn', turn: id, fields: { outcome } }, after);
        this.patch({ op: 'set-state', turn: id, state }, outcome ? 0 : after);
        return id;
      },
    };
    return run;
  }

  /** Settle an ask with the reader's value. */
  answered(turn: string, value: unknown) {
    return this.patch({ op: 'set-state', turn, state: 'answered', value });
  }
}

let stepSeq = 1;

/**
 * Plays a script: each entry at its time, or — `instant` — all at once. Returns a cancel.
 * `onEntry` applies one entry; it is called in order.
 */
export function play(script: Script, onEntry: (entry: Entry) => void, { instant = false } = {}): () => void {
  if (instant) {
    script.forEach(onEntry);
    return () => {};
  }
  const timers = script.map((entry) => window.setTimeout(() => onEntry(entry), entry.at));
  return () => timers.forEach(clearTimeout);
}
