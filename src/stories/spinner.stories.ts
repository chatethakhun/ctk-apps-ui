import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/spinner.js';
import '../components/progress.js';

const meta: Meta = {
  title: 'Components/Spinner & Progress',
  args: { value: 60 },
  argTypes: { value: { control: { type: 'range', min: 0, max: 100 } } },
};
export default meta;

type Story = StoryObj<{ value: number }>;

export const Spinner: Story = {
  render: () => html`
    <div style="display:flex;gap:16px;align-items:center">
      <ctk-spinner size="sm"></ctk-spinner>
      <ctk-spinner></ctk-spinner>
      <ctk-spinner size="lg"></ctk-spinner>
    </div>
  `,
};

export const Progress: Story = {
  render: (args) => html`<div style="width:320px"><ctk-progress label="Uploading" .value=${args.value}></ctk-progress></div>`,
};
