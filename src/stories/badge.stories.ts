import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/badge.js';

const meta: Meta = {
  title: 'Components/Badge',
  component: 'ctk-badge',
  argTypes: { variant: { control: 'select', options: ['default', 'accent', 'danger', 'muted'] } },
  args: { variant: 'default' },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`<ctk-badge variant=${args.variant}>New</ctk-badge>`,
};

export const Variants: Story = {
  render: () => html`
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <ctk-badge>Default</ctk-badge>
      <ctk-badge variant="accent">Accent</ctk-badge>
      <ctk-badge variant="danger">Danger</ctk-badge>
      <ctk-badge variant="muted">Muted</ctk-badge>
    </div>
  `,
};
