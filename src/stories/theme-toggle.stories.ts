import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/theme-toggle.js';

const meta: Meta = {
  title: 'Components/ThemeToggle',
  component: 'ctk-theme-toggle',
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`<ctk-theme-toggle></ctk-theme-toggle>`,
};
