import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/avatar.js';

const meta: Meta = {
  title: 'Components/Avatar',
  component: 'ctk-avatar',
  argTypes: { size: { control: 'select', options: ['sm', 'md', 'lg'] }, initials: { control: 'text' } },
  args: { size: 'md', initials: 'JK' },
};
export default meta;

type Story = StoryObj;

export const Initials: Story = {
  render: (args) => html`<ctk-avatar size=${args.size} initials=${args.initials}></ctk-avatar>`,
};

export const Broken: Story = {
  render: () => html`<ctk-avatar src="https://example.invalid/x.png" initials="AB" alt="Fallback"></ctk-avatar>`,
};
