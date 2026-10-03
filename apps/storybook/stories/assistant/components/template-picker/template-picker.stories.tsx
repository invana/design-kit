import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { TemplatePicker as TemplatePickerPart, type TemplatePickerProps } from '@invana/assistant';

import data from '../../../../fixtures/assistant/template-picker.json';
import { inline, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log } from '../../../_story/variant-grid';

interface PickerVariant {
  caption: string;
  props: Omit<TemplatePickerProps, 'onSelect'>;
}

const VARIANTS = data as unknown as PickerVariant[];

interface Args {
  variant: string;
  onSelect: (id: string) => void;
}

/** A picker as its consumer holds it: the template in use is the story's, and moves on a pick. */
function LivePicker({ variant, onSelect, log }: { variant: PickerVariant; onSelect: (id: string) => void; log: Log }) {
  const [value, setValue] = React.useState(variant.props.value);
  return (
    <TemplatePickerPart
      {...variant.props}
      value={value}
      onSelect={(id) => {
        onSelect(id);
        log('onSelect', id);
        setValue(id);
      }}
    />
  );
}

const meta = {
  title: 'Assistant/Components/TemplatePicker',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { useState } from 'react';", "import { TemplatePicker } from '@invana/assistant';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { options: v.props.options },
              setup: `// onSelect receives the template's id; re-render the same records with it.\nconst [value, setValue] = useState(${inline(v.props.value)});`,
              call: [
                '<TemplatePicker',
                `  heading="${v.props.heading}"`,
                '  options={options}',
                '  value={value}',
                '  onSelect={setValue}',
                `  footnote="${v.props.footnote}"`,
                '/>',
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onSelect: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * Render the same records a different way. Unavailable options are listed, not hidden — the
 * reason a template does not fit is information about the data.
 */
export const TemplatePicker: Story = {
  render: ({ variant, onSelect }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <LivePicker variant={v} onSelect={onSelect} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const c = within(within(canvasElement).getByRole('group', { name: 'Default' }));
    await step('Pick another template: the selection moves to it', async () => {
      await userEvent.click(c.getByRole('option', { name: /bars-h@2/ }));
      await expect(args.onSelect).toHaveBeenCalledWith('bars-h@2');
      await expect(c.getByRole('option', { name: /bars-h@2/ })).toHaveAttribute('aria-selected', 'true');
      await expect(c.getByRole('option', { name: /line-time@2/ })).toBeDisabled();
    });
  },
};
