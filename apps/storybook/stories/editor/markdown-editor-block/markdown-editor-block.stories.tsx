import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { MarkdownEditorBlock } from '@invana/editor';
import { Button, PanelBox } from '@invana/ui';

import variants from '../../../fixtures/editor/markdown-editor-block.json';
import { jsx, snippets, sourceFor, variantArg } from '../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../_story/variant-grid';

interface MarkdownVariant extends Variant {
  props: { value: string; version?: string; placeholder?: string; readOnly?: boolean };
  /** Replace the document from outside — a button in the panel's bar. */
  revert?: { title: string; to: string; version: string; label: string };
}

const VARIANTS = variants as MarkdownVariant[];

interface Args {
  variant: string;
  onChange: (value: string) => void;
  onRevert: (value: string) => void;
}

/** The document in state, as a consumer holds it: every change written back and logged. */
function Live({ v, log, onChange, onRevert }: { v: MarkdownVariant; log: Log } & Omit<Args, 'variant'>) {
  const [value, setValue] = React.useState(v.props.value);
  const change = (next: string) => {
    onChange(next);
    log('onChange', next.length > 48 ? `…${next.slice(-48)}` : next);
    setValue(next);
  };

  if (v.revert) {
    const reverted = value === v.revert.to;
    return (
      <PanelBox
        title={v.revert.title}
        aside={
          <Button
            size="xs"
            variant="ghost"
            disabled={reverted}
            onClick={() => {
              onRevert(v.revert!.to);
              log('revert', v.revert!.version);
              setValue(v.revert!.to);
            }}
          >
            {v.revert.label}
          </Button>
        }
        flush
      >
        <MarkdownEditorBlock value={value} onChange={change} version={reverted ? v.revert.version : v.props.version} />
      </PanelBox>
    );
  }

  return (
    <MarkdownEditorBlock
      value={value}
      onChange={v.props.readOnly ? undefined : change}
      version={v.props.version}
      placeholder={v.props.placeholder}
      readOnly={v.props.readOnly}
    />
  );
}

const meta = {
  title: 'Editor/MarkdownEditorBlock',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { MarkdownEditorBlock } from '@invana/editor';", "import { Button, PanelBox } from '@invana/ui';"],
            picked.map((v) => {
              const call = jsx('MarkdownEditorBlock', {
                value: 'value',
                onChange: v.props.readOnly ? undefined : 'setValue',
                version: v.revert ? `value === v4 ? "${v.revert.version}" : "${v.props.version}"` : v.props.version ? { literal: v.props.version } : undefined,
                placeholder: v.props.placeholder ? 'placeholder' : undefined,
                readOnly: v.props.readOnly ? 'true' : undefined,
              });
              return {
                comment: v.caption,
                data: {
                  initial: v.props.value,
                  ...(v.props.placeholder ? { placeholder: v.props.placeholder } : {}),
                  ...(v.revert ? { v4: v.revert.to } : {}),
                },
                setup: v.props.readOnly
                  ? 'const value = initial;'
                  : [
                      '// The whole document on every edit. The placeholder is drawn, never stored: onChange never sees it.',
                      'const [value, setValue] = React.useState(initial);',
                    ].join('\n'),
                call: v.revert
                  ? [
                      `<PanelBox title="${v.revert.title}" flush aside={`,
                      `  <Button size="xs" variant="ghost" disabled={value === v4} onClick={() => setValue(v4)}>${v.revert.label}</Button>`,
                      '}>',
                      '  ' + call.replace(/\n/g, '\n  '),
                      '</PanelBox>',
                    ].join('\n')
                  : call,
              };
            }),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onChange: fn(), onRevert: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * Plain markdown in mono — what the author types is what the agent is offered — from
 * `fixtures/editor/markdown-editor-block.json`. The version sits in the corner because a running
 * thinking finishes on the version it started with.
 *
 * - **Placeholder** — what the reader gets when nothing is written, here an agent's default
 *   voice. It is drawn, never stored: `onChange` never sees it.
 * - **Read Only** — a published version, opened from history: the record of what a run was
 *   given, so a change is a new version, not an edit to this one.
 * - **Revert** — the document replaced from outside. The new `value` goes into the live view as
 *   one transaction, so the editor keeps its undo history and `Ctrl/Cmd+Z` undoes the revert.
 *
 * Type in any editable cell: every change reaches `onChange` and is written under it.
 */
export const MarkdownEditorBlockStory: Story = {
  name: 'MarkdownEditorBlock',
  render: ({ variant, ...on }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <Live v={v} log={log} {...on} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('Type into the placeholder editor', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Placeholder' }));
      await userEvent.click(cell.getByRole('textbox'));
      // CodeMirror reads the browser's own input, which synthetic key events do not produce.
      document.execCommand('insertText', false, 'Be brief.');
      await waitFor(() => expect(args.onChange).toHaveBeenLastCalledWith('Be brief.'));
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"Be brief."');
    });
    await step('Revert to v4', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Revert' }));
      await userEvent.click(cell.getByRole('button', { name: 'Revert to v4' }));
      await expect(args.onRevert).toHaveBeenCalledTimes(1);
      await expect(cell.getByText('v4 · reverted')).toBeInTheDocument();
      await expect(cell.getByRole('button', { name: 'Revert to v4' })).toBeDisabled();
    });
  },
};
