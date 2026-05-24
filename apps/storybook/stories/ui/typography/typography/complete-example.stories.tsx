import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from '@invana/ui';

const meta: Meta<typeof Typography.H1> = {
  title: 'UI/Typography/Typography',
  component: Typography.H1,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Typography components for consistent text styling across your application.',
      },
    },
  },
  // tags: ['autodocs'],
};


/**
 * Main page heading - largest and most prominent heading.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const CompleteExample: Story = {
  render: () => (
    <div className="max-w-3xl space-y-4">
      <Typography.H1>
        Taxing Laughter: The Joke Tax Chronicles
      </Typography.H1>
      
      <Typography.Lead>
        Once upon a time, in a far-off land, there was a very lazy king who spent
        all day lounging on his throne. One day, his advisors came to him with a
        problem: the kingdom was running out of money.
      </Typography.Lead>
      
      <Typography.H2>
        The King's Plan
      </Typography.H2>
      
      <Typography.P>
        The king thought long and hard, and finally came up with a brilliant plan:
        he would tax the jokes in the kingdom.
      </Typography.P>
      
      <Typography.Blockquote>
        "After all," he said, "everyone enjoys a good joke, so it's only fair that
        they should pay for the privilege."
      </Typography.Blockquote>
      
      <Typography.H3>
        The Joke Tax
      </Typography.H3>
      
      <Typography.P>
        The king's subjects were not amused. They grumbled and complained, but the
        king was firm:
      </Typography.P>
      
      <Typography.List>
        <li>1st level of puns: 5 gold coins</li>
        <li>2nd level of jokes: 10 gold coins</li>
        <li>3rd level of one-liners: 20 gold coins</li>
      </Typography.List>
      
      <Typography.P>
        As a result, people stopped telling jokes, and the kingdom fell into a
        gloom. But there was one person who refused to let the king's foolishness
        get him down: a court jester named Jokester.
      </Typography.P>
      
      <Typography.Muted>
        The end of the tale approaches...
      </Typography.Muted>
    </div>
  ),
};

/**
 * Rich content example with multiple typography variants showcasing different use cases.
 */
