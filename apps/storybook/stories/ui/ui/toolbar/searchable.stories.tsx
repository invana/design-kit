// import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toolbar } from '@invana/ui';


// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export

const meta: Meta<typeof Toolbar> = {
  title: 'UI/UI/Toolbar',
  component: Toolbar,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  // tags: ['autodocs'],
  args: {
  },
};


// // More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export default meta;
type Story = StoryObj<typeof meta>;

export const Searchable: Story = {
  args: {
  },
};
