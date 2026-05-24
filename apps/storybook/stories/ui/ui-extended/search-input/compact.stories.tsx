import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SearchInput } from '@invana/ui';

const meta: Meta<typeof SearchInput> = {
  title: 'UI/UI Extended/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};
