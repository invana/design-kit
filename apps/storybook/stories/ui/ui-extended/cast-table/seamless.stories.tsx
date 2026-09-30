import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardContent, CastTable } from '@invana/ui';

const meta: Meta<typeof CastTable> = {
  title: 'UI/UI Extended/CastTable',
  component: CastTable,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `seamless` inside a card: the cast draws no box of its own, only the rules
 * between its rows, and its outer columns sit flush with the card's content.
 */
export const Seamless: Story = {
  render: () => (
    <Card className="w-[620px]">
      <CardContent>
        <CastTable
          cast={{
            decide: 'llm/anthropic-prod/claude-opus-5',
            extract: 'llm/ollama-local/llama-3.1-8b',
          }}
          readOnly
          seamless
        />
      </CardContent>
    </Card>
  ),
};
