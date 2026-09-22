import type { Meta, StoryObj } from '@storybook/react-vite';
import { PropertyList, PropertyRow, RunStatusText } from '@invana/ui';

const meta: Meta<typeof RunStatusText> = {
  title: 'UI/UI Extended/RunStatusText',
  component: RunStatusText,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const STATUSES: [string, string][] = [
  ['queued', 'nothing dispatched yet'],
  ['running', 'in flight — the only tone that moves'],
  ['succeeded', 'finished, and the result stands'],
  ['cannot_answer', 'the machinery succeeded; the graph cannot answer inside this world'],
  ['awaiting_approval', 'parked at a gate, spending nothing'],
  ['failed', 'a bound was spent, or a step could not run'],
  ['cancelled', 'a person stopped it'],
  ['purged', 'kept 90 days — the counts stay, the documents do not'],
  ['reconciling', 'a status the kit has never heard of, in the neutral'],
];

/**
 * How a run ended, in the engine's own word.
 *
 * `succeeded` and `cannot_answer` are deliberately two tones over one machine
 * outcome: the run worked, and the graph still has no answer inside this world.
 * A single green word for both would hide the only fact the reader needs.
 *
 * The word is always written, so colour never carries the state alone.
 */
export const Default: Story = {
  render: () => (
    <div className="w-[560px]">
      <PropertyList labelWidth={148}>
        {STATUSES.map(([status, what]) => (
          <PropertyRow key={status} label={<RunStatusText status={status} dot />}>
            {what}
          </PropertyRow>
        ))}
      </PropertyList>
    </div>
  ),
};
