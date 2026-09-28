import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { RichSelect } from '@invana/ui';
import { ChatSessionComposer } from '@invana/assistant';
import { ArrowUp, Globe, Settings2 } from 'lucide-react';

const meta: Meta<typeof RichSelect> = {
  title: 'UI/UI Extended/RichSelect',
  component: RichSelect,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Every control in a composer is one `RichSelect` with `appearance="inline"`,
 * so the ask kind and the world read as one row.
 *
 * The world picker opens upward and carries what a plain select cannot: a
 * disabled world **with its reason**, a **toggle** that scopes the choice
 * (*Next ask only* — it keeps the menu open, and the trigger wears a tag while
 * it is on), and an **action** below the options (*Manage worlds…*), which is
 * never mistaken for a value. An inline trigger shows only its value, so each
 * carries `triggerAriaLabel` — the name of the control, not of the choice.
 */
export const ComposerToolbar: Story = {
  render: function Render() {
    const [text, setText] = useState('');
    const [kind, setKind] = useState<string>('nl');
    const [world, setWorld] = useState<string>('eu-h1');
    const [nextOnly, setNextOnly] = useState(false);
    return (
      <ChatSessionComposer
        value={text}
        onChange={setText}
        onSend={() => setText('')}
        placeholder="Ask anything about your graph…"
        sendIcon={<ArrowUp />}
        toolbarStart={
          <>
            <RichSelect
              appearance="inline"
              side="top"
              triggerAriaLabel="Ask kind"
              value={kind}
              onChange={(v) => setKind(v as string)}
              options={[
                { value: 'nl', label: 'Natural language' },
                { value: 'ql', label: 'Query language' },
              ]}
            />
            <RichSelect
              appearance="inline"
              side="top"
              label="Ask in"
              triggerAriaLabel="World"
              triggerIcon={Globe}
              triggerTag={nextOnly ? 'next ask only' : undefined}
              value={world}
              onChange={(v) => setWorld(v as string)}
              options={[
                { value: 'everything', label: 'Everything', description: 'inside the guardrails' },
                { value: 'eu-h1', label: 'EU · H1 2026', description: '3 models · no third party' },
                { value: 'us', label: 'US carriers', description: '2 models · no stitches' },
                { value: 'nothing-leaves', label: 'Nothing leaves', description: 'no external model, no third party' },
                {
                  value: 'h1-2025',
                  label: 'H1 · 2025 review',
                  disabled: true,
                  disabledReason: 'names airways v3, which is unpublished',
                },
              ]}
              toggles={[
                { id: 'next-only', label: 'Next ask only', checked: nextOnly, onCheckedChange: setNextOnly },
              ]}
              actions={[{ id: 'manage', label: 'Manage worlds…', icon: Settings2, onSelect: () => {} }]}
            />
          </>
        }
      />
    );
  },
};
