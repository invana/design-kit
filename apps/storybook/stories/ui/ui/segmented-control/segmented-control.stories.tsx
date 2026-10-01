import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { PanelBox, SegmentedControl as SegmentedControlPart, Terminal, TerminalLine, type SegmentedOption } from '@invana/ui';

import data from '../../../../fixtures/ui/segmented-control.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Log, type Variant } from '../../../_story/variant-board';

type Level = 'info' | 'warn' | 'error';

interface SegmentedVariant extends Variant {
  props: {
    'aria-label': string;
    value: string | null;
    options: SegmentedOption[];
    variant?: 'tint' | 'solid';
    size?: 'xs' | 'sm' | 'md';
    stretch?: boolean;
    readOnly?: boolean;
  };
  /** The Stretch variant filters a log in a panel header. */
  panel?: {
    title: string;
    columnTemplate: string;
    lines: { time: string; level: Level; message: string }[];
  };
}

const VARIANTS = data as SegmentedVariant[];

interface Args {
  variant: string;
  onValueChange: (value: string) => void;
}

const meta = {
  title: 'UI/UI/SegmentedControl',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import * as React from 'react';", "import { SegmentedControl } from '@invana/ui';"],
            picked.map((v) => {
              const { value, options, ...rest } = v.props;
              return {
                comment: v.caption,
                data: { options },
                setup: v.props.readOnly
                  ? undefined
                  : [
                      `const [value, setValue] = React.useState(${JSON.stringify(value)});`,
                      '// Called with the picked option\'s value, e.g. "layers".',
                      'const onValueChange = (next: string) => setValue(next);',
                    ].join('\n'),
                call: jsx('SegmentedControl', {
                  ...Object.fromEntries(
                    Object.entries(rest).map(([k, x]) => [k, typeof x === 'string' ? { literal: x } : String(x)]),
                  ),
                  options: 'options',
                  value: v.props.readOnly ? JSON.stringify(value) : 'value',
                  onValueChange: v.props.readOnly ? undefined : 'onValueChange',
                }),
              };
            }),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onValueChange: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** One control, controlled: the pick it shows is the one the story holds. */
function Live({ v, onValueChange, log }: { v: SegmentedVariant; onValueChange: Args['onValueChange']; log: Log }) {
  const [value, setValue] = React.useState(v.props.value);
  const change = (next: string) => {
    setValue(next);
    onValueChange(next);
    log('onValueChange', next);
  };
  const control = <SegmentedControlPart {...v.props} value={value} onValueChange={change} />;
  if (!v.panel) return control;
  return (
    <PanelBox title={v.panel.title} aside={control} flush>
      <Terminal columnTemplate={v.panel.columnTemplate}>
        {v.panel.lines
          .filter((l) => value === 'all' || value === l.level)
          .map((l) => (
            <TerminalLine key={l.time} level={l.level} columns={[l.time, l.level.toUpperCase(), l.message]} />
          ))}
      </Terminal>
    </PanelBox>
  );
}

/**
 * One choice among a few, read in place — every variant from `fixtures/ui/segmented-control.json`.
 * Pick an option: `onValueChange` receives its value and the story holds it. Stretch filters
 * a log by level; `Debug` is drawn but disabled because this step left none.
 */
export const SegmentedControl: Story = {
  render: ({ variant, onValueChange }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <Live v={v} onValueChange={onValueChange} log={log} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const cell = within(canvas.getByRole('group', { name: 'Default' }));
    await step('Pick Layers', async () => {
      await userEvent.click(cell.getByRole('radio', { name: 'Layers' }));
      await expect(args.onValueChange).toHaveBeenCalledWith('layers');
    });
    await step('The pick moves and is logged', async () => {
      await expect(cell.getByRole('radio', { name: 'Layers' })).toHaveAttribute('aria-checked', 'true');
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"layers"');
    });
    await step('Filtering the log to errors leaves one line', async () => {
      const stretch = within(canvas.getByRole('group', { name: 'Stretch' }));
      await userEvent.click(stretch.getByRole('radio', { name: 'Error' }));
      await expect(stretch.queryByText(/retrying/)).toBeNull();
      await expect(stretch.getByText(/connector timed out/)).toBeInTheDocument();
    });
  },
};
