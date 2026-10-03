import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ArtifactTable as Component, PanelBox, type Artifact, type ArtifactTableProps } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/artifact-table.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../../_story/variant-grid';

interface ArtifactVariant extends Variant {
  /** The panel the table sits in, when it is a step's record. */
  panel?: { title: string; aside: string };
  props: Pick<ArtifactTableProps, 'variant'> & { files: (Artifact & { name: string })[] };
}

const VARIANTS = VARIANTS_JSON as ArtifactVariant[];

interface Args {
  variant: string;
  onOpen: (file: Artifact, index: number) => void;
  onDownload: (file: Artifact, index: number) => void;
}

const meta = {
  title: 'UI/UI Extended/ArtifactTable',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { ArtifactTable, PanelBox } from '@invana/ui';"],
            picked.map((v) => {
              const table = jsx('ArtifactTable', {
                variant: v.props.variant ? { literal: v.props.variant } : undefined,
                files: 'files',
                onOpen: v.props.variant === 'list' ? undefined : 'onOpen',
                onDownload: 'onDownload',
              });
              return {
                comment: v.caption,
                data: { files: v.props.files },
                setup:
                  '// Each receives the file and its row index: ({ name: "rejects.jsonl", … }, 0).\n' +
                  (v.props.variant === 'list' ? '' : 'const onOpen = (file, index) => {};\n') +
                  'const onDownload = (file, index) => {};',
                call: v.panel
                  ? [
                      `<PanelBox title="${v.panel.title}" aside="${v.panel.aside}" flush>`,
                      table.replace(/^/gm, '  '),
                      '</PanelBox>',
                    ].join('\n')
                  : table,
              };
            }),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onOpen: fn(), onDownload: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

function Cell({ v, args, log }: { v: ArtifactVariant; args: Args; log: Log }) {
  const table = (
    <Component
      {...v.props}
      onOpen={
        v.props.variant === 'list'
          ? undefined
          : (file, index) => {
              args.onOpen(file, index);
              log('onOpen', [file.name, index]);
            }
      }
      onDownload={(file, index) => {
        args.onDownload(file, index);
        log('onDownload', [file.name, index]);
      }}
    />
  );
  return v.panel ? (
    <PanelBox title={v.panel.title} aside={v.panel.aside} flush>
      {table}
    </PanelBox>
  ) : (
    table
  );
}

/**
 * The files a step left behind — including the rejects, which are a **file** rather than a
 * number. That is what makes `18 rejected` something a person can open.
 *
 * The digest is the address: the same bytes produced twice are one artifact, so a file that
 * outlives its run is still reachable by it. The last row of the table is one retention has taken
 * — struck and unfetchable, because *this existed and is gone* is not *nothing was written*.
 * `list` is name, size and digest in bare rows, for the few files an answer hands over.
 *
 * Open or download a row: the callback receives the file and its index.
 */
export const ArtifactTable: Story = {
  render: (args) => (
    <VariantGrid variants={VARIANTS} variant={args.variant}>
      {(v, log) => <Cell v={v} args={args} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const VARIANT = VARIANTS[0]!;
    const cell = within(canvas.getByRole('group', { name: VARIANT.caption }));
    await step('Open the rejects', async () => {
      await userEvent.click(cell.getAllByRole('button', { name: 'Open' })[0]!);
      await expect(args.onOpen).toHaveBeenCalledWith(VARIANT.props.files[0], 0);
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('["rejects.jsonl", 0]');
    });
    await step('A file retention has taken cannot be fetched', async () => {
      await expect(cell.getAllByRole('button', { name: 'Download' }).at(-1)).toBeDisabled();
    });
    await step('Download from the list', async () => {
      const list = within(canvas.getByRole('group', { name: 'List' }));
      await userEvent.click(list.getAllByRole('button', { name: 'Download' })[1]!);
      await expect(args.onDownload).toHaveBeenCalledWith(VARIANTS[1]!.props.files[1], 1);
    });
  },
};
