import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Showcase as Gallery, type StoryModule } from '../_story/showcase';

// Every `Blocks/Components/*` story, as it is — its own JSON, args and interactions.
const MODULES = import.meta.glob<StoryModule>('./components/*/*.stories.tsx', { eager: true });

const meta: Meta = {
  title: 'Blocks/Showcase',
  parameters: {
    layout: 'padded',
    docs: { source: { code: '// Each section is a Blocks/Components story — open it for its data and code.' } },
  },
};

export default meta;

/**
 * Every block on one page, each with its variants, drawn by its own `Components` story — so this
 * page shows exactly what those stories show, and a new component appears here by having one.
 */
export const Showcase: StoryObj = {
  render: () => <Gallery modules={MODULES} root="Blocks/Components" />,
  play: async ({ canvasElement }) => {
    const sections = canvasElement.querySelectorAll('[data-showcase]');
    await expect(sections).toHaveLength(Object.keys(MODULES).length);
  },
};
