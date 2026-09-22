import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArtifactTable, PanelBox } from '@invana/ui';

const meta: Meta<typeof ArtifactTable> = {
  title: 'UI/UI Extended/ArtifactTable',
  component: ArtifactTable,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * What an import's write step left behind — including the rejects, which are a
 * **file** rather than a number. That is what makes `18 rejected` something a
 * person can open.
 *
 * The digest is the address: the same bytes produced twice are one artifact, so
 * a file that outlives its run is still reachable by it. The last row is one
 * retention has taken — struck and unfetchable, because *this existed and is
 * gone* is not *nothing was written*.
 */
export const Default: Story = {
  render: () => (
    <div className="w-[860px]">
      <PanelBox
        title="Files it left"
        aside="a file is addressed by its digest — the same bytes twice are one artifact"
        flush
      >
        <ArtifactTable
          onOpen={() => undefined}
          onDownload={() => undefined}
          files={[
            {
              name: 'rejects.jsonl',
              kind: 'rejects',
              size: '6 KB',
              digest: 'a10f47b3',
              written: '+8.2s',
            },
            {
              name: 'report.json',
              kind: 'interpreter',
              size: '2.4 KB',
              digest: '5d93c1ef',
              written: '+8.4s',
            },
            {
              name: 'mapping.yml',
              kind: 'input',
              size: '1.1 KB',
              digest: 'e8b2470a',
              written: '+0.1s',
            },
            {
              name: 'rows-4902.csv',
              kind: 'export',
              size: '412 KB',
              digest: '7c02e918',
              written: '+8.4s',
              gone: true,
            },
          ]}
        />
      </PanelBox>
    </div>
  ),
};
