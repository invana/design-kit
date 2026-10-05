import * as React from 'react';
import { action } from 'storybook/actions';
import { toast } from 'sonner';
import { AppLayoutAgents, type AppLayoutAgentsProps } from '@invana/themes/app-agents/layout';
import { AgentHeader, Button, StageTrail, Toaster, Workbook, type WorkbookPage } from '@invana/ui';
import { applyPatch, ChatSession, type ConversationEvent, type ConversationSpec, type Turn } from '@invana/assistant';
import { GitBranch, ListOrdered, Network, RotateCcw, Shapes, ShieldCheck, Table, Users } from 'lucide-react';

import { CHAT_ICONS, logEvent } from '../../../assistant/chat-kit';
import { appendStep, PlaybookProvider, usePlaybook, type Playbook, type Step } from '../playbook/playbook';
import { PlaybookPanel, type Refused } from '../playbook/playbook-panel';
import { SessionMenu, stagesOf, ThemeMenu } from './chrome';
import { COPY, DATA, say, type GraphModel, type Value } from './data';
import {
  acceptModel,
  PAGE_PROMPTS,
  progressOf,
  resolveCalls,
  respondToPrompt,
  respondToReply,
  runImport,
  showAll,
  showOnCanvas,
  type FlowContext,
  type Response,
  type TurnMeta,
  type Work,
} from './flows';
import { datasetOps, EMPTY_DATASET, type DatasetState } from './ops/dataset-ops';
import { canvasOps, EMPTY_CANVAS, EMPTY_GRAPH, graphOps, neighbours, type CanvasState, type GraphState } from './ops/graph-ops';
import { EMPTY_MODEL, modelOps, type ModelState } from './ops/model-ops';
import { CanvasPage, NodePanel } from './pages/canvas-page';
import { useGraph, WorkProvider } from './work';
import { DatasetPage, ProvenancePanel, type PickedCell } from './pages/dataset-page';
import { ModelPage } from './pages/model-page';
import { play, Writer, type Entry, type Script } from './script';

/**
 * The Dataset Studio: research a dataset with the assistant, model it as a graph, import it,
 * explore it on canvases — one session per canvas, branched like a conversation.
 *
 * Everything the assistant does to the work is a playbook step (`dataset`, `model`, `graph`,
 * `canvas:<session>`), and so is everything the reader does to it by hand. The pages draw the
 * work at the playbook's position, so stepping back replays it.
 */

interface Session {
  id: string;
  name: string;
  parent?: string;
  spec: ConversationSpec;
  /** What a turn carries for later — a proposal's model, the nodes a `Show on canvas` loads. */
  meta: Record<string, TurnMeta>;
}

const OPS = {
  dataset: datasetOps,
  model: modelOps,
  graph: graphOps,
  canvas: canvasOps,
};
const kindOf = (target: string) =>
  target === 'dataset' || target === 'model' || target === 'graph' ? target : target.startsWith('canvas:') ? 'canvas' : undefined;

/** A target's state after every recorded step — the work as it stands, which the assistant reads. */
function latest<S>(steps: readonly Step[], target: string, base: S, apply: (s: S, call: never) => S): S {
  let state = base;
  for (const step of steps)
    for (const call of step.calls)
      if (call.target === target) {
        try {
          state = apply(state, call as never);
        } catch {
          // A call that cannot apply is skipped, as the pages skip it.
        }
      }
  return state;
}

/** The marks on the agent header's second line: the access group and the policy. */
const HEADER_ICONS = { group: <Users />, governance: <ShieldCheck /> };

const canvasTab = (sid: string) => `canvas:${sid}`;
const sidOf = (tab: string) => (tab.startsWith('canvas:') ? tab.slice(7) : null);

function baseSpec(id: string, name: string, turns: Turn[] = []): ConversationSpec {
  return {
    id,
    title: name,
    analyst: 'You',
    assistant: DATA.agent.name,
    agent: DATA.agent,
    budget: DATA.budget,
    composer: {
      placeholder: 'Ask the assistant to research, build, model or explore…',
      attach: { accept: '.csv,.json' },
    },
    turns,
  };
}

export interface StudioProps {
  /** Fast-forward to a stage on open: 0 the start, 2 dataset built, 3 saved, 4 model ready, 5 graph imported. */
  stage?: number;
  /** Restart the story from nothing. */
  onRestart?: () => void;
}

export function DatasetStudio({ stage = 0, onRestart, ...layout }: StudioProps & Partial<AppLayoutAgentsProps>) {
  // ── state ────────────────────────────────────────────────────────────────
  const [sessions, setSessionsState] = React.useState<Record<string, Session>>({});
  const sessionsRef = React.useRef(sessions);
  const setSessions = (fn: (prev: Record<string, Session>) => Record<string, Session>) => {
    sessionsRef.current = fn(sessionsRef.current);
    setSessionsState(sessionsRef.current);
  };
  const [current, setCurrent] = React.useState('');
  const [tabs, setTabs] = React.useState<string[]>([]);
  const [active, setActive] = React.useState('');

  const [playbook, setPlaybookState] = React.useState<Playbook>({
    version: 1,
    title: 'Dataset studio',
    steps: [],
  });
  const playbookRef = React.useRef(playbook);
  const [refused, setRefused] = React.useState<Refused[]>([]);
  const playbackControls = usePlaybook(playbook);
  const [showPlaybook, setShowPlaybook] = React.useState(false);
  const [playbookFolded, setPlaybookFolded] = React.useState(false);

  const [picked, setPicked] = React.useState<PickedCell | null>(null);
  const [node, setNode] = React.useState<string | null>(null);

  const seq = React.useRef(0);
  const canvases = React.useRef(0);
  const proposed = React.useRef(false);
  const [wasProposed, setWasProposed] = React.useState(false);
  const cancels = React.useRef<(() => void)[]>([]);
  React.useEffect(() => () => cancels.current.forEach((c) => c()), []);
  const instant = React.useRef(false);

  // ── the work ─────────────────────────────────────────────────────────────
  const workOf = (sid: string, steps = playbookRef.current.steps): Work => ({
    dataset: latest<DatasetState>(steps, 'dataset', EMPTY_DATASET, datasetOps.apply!),
    model: latest<ModelState>(steps, 'model', EMPTY_MODEL, modelOps.apply!),
    graph: latest<GraphState>(steps, 'graph', EMPTY_GRAPH, graphOps.apply!),
    canvas: latest<CanvasState>(steps, canvasTab(sid), EMPTY_CANVAS, canvasOps.apply!),
    proposed: proposed.current,
  });

  const record = (step: Step) => {
    const result = appendStep(playbookRef.current, step, { kindOf, ops: OPS });
    if ('playbook' in result) {
      playbookRef.current = result.playbook;
      setPlaybookState(result.playbook);
    } else {
      action('step refused')(step.id, result.problems);
      setRefused((r) => [...r, { step, problems: result.problems }]);
    }
  };

  const ctxOf = (sid: string): FlowContext => ({
    work: workOf(sid),
    session: { id: sid, name: sessionsRef.current[sid]?.name ?? sid },
    turnId: (purpose) => `${purpose}-${++seq.current}`,
  });

  // ── tabs ─────────────────────────────────────────────────────────────────
  const openTab = (id: string) => {
    setTabs((list) => {
      if (list.includes(id)) return list;
      if (id === 'dataset') return ['dataset', ...list];
      if (id === 'model') {
        const at = list.indexOf('dataset') + 1;
        return [...list.slice(0, at), 'model', ...list.slice(at)];
      }
      return [...list, id];
    });
    setActive(id);
    const sid = sidOf(id);
    if (sid) setCurrent(sid);
  };

  // The page follows the playbook: moving to a step shows the page its first call lands on.
  const [seenStep, setSeenStep] = React.useState(playbackControls.current);
  if (seenStep !== playbackControls.current) {
    setSeenStep(playbackControls.current);
    const target = playbackControls.targets.find((t) => t !== 'graph');
    if (target) {
      const tab = target === 'dataset' || target === 'model' ? target : target;
      if (!tabs.includes(tab)) setTabs((list) => (list.includes(tab) ? list : tab === 'dataset' ? [tab, ...list] : [...list, tab]));
      setActive(tab);
      const sid = sidOf(tab);
      if (sid && sid !== current) setCurrent(sid);
    }
  }

  // ── the runner ───────────────────────────────────────────────────────────
  const onEntry = (sid: string) => (entry: Entry) => {
    if ('step' in entry) return record(entry.step);
    setSessions((all) => {
      const s = all[sid];
      if (!s) return all;
      try {
        return {
          ...all,
          [sid]: { ...s, spec: applyPatch(s.spec, entry.patch) },
        };
      } catch (error) {
        console.error(error);
        return all;
      }
    });
  };

  /** Plays the API's response into a session; `before` goes first — the reader's own turn. */
  const dispatch = (sid: string, response: Response | null, before: Script = []) => {
    if (!response) return;
    const s = sessionsRef.current[sid];
    if (!s) return;
    // A new turn supersedes the suggestions still on offer.
    const stale = s.spec.turns.filter(
      (t) => t.role === 'assistant' && t.kind === 'ask' && t.id.startsWith('suggest') && t.state === 'pending',
    );
    const entries: Script = [
      ...stale.map((t) => ({
        at: 0,
        patch: {
          op: 'set-state' as const,
          turn: t.id,
          state: 'superseded' as const,
        },
      })),
      ...before,
      ...response.writer.entries,
    ];
    if (entries.some((e) => 'patch' in e && e.patch.op === 'add-turn' && e.patch.turn.id.startsWith('schema'))) {
      proposed.current = true;
      setWasProposed(true);
    }
    // What to suggest next is read from the work as the script leaves it.
    const after = workOf(sid, [...playbookRef.current.steps, ...entries.flatMap((e) => ('step' in e ? [e.step] : []))]);
    const items = DATA.suggestions[String(progressOf(after))] ?? [];
    const end = entries.reduce((m, e) => Math.max(m, e.at), 0);
    if (items.length)
      entries.push({
        at: end + 300,
        patch: {
          op: 'add-turn',
          turn: {
            id: `suggest-${++seq.current}`,
            role: 'assistant',
            kind: 'ask',
            stage: 'act',
            state: 'pending',
            ask: { kind: 'suggestions', items },
          },
        },
      });
    setSessions((all) => ({
      ...all,
      [sid]: { ...all[sid]!, meta: { ...all[sid]!.meta, ...response.meta } },
    }));
    if (response.open) openTab(response.open);
    cancels.current.push(play(entries, onEntry(sid), { instant: instant.current }));
  };

  const analystTurn = (text: string): Script => [
    {
      at: 0,
      patch: {
        op: 'add-turn',
        turn: { id: `u-${++seq.current}`, role: 'analyst', text },
      },
    },
  ];

  /** The reader asks — typed, a chip, or a page's button standing in for typing. */
  const prompt = (sid: string, text: string, typed = true) =>
    dispatch(sid, respondToPrompt(ctxOf(sid), text), typed ? analystTurn(text) : []);

  /** The assistant says one thing. */
  const note = (sid: string, text: string) => {
    const writer = new Writer(() => `a-${++seq.current}`);
    writer.say(text, {}, 200);
    dispatch(sid, { writer, meta: {} });
  };

  // ── sessions ─────────────────────────────────────────────────────────────
  const newSession = (parent: string | null, upto?: string) => {
    const n = ++canvases.current;
    const sid = `s${n}`;
    const name = `my-canvas-${n}`;
    const from = parent ? sessionsRef.current[parent] : undefined;
    let turns: Turn[] = [];
    if (from) {
      const at = upto ? from.spec.turns.findIndex((t) => t.id === upto) : from.spec.turns.length - 1;
      // Its history comes along read-only: what was waiting on the reader there has expired here.
      turns = from.spec.turns
        .slice(0, at + 1)
        .map((t) => (t.role === 'assistant' && t.kind === 'ask' && t.state === 'pending' ? { ...t, state: 'expired' } : t));
    }
    setSessions((all) => ({
      ...all,
      [sid]: {
        id: sid,
        name,
        parent: from?.id,
        spec: baseSpec(sid, name, turns),
        meta: { ...(from?.meta ?? {}) },
      },
    }));
    setTabs((list) => {
      const after = from ? list.indexOf(canvasTab(from.id)) : -1;
      return after < 0 ? [...list, canvasTab(sid)] : [...list.slice(0, after + 1), canvasTab(sid), ...list.slice(after + 1)];
    });
    setActive(canvasTab(sid));
    setCurrent(sid);
    setNode(null);
    const writer = new Writer(() => `a-${++seq.current}`);
    if (from) {
      const ids = workOf(from.id).canvas.ids;
      if (ids.length)
        writer.step({
          title: `Branch ${from.name} into ${name}`,
          actor: 'you',
          calls: [
            {
              target: canvasTab(sid),
              op: 'load',
              args: { ids, replace: true },
            },
          ],
        });
      writer.say(
        say(COPY.branched, {
          parent: from.name,
          at: upto ? ' at an earlier message' : '',
          nodes: ids.length,
        }),
        {},
        100,
      );
    } else writer.say(n === 1 ? COPY.welcome : COPY.blank, {}, 0);
    dispatch(sid, { writer, meta: {} });
    return sid;
  };

  // ── events ───────────────────────────────────────────────────────────────
  const onEvent = (sid: string) => (event: ConversationEvent) => {
    logEvent(event);
    const s = sessionsRef.current[sid]!;
    if (event.type === 'prompt') {
      if (event.files?.length) return note(sid, 'Attaching a CSV or model file isn’t wired in this prototype.');
      return prompt(sid, event.text);
    }
    if (event.type === 'reply') {
      if (event.turn.startsWith('suggest')) {
        const text = String(event.value);
        return dispatch(sid, respondToPrompt(ctxOf(sid), text), [
          {
            at: 0,
            patch: {
              op: 'set-state',
              turn: event.turn,
              state: 'answered',
              value: text,
            },
          },
        ]);
      }
      return dispatch(sid, respondToReply(ctxOf(sid), event.turn, event.value, s.meta[event.turn]));
    }
    if (event.type !== 'action') return;
    const meta = s.meta[event.turn];
    switch (event.action) {
      case 'open-dataset':
        return openTab('dataset');
      case 'open-model':
        return openTab('model');
      case 'resolve':
        return prompt(sid, 'Resolve the conflicting cells', false);
      case 'accept-model':
      case 'accept-model-edit':
        if (meta?.model) dispatch(sid, acceptModel(ctxOf(sid), event.turn, meta.model, event.action === 'accept-model-edit'));
        return;
      case 'show':
        if (meta?.ids) {
          dispatch(sid, showOnCanvas(ctxOf(sid), event.turn, meta.ids));
          toast(`Loaded ${meta.ids.length} nodes on ${s.name}`);
        }
        return;
      case 'show-all':
        return dispatch(sid, showAll(ctxOf(sid), event.turn));
      case 'select': {
        const [row, column] = String(event.value).split('.') as [string, string];
        setPicked({ row, column });
        return openTab('dataset');
      }
      case 'branch':
        newSession(sid, event.turn);
        return void toast('Branched into a new canvas');
    }
  };

  // ── the reader's own changes to the work ─────────────────────────────────
  const editCell = (cell: PickedCell, value: Value) => {
    const row = workOf(current).dataset.rows.find((r) => r.id === cell.row);
    record({
      id: `edit-${++seq.current}`,
      title: `Set ${row?.name} · ${cell.column} to ${value}`,
      actor: 'you',
      calls: [{ target: 'dataset', op: 'setCell', args: { ...cell, value } }],
    });
    toast('Cell updated');
  };
  const resolveCell = (cell: PickedCell, option: number) => {
    const dataset = workOf(current).dataset;
    const key = `${cell.row}.${cell.column}`;
    const chosen = dataset.conflicts[key]![option]!;
    const { calls } = resolveCalls(dataset, [[key, option]]);
    record({
      id: `resolve-${++seq.current}`,
      title: `Keep ${chosen.value} for ${dataset.rows.find((r) => r.id === cell.row)?.name}`,
      actor: 'you',
      calls,
    });
    const left = Object.keys(dataset.conflicts).length - 1;
    note(
      current,
      say(COPY.kept, {
        value: String(chosen.value),
        name: String(dataset.rows.find((r) => r.id === cell.row)?.name),
        column: dataset.columns.find((c) => c.key === cell.column)!.label.toLowerCase(),
        source: chosen.source,
        left,
        s: left === 1 ? '' : 's',
      }),
    );
  };
  const changeModel = (model: GraphModel, title: string) => {
    record({
      id: `model-${++seq.current}`,
      title,
      actor: 'you',
      calls: [{ target: 'model', op: 'setModel', args: { model } }],
    });
    toast(title);
  };
  const canvasCall = (op: 'load' | 'clear', args: Record<string, unknown>, title: string) =>
    record({
      id: `canvas-${++seq.current}`,
      title,
      actor: 'you',
      calls: [{ target: canvasTab(current), op, args }],
    });

  // ── open: the first session, then fast-forward to the stage asked for ────
  const opened = React.useRef(false);
  React.useEffect(() => {
    if (opened.current) return;
    opened.current = true;
    // Set before the session opens, so its welcome lands first rather than a tick after the replay.
    instant.current = !!stage;
    const sid = newSession(null);
    if (!stage) return;
    const lastAsk = (purpose: string) =>
      [...sessionsRef.current[sid]!.spec.turns].reverse().find((t) => t.id.startsWith(`${purpose}-`))!.id;
    const ctx = () => ctxOf(sid);
    // Fast-forward replays the recorded path into state, once, on open.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    prompt(sid, DATA.suggestions['0']![0]!);
    if (stage >= 2)
      dispatch(
        sid,
        respondToReply(
          ctx(),
          lastAsk('schema'),
          DATA.columns.filter((c) => !DATA.proposedOff.includes(c.key)).map((c) => c.key),
          undefined,
        ),
      );
    if (stage >= 3) {
      prompt(sid, PAGE_PROMPTS.save);
      dispatch(sid, respondToReply(ctx(), lastAsk('save'), { name: 'Chickpea varieties', citations: true }, undefined));
    }
    if (stage >= 4) {
      prompt(sid, 'Turn this dataset into a graph model');
      const turn = lastAsk('model');
      dispatch(sid, acceptModel(ctx(), turn, sessionsRef.current[sid]!.meta[turn]!.model!, false));
    }
    if (stage >= 5) {
      prompt(sid, PAGE_PROMPTS.import);
      const w = workOf(sid);
      dispatch(
        sid,
        runImport(ctx(), lastAsk('import'), {
          version: w.dataset.versions.at(-1),
          mode: 'replace',
          onError: 'skip',
        }),
      );
    }
    // The replay lands as one batch, so the playbook opens only its last page: open each page
    // the stage reached, ending on the one it is about.
    if (stage >= 2) openTab('dataset');
    if (stage >= 4) openTab('model');
    if (stage >= 5) openTab(canvasTab(sid));
    instant.current = false;
    // Opening reads nothing that changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── drawing ──────────────────────────────────────────────────────────────
  const session = sessions[current];
  if (!session) return null;
  // Drawn from state; the runner reads the refs.
  const work: Work = {
    dataset: latest<DatasetState>(playbook.steps, 'dataset', EMPTY_DATASET, datasetOps.apply!),
    model: latest<ModelState>(playbook.steps, 'model', EMPTY_MODEL, modelOps.apply!),
    graph: latest<GraphState>(playbook.steps, 'graph', EMPTY_GRAPH, graphOps.apply!),
    canvas: latest<CanvasState>(playbook.steps, canvasTab(current), EMPTY_CANVAS, canvasOps.apply!),
    proposed: wasProposed,
  };
  const progress = progressOf(work);

  const pickStage = (i: number) => {
    if (i === 1 && work.dataset.rows.length) openTab('dataset');
    else if ((i === 2 || i === 3) && work.model.model) openTab('model');
    else if (i === 4 && work.graph.graph) openTab(canvasTab(current));
    else
      toast(
        [
          'Start by asking in the chat',
          'Build the dataset first',
          'Save the dataset first',
          'Create the model first',
          'Import the dataset first',
        ][i]!,
      );
  };

  const pages: WorkbookPage[] = tabs.map((id) => {
    if (id === 'dataset')
      return {
        id,
        title: `${work.dataset.name} · ${work.dataset.version}`,
        icon: Table,
        closable: true,
        content: (
          <DatasetPage
            picked={picked}
            onPick={setPicked}
            onEdit={editCell}
            onSave={() => prompt(current, PAGE_PROMPTS.save)}
            onAddColumn={() => prompt(current, PAGE_PROMPTS.column)}
          />
        ),
      };
    if (id === 'model')
      return {
        id,
        title: 'Chickpea graph model · model',
        icon: Network,
        closable: true,
        content: <ModelPage onChange={changeModel} onImport={() => prompt(current, PAGE_PROMPTS.import)} />,
      };
    const sid = sidOf(id)!;
    const s = sessions[sid]!;
    return {
      id,
      title: `${s.name} · canvas`,
      icon: s.parent ? GitBranch : Shapes,
      content: (
        <CanvasPage
          session={{ id: sid, name: s.name }}
          parent={s.parent ? sessions[s.parent]?.name : undefined}
          selected={sid === current ? node : null}
          onSelect={setNode}
          onLoadAll={() => prompt(sid, 'Show the whole graph on canvas')}
          onClear={() => {
            setNode(null);
            canvasCall('clear', {}, `Clear ${s.name}`);
          }}
        />
      ),
    };
  });

  const firstAsk = session.spec.turns.find((t) => t.role === 'analyst')?.text;

  return (
    <PlaybookProvider router={playbackControls.router}>
      <WorkProvider>
        <AppLayoutAgents
          {...layout}
          header={{
            ...layout.header,
            center: <StageTrail steps={stagesOf(progress)} onPick={(id) => pickStage(Number(id))} />,
            rightNavItems: [
              {
                name: 'Playbook',
                label: (
                  <Button
                    variant={showPlaybook ? 'secondary' : 'ghost'}
                    size="sm"
                    aria-label="Playbook"
                    aria-pressed={showPlaybook}
                    onClick={() => setShowPlaybook((v) => !v)}
                  >
                    <ListOrdered />
                    {playbook.steps.length || null}
                  </Button>
                ),
                className: '!px-1 !py-0',
              },
              {
                name: 'Theme',
                label: <ThemeMenu />,
                className: '!px-1 !py-0',
              },
              {
                name: 'Restart',
                label: (
                  <Button variant="ghost" size="sm" onClick={onRestart}>
                    <RotateCcw />
                    Restart
                  </Button>
                ),
                className: '!px-1 !py-0',
              },
            ],
          }}
          leftSection={{
            content: (
              <ChatSession
                key={current}
                spec={session.spec}
                variant="cli"
                icons={CHAT_ICONS}
                actions={[
                  'copy',
                  'steps',
                  {
                    id: 'branch',
                    label: 'Branch from here',
                    icon: <GitBranch className="size-4" />,
                  },
                ]}
                header={
                  // Line one is what the session is about — its first question — and the session
                  // menu; line two is who answers (the agent) and what it may reach (its policy).
                  <AgentHeader
                    title={firstAsk ?? session.name}
                    agent={session.spec.agent}
                    access={DATA.access}
                    governance={DATA.governance}
                    icons={HEADER_ICONS}
                    actions={
                      <SessionMenu
                        sessions={Object.values(sessions).map((x) => ({
                          id: x.id,
                          name: x.name,
                          parent: x.parent,
                          asks: x.spec.turns.filter((t) => t.role === 'analyst').length,
                        }))}
                        current={current}
                        onPick={(sid) => {
                          openTab(canvasTab(sid));
                          setNode(null);
                        }}
                        onBranch={() => newSession(current)}
                        onNew={() => {
                          newSession(null);
                          toast('New canvas and session');
                        }}
                      />
                    }
                  />
                }
                onEvent={(event) => onEvent(current)(event)}
              />
            ),
          }}
          mainSection={{
            content: (
              <Workbook
                pages={pages}
                activeId={active}
                onSelect={(id) => {
                  setActive(id);
                  const sid = sidOf(id);
                  if (sid && sid !== current) {
                    setCurrent(sid);
                    setNode(null);
                  }
                }}
                onClose={(id) => {
                  setTabs((list) => list.filter((x) => x !== id));
                  if (active === id) setActive(canvasTab(current));
                  if (id === 'dataset') setPicked(null);
                }}
                onAdd={() => {
                  newSession(null);
                  toast('New canvas and session');
                }}
                addLabel="New canvas"
                keepMounted
              />
            ),
          }}
          overlay={
            <Overlays
              showPlaybook={showPlaybook}
              playbook={
                <PlaybookPanel
                  play={playbackControls}
                  refused={refused}
                  collapsed={playbookFolded}
                  onCollapsedChange={setPlaybookFolded}
                  onClose={() => setShowPlaybook(false)}
                />
              }
              picked={active === 'dataset' ? picked : null}
              onClosePicked={() => setPicked(null)}
              onResolve={resolveCell}
              onSearchAgain={(cell) => {
                const row = workOf(current).dataset.rows.find((r) => r.id === cell.row);
                prompt(current, `Search again for the releasing institution of ${row?.name}`);
              }}
              node={sidOf(active) === current ? node : null}
              onCloseNode={() => setNode(null)}
              onExpand={(id) => {
                const graph = workOf(current).graph.graph!;
                const ids = neighbours(graph, [id]);
                canvasCall('load', { ids }, `Expand ${graph.nodes[id]!.name}`);
              }}
              onAsk={(name) => prompt(current, `Tell me about ${name}`)}
            />
          }
        />
      </WorkProvider>
      <Toaster />
    </PlaybookProvider>
  );
}

/** What floats over the work: the playbook, a cell's provenance, a node's details. */
function Overlays(props: {
  showPlaybook: boolean;
  playbook: React.ReactNode;
  picked: PickedCell | null;
  onClosePicked: () => void;
  onResolve: (cell: PickedCell, option: number) => void;
  onSearchAgain: (cell: PickedCell) => void;
  node: string | null;
  onCloseNode: () => void;
  onExpand: (id: string) => void;
  onAsk: (name: string) => void;
}) {
  const { graph } = useGraph();
  return (
    <>
      {props.showPlaybook ? props.playbook : null}
      {props.picked ? (
        <ProvenancePanel
          cell={props.picked}
          onClose={props.onClosePicked}
          onResolve={props.onResolve}
          onSearchAgain={props.onSearchAgain}
        />
      ) : null}
      {props.node && graph ? (
        <NodePanel id={props.node} graph={graph} onClose={props.onCloseNode} onExpand={props.onExpand} onAsk={props.onAsk} />
      ) : null}
    </>
  );
}
