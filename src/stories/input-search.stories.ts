import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/input-search.js';

const meta: Meta = {
  title: 'Components/Input Search',
  component: 'ctk-input-search',
  argTypes: { placeholder: { control: 'text' } },
  args: { placeholder: 'Search panels' },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`<ctk-input-search placeholder=${args.placeholder}></ctk-input-search>`,
};
