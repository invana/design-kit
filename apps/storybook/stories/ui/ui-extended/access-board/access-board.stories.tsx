import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { AccessBoard as Component, accessKey, type AccessStore } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/access-board.json';
import { DECLARED, PALETTE, primedStore, useReplayedStore, useSnapshot, WINDOWS } from '../access-monitor/_access';
import { ReplayFrame, useReplay } from '../../../_story/replay';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Log, type Variant } from '../../../_story/variant-board';

interface BoardVariant extends Variant {
  /** Windows folded before the frame is drawn. */
  windows?: number;
  /** Replay the recorded windows instead. */
  live?: boolean;
}

const VARIANTS = VARIANTS_JSON as BoardVariant[];

interface Args {
  variant: string;
  /** Milliseconds between windows in the live cell. */
  every: number;
  onFocusChange: (key: string | null) => void;
  onSelectedChange: (key: string | null) => void;
}

const meta = {
  title: 'UI/UI Extended/AccessBoard',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { AccessBoard, createAccessStore } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { declared: DECLARED, palette: PALETTE },
              setup: [
                '// The server sums touches into windows; the store folds each one as it lands.',
                'const store = React.useMemo(() => createAccessStore({ declared }), []);',
                v.live
                  ? 'React.useEffect(() => feed.subscribe((window) => store.push(window)), [store]);'
                  : `// ${v.windows} windows already pushed: a frozen frame.`,
                'const { targets } = React.useSyncExternalStore(store.subscribe, store.getSnapshot);',
                '',
                '// Both receive a target key — "graph_data␟Company.revenue" — or null.',
                'const [focus, onFocusChange] = React.useState(null);',
                'const [selected, onSelectedChange] = React.useState(null);',
              ].join('\n'),
              call: [
                '<AccessBoard',
                '  targets={targets}',
                '  palette={palette}',
                '  focus={focus}',
                '  selected={selected}',
                '  onFocusChange={onFocusChange}',
                '  onSelectedChange={onSelectedChange}',
                '/>',
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', every: 250, onFocusChange: fn(), onSelectedChange: fn() },
  argTypes: {
    variant: variantArg(VARIANTS),
    every: { control: { type: 'range', min: 100, max: 1000, step: 50 } },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The board over a store, with pointing and picking held as a consumer holds them. */
function Board({ store, args, log }: { store: AccessStore; args: Args; log: Log }) {
  const { targets } = useSnapshot(store);
  const [focus, setFocus] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<string | null>(null);
  return (
    <Component
      targets={targets}
      palette={PALETTE}
      focus={focus}
      selected={selected}
      onFocusChange={(key) => {
        args.onFocusChange(key);
        log('onFocusChange', key);
        setFocus(key);
      }}
      onSelectedChange={(key) => {
        args.onSelectedChange(key);
        log('onSelectedChange', key);
        setSelected(key);
      }}
    />
  );
}

function Frozen({ windows, args, log }: { windows: number; args: Args; log: Log }) {
  const store = React.useMemo(() => primedStore(windows), [windows]);
  return <Board store={store} args={args} log={log} />;
}

function Live({ args, log }: { args: Args; log: Log }) {
  const replay = useReplay(WINDOWS.length, { every: args.every });
  const store = useReplayedStore(replay.at);
  return (
    <ReplayFrame replay={replay} noun="window" width={520}>
      <Board store={store} args={args} log={log} />
    </ReplayFrame>
  );
}

/**
 * What is being touched right now — one lit tile per target, grouped by layer, from the windows
 * recorded in `fixtures/ui-extended/access-monitor.json`.
 *
 * In the frozen frame, mid-way through *Enrich companies*: `Company.revenue` wears a ring on its
 * light — it is being written. `api.crunchbase.com` has a warning edge — data is leaving.
 * `sec.gov/edgar` is struck on a destructive edge: refused, and never declared, so the board grew
 * a tile for it rather than dropping it. `Person` is hollow — declared, never touched. The *Read
 * filings* targets are still faintly lit, cooling. The live cell plays the same windows in.
 *
 * Point at a tile and the board washes it; click one and it is edged — what the monitor uses to
 * narrow its stream.
 */
export const AccessBoard: Story = {
  render: (args) => (
    <VariantBoard variants={VARIANTS} variant={args.variant}>
      {(v, log) => (v.live ? <Live args={args} log={log} /> : <Frozen windows={v.windows ?? 0} args={args} log={log} />)}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Mid-way through Enrich companies' }));
    const key = accessKey('graph_data', 'Company.revenue');
    await step('Pick the tile being written', async () => {
      await userEvent.click(cell.getByRole('button', { name: /^Company\.revenue:/ }));
      await expect(args.onSelectedChange).toHaveBeenCalledWith(key);
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('onSelectedChange');
    });
    await step('Picking it again clears the pick', async () => {
      await userEvent.click(cell.getByRole('button', { name: /^Company\.revenue:/ }));
      await expect(args.onSelectedChange).toHaveBeenLastCalledWith(null);
    });
  },
};
