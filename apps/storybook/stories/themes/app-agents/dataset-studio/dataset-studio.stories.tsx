import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { AppLayoutAgents } from '@invana/themes/app-agents/layout';
import { ThemeProvider } from '@invana/themes';
import { Separator } from '@invana/ui';

import { DATA } from './data';
import { DatasetStudio as Studio } from './studio';

type Args = React.ComponentProps<typeof AppLayoutAgents> & { stage: number };

const meta: Meta<Args> = {
  title: 'Themes/AppAgents/Dataset Studio',
  component: AppLayoutAgents,
  parameters: { layout: 'fullscreen', selfThemed: true },
  argTypes: {
    stage: {
      control: { type: 'select', labels: { 0: 'Start', 2: 'Dataset built', 3: 'Dataset saved', 4: 'Model ready', 5: 'Graph imported' } },
      options: [0, 2, 3, 4, 5],
      description: 'Jump to a stage: the scripted path is played to it at once.',
    },
  },
};

export default meta;
type Story = StoryObj<Args>;

/** `Restart` draws the studio afresh. */
function Restartable(args: Args) {
  const [run, setRun] = React.useState(0);
  return <Studio key={`${run}-${args.stage}`} {...args} onRestart={() => setRun((n) => n + 1)} />;
}

/**
 * The Dataset Studio on the agents shell — the conversation on the left, bound to the open
 * canvas; the work on the right, as tabs: the dataset, the graph model, and a canvas per session.
 *
 * Ask the assistant to list the chickpea varieties: it proposes columns (pick them), builds the
 * table with a source behind every value (watch it fill in; click a cell for its sources,
 * double-click to edit it; amber cells disagree), adds columns, resolves conflicts and saves a
 * version — each through a form in the thread. It then proposes a graph model (edit it as a
 * form, a column mapping or a model file), imports the dataset (replace or merge; skip or stop on
 * a missing value), and answers questions over the graph — each answer can be shown on the
 * canvas, where nodes are dragged, selected and expanded.
 *
 * Every change to the work is a **playbook** step, the assistant's and the reader's alike: open
 * the playbook from the header and step back to replay the work. `New canvas` starts a session;
 * `Branch` (or `Branch from here` on an answer) copies the session and its canvas. The graph is
 * drawn by the canvas repo's `GraphCanvas`, linked locally. Pick a `stage` to start further along.
 */
export const DatasetStudio: Story = {
  render: (args) => (
    <ThemeProvider defaultTheme="default" defaultMode="light" storageKey={null}>
      <Restartable {...args} />
    </ThemeProvider>
  ),
  args: {
    stage: 0,
    header: {
      left: (
        <>
          Invana
          <Separator orientation="vertical" />
          {DATA.workspace}
        </>
      ),
    },
    mainSection: { content: null },
  },
  play: async ({ canvasElement, step }) => {
    const c = within(canvasElement);
    await step('The session opens with a suggestion; asking for the varieties proposes columns', async () => {
      await userEvent.click(await c.findByRole('button', { name: /List all chickpea varieties/ }, { timeout: 4000 }));
      await expect(await c.findByRole('button', { name: 'Accept and collect' }, { timeout: 4000 })).toBeInTheDocument();
    });
    await step('Accepting builds the table, row batch by row batch, and flags the conflicts', async () => {
      await userEvent.click(c.getByRole('button', { name: 'Accept and collect' }));
      await waitFor(() => expect(c.getByText('Sahyadri')).toBeInTheDocument(), { timeout: 8000 });
      await waitFor(() => expect(c.getByText('3 conflicts')).toBeInTheDocument(), { timeout: 6000 });
    });
    const chip = async (name: RegExp) => userEvent.click(await c.findByRole('button', { name }, { timeout: 6000 }));
    await step('A cell opens its sources; one whose sources disagree is settled from the panel', async () => {
      await userEvent.click(c.getByText('18.2'));
      const panel = await c.findByText(/Pick the value to keep/);
      await expect(panel).toBeInTheDocument();
      await userEvent.click(c.getAllByRole('button', { name: 'Use this' })[0]!);
      await waitFor(() => expect(c.getByText('2 conflicts')).toBeInTheDocument(), { timeout: 4000 });
    });
    await step('Saving asks for a name in the thread, then saves v1', async () => {
      await chip(/^Save this dataset$/);
      await userEvent.click(await c.findByRole('button', { name: 'Save v1' }, { timeout: 4000 }));
      await waitFor(() => expect(c.getByText('Saved v1')).toBeInTheDocument(), { timeout: 4000 });
    });
    await step('The assistant proposes a graph model; accepting to edit opens it', async () => {
      await chip(/Turn this dataset into a graph model/);
      await userEvent.click(await c.findByRole('button', { name: 'Accept and edit' }, { timeout: 4000 }));
      await expect(await c.findByText('Schema preview', {}, { timeout: 4000 })).toBeInTheDocument();
    });
    await step('Importing runs its steps and reports what it made', async () => {
      await chip(/Import the dataset into the graph model/);
      await userEvent.click(await c.findByRole('button', { name: 'Start import' }, { timeout: 4000 }));
      await expect(await c.findByText(/Import finished/, {}, { timeout: 8000 })).toBeInTheDocument();
    });
    await step('An answer over the graph is shown on the canvas', async () => {
      await chip(/Wilt-resistant kabuli varieties/);
      await userEvent.click(await c.findByRole('button', { name: 'Show on canvas' }, { timeout: 4000 }));
      await waitFor(() => expect(canvasElement.querySelector('canvas')).not.toBeNull(), { timeout: 6000 });
    });
    await step('Branching copies the session and its canvas into a new tab', async () => {
      await userEvent.click(c.getByRole('button', { name: 'Branch' }));
      await expect(await c.findByText(/Branched from/, {}, { timeout: 4000 })).toBeInTheDocument();
      await expect(c.getAllByText(/my-canvas-2/).length).toBeGreaterThan(0);
    });
    await step('The playbook holds every step, the assistant’s and the reader’s', async () => {
      await userEvent.click(c.getByRole('button', { name: 'Playbook' }));
      await expect(await c.findByText(/Extract Anvaya/)).toBeInTheDocument();
      await expect(c.getAllByText(/Branch my-canvas-1 into my-canvas-2/).length).toBeGreaterThan(0);
    });
  },
};
