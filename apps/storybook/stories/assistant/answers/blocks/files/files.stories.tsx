import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import type { AnswerTurn, BlockSpec, FileItem } from '@invana/assistant';

import { Board } from '../../../board';

const meta: Meta<typeof Board> = {
  title: 'Assistant/Answers/Blocks/Files',
  component: Board,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const answer = (id: string, block: BlockSpec, extra?: Partial<AnswerTurn>): AnswerTurn => ({
  id,
  role: 'assistant',
  kind: 'answer',
  state: 'complete',
  label: 'files',
  blocks: [block],
  ...extra,
});

const three: FileItem[] = [
  { name: 'margin-bridge-q3.xlsx', size: '48 KB', digest: 'a91f03c2' },
  { name: 'rejected-rows.csv', size: '6 KB', digest: '77be1d0e' },
  { name: 'chart-freight.png', size: '112 KB', digest: 'c0d45a9b' },
];

/** The Files board on the Design Kit Spec, variant for variant. */
export const Files: Story = {
  name: 'Files',
  args: {
    onEvent: fn(),
    variants: [
      { caption: 'By digest', turn: answer('f1', { kind: 'files', files: three }) },
      {
        caption: 'Icons + download',
        turn: answer('f2', { kind: 'files', files: three, download: true }, { aside: '3 files · 166 KB' }),
      },
      {
        caption: 'One file',
        turn: answer('f3', {
          kind: 'files',
          files: [{ name: 'margin-bridge-q3.xlsx', note: '48 KB · kept for 7 days' }],
          download: true,
        }),
      },
      {
        caption: 'Rejected rows',
        turn: answer('f4', {
          kind: 'files',
          files: [
            {
              name: 'rejected-rows.csv',
              note: '412 rows · missing store code',
              status: { label: 'rejected', tone: 'warn' },
            },
          ],
          caption: 'Left out of every figure above',
        }),
      },
      {
        caption: 'Loading',
        turn: answer('f5', { kind: 'files', files: [], status: 'loading' }, { state: 'running' }),
      },
      {
        caption: 'No data',
        turn: answer('f6', {
          kind: 'files',
          files: [],
          status: 'empty',
          emptyText: 'No files were produced. The answer is above.',
        }),
      },
      {
        caption: 'At 280px',
        narrow: true,
        turn: answer(
          'f7',
          {
            kind: 'files',
            files: three.map(({ name, size }) => ({ name, size })),
            caption: 'Digests in the file details',
          },
          { aside: '3 · 166 KB' },
        ),
      },
    ],
  },
};
