import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button, MetricGrid, MetricTile, Tour, useTour, type TourStep } from '@invana/ui';

import DATA from '../../../../fixtures/ui-extended/tour.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Log } from '../../../_story/variant-board';

interface StepData {
  id: string;
  title: string;
  body?: string;
  callout?: { label?: string; content: string };
  references?: { label?: string; items: { label: string }[] };
  /** Names a body the story draws — JSON cannot hold a node. */
  content?: 'metrics';
  metrics?: { label: string; value: string }[];
}

interface Variant {
  caption: string;
  position?: 'bottom-right';
  showProgressBar?: boolean;
  /** Start with the tour closed, behind a button — a floating tour covers the page. */
  startClosed?: boolean;
  steps: StepData[];
}

const VARIANTS = DATA as Variant[];

interface Args {
  variant: string;
  onStepChange: (index: number) => void;
  onComplete: () => void;
  onExit: () => void;
  onReference: (label: string) => void;
}

/** `content: "metrics"` — the step's figures as tiles. */
const CONTENT = {
  metrics: (s: StepData) => (
    <MetricGrid columns={s.metrics!.length}>
      {s.metrics!.map((m) => (
        <MetricTile key={m.label} label={m.label} value={m.value} />
      ))}
    </MetricGrid>
  ),
};

function steps(data: StepData[], onReference: (label: string) => void): TourStep[] {
  return data.map(({ content, metrics: _metrics, references, ...s }) => ({
    ...s,
    content: content ? CONTENT[content](data.find((d) => d.id === s.id)!) : undefined,
    references: references && {
      ...references,
      items: references.items.map((r) => ({ ...r, onClick: () => onReference(r.label) })),
    },
  }));
}

function Run({ v, log, args, close }: { v: Variant; log: Log; args: Omit<Args, 'variant'>; close: () => void }) {
  const tour = useTour({
    steps: steps(v.steps, (label) => {
      args.onReference(label);
      log('onReference', label);
    }),
    onStepChange: (index) => {
      args.onStepChange(index);
      log('onStepChange', index);
    },
    onComplete: () => {
      args.onComplete();
      log('onComplete', null);
      close();
    },
    onExit: () => {
      args.onExit();
      log('onExit', null);
      close();
    },
  });
  return <Tour controller={tour} position={v.position} showProgressBar={v.showProgressBar} />;
}

/** A consumer closes the tour on exit or finish, and offers it again. */
function Live({ v, log, args }: { v: Variant; log: Log; args: Omit<Args, 'variant'> }) {
  const [open, setOpen] = React.useState(!v.startClosed);
  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Start tour
      </Button>
    );
  }
  return <Run v={v} log={log} args={args} close={() => setOpen(false)} />;
}

const meta = {
  title: 'UI/UI Extended/Tour',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { MetricGrid, MetricTile, Tour, useTour } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { steps: v.steps },
              setup: [
                ...(v.steps.some((s) => s.content)
                  ? ['// A step\'s `content` replaces its typed body — here, its metrics as tiles:', '// content: <MetricGrid columns={2}>{metrics.map((m) => <MetricTile key={m.label} {...m} />)}</MetricGrid>']
                  : []),
                '// onStepChange receives the new index; onComplete and onExit receive nothing.',
                '// A reference with onClick is a button: { label: "server.go", onClick: () => open("server.go") }.',
                'const [open, setOpen] = React.useState(true);',
                'const tour = useTour({ steps, onStepChange, onComplete: () => setOpen(false), onExit: () => setOpen(false) });',
              ].join('\n'),
              call: `{open && <Tour controller={tour}${v.position ? ` position="${v.position}"` : ''}${v.showProgressBar ? ' showProgressBar' : ''} />}`,
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onStepChange: fn(), onComplete: fn(), onExit: fn(), onReference: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * A step-through tour panel — a label badge, a counter and exit in the header; a title, body, an
 * accented callout and reference chips; Prev / Next below — driven by `useTour`, from
 * `fixtures/ui-extended/tour.json`. A step's `content` replaces its typed body; `position` pins
 * the panel to a corner of the viewport (the floating cell starts closed, so it does not cover
 * the board). Step through, click a reference, exit or finish: each is logged, and the story
 * closes the tour and offers it again.
 */
export const TourStory: Story = {
  name: 'Tour',
  render: ({ variant, ...args }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <Live v={v} log={log} args={args} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: VARIANTS[0].caption }));
    await step('Next moves to step 2', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Next' }));
      await expect(args.onStepChange).toHaveBeenCalledWith(1);
      await expect(cell.getByText('Product Catalog Service')).toBeInTheDocument();
    });
    await step('A reference is clickable', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'server.go' }));
      await expect(args.onReference).toHaveBeenCalledWith('server.go');
    });
    await step('Exit closes the tour', async () => {
      await userEvent.click(cell.getByRole('button', { name: /Exit Tour/ }));
      await expect(args.onExit).toHaveBeenCalled();
      await expect(cell.getByRole('button', { name: 'Start tour' })).toBeInTheDocument();
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('onExitnull');
    });
  },
};
