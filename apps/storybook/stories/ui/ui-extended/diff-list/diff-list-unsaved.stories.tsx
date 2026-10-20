import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Button, DiffList, DiffRow, Eyebrow, type DiffOp } from '@invana/ui';
import { RotateCcw } from 'lucide-react';

const meta = {
  title: 'UI/UI Extended/DiffListUnsaved',
  parameters: { layout: 'padded' }
} satisfies Meta;

export default meta;
type Story = StoryObj;

const CHANGES: { id: string; op: DiffOp; name: string; type: string; description: string }[] = [
  { id: 'doh', op: 'add', name: 'DOH', type: 'airport', description: 'New airport · Doha' },
  { id: 'dxb', op: 'change', name: 'DXB', type: 'airport', description: 'runways 2 → 3' },
  { id: 'muc', op: 'remove', name: 'MUC', type: 'airport', description: 'Deleted with its route from FRA' }
];

/**
 * Changes made and not yet saved: `marker="chip"` puts the sign in a tinted square — amber for
 * what is new or altered, muted for what goes — with a `description` line under the name. A row
 * with `onActivate` is a button (here: show it), its `actions` stay outside it (here: revert), and
 * `selected` marks the one shown.
 */
export const DiffListUnsaved: Story = {
  render: function Render() {
    const [rows, setRows] = useState(CHANGES);
    const [picked, setPicked] = useState<string | null>('dxb');
    return (
      <>
        <Eyebrow>Unsaved · {rows.length}</Eyebrow>
        <DiffList>
        {rows.map((c) => (
          <DiffRow
            key={c.id}
            op={c.op}
            marker="chip"
            kind={c.type}
            description={c.description}
            selected={picked === c.id}
            onActivate={() => setPicked(c.id)}
            activateTitle="Show it on the board"
            actions={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Revert ${c.name}`}
                onClick={() => setRows((r) => r.filter((x) => x.id !== c.id))}
              >
                <RotateCcw />
              </Button>
            }
          >
            {c.name}
          </DiffRow>
        ))}
        </DiffList>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /DOH/ }));
    await expect(canvas.getByRole('button', { name: /DOH/ }).closest('li')).toHaveAttribute('aria-current', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Revert MUC' }));
    await expect(canvas.queryByText('MUC')).not.toBeInTheDocument();
  }
};
