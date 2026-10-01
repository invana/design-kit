import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import type { AskSpec, AskTurn, StageId } from '@invana/assistant';

import { Board } from '../../../board';

const meta: Meta<typeof Board> = {
  title: 'Assistant/Asks/Blocks/Confirm',
  component: Board,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const ask = (id: string, stage: StageId, spec: AskSpec, settled?: Partial<AskTurn>): AskTurn => ({
  id,
  role: 'assistant',
  kind: 'ask',
  stage,
  state: 'pending',
  ask: spec,
  ...settled,
});

const backtest: AskSpec = {
  kind: 'confirm',
  question: 'Run the full backtest?',
  description: 'Replays every fill since 2019 through factor model v4.',
  costAs: 'strip',
  cost: [
    { label: 'Rows', value: '2.3B' },
    { label: 'Time', value: '~40 s' },
    { label: 'Writes', value: '0' },
  ],
  yes: 'Run it',
  no: 'Narrow to Q3 first',
  default: true,
  align: 'end',
};

/** The Confirm board of the Design Kit Spec, variant for variant. */
export const Confirm: Story = {
  name: 'Confirm',
  args: {
    onEvent: fn(),
    variants: [
      {
        caption: 'Cost inline · default named',
        turn: ask('inline', 'check', {
          kind: 'confirm',
          question: 'This scans every store and every day since 2019. Run it as asked?',
          cost: [
            { label: 'rows scanned', value: '2.3B' },
            { label: 'to run', value: 'about **40 s**' },
            { label: 'records written', value: '0' },
          ],
          yes: 'Run it',
          no: 'Narrow to Q3 first',
          default: false,
          hint: 'Default: narrow first',
        }),
      },
      { caption: 'Heading + description · cost strip', turn: ask('strip', 'check', backtest) },
      {
        caption: 'Writes records',
        turn: ask('writes', 'act', {
          kind: 'confirm',
          question: 'Add two crosses to the 2026 crossing block?',
          description: 'Nothing is sown until the plan is published.',
          costAs: 'strip',
          cost: [
            { label: 'Crosses', value: '2' },
            { label: 'Pollinations', value: '80' },
            { label: 'Writes', value: '2', tone: 'warn' },
          ],
          yes: 'Add to plan',
          no: 'Not now',
          dismiss: true,
          align: 'end',
        }),
      },
      {
        caption: 'Minimal yes / no',
        turn: ask('minimal', 'scope', {
          kind: 'confirm',
          question: "Use last season's breeding goals as the defaults?",
          yes: 'Yes',
          no: 'No',
        }),
      },
      {
        caption: 'With a caveat',
        turn: ask('caveat', 'check', {
          kind: 'confirm',
          question: 'This window includes the March outage. Leave those days out?',
          caveat: { label: 'data gap', text: 'Stores 12–18 reported no sales from 3 to 9 Mar.' },
          yes: 'Leave them out',
          no: 'Include anyway',
        }),
      },
      {
        caption: 'Answered',
        now: Date.parse('2026-09-29T10:00:45Z'),
        turn: ask(
          'answered',
          'check',
          {
            kind: 'confirm',
            question: 'This scans every store and every day since 2019. Run it as asked?',
            label: 'Decision',
            yes: 'Run it',
            no: 'Narrow to Q3 first',
            default: false,
            settled: { no: 'Narrowed to Q3 first' },
            hint: 'Scanned **180M** rows in **6 s**',
          },
          { state: 'answered', value: false, answeredAt: '2026-09-29T10:00:20Z' },
        ),
      },
      {
        caption: 'At 280px',
        narrow: true,
        turn: ask('narrow', 'check', { ...backtest, description: undefined, heading: true, no: 'Narrow first' } as AskSpec),
      },
    ],
  },
};
