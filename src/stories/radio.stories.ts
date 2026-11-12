import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/radio.js';

const meta: Meta = {
  title: 'Components/Radio',
  component: 'ctk-radio',
};
export default meta;

type Story = StoryObj;

export const Group: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:10px;">
      <ctk-radio name="size" value="small" label="Small" checked></ctk-radio>
      <ctk-radio name="size" value="medium" label="Medium"></ctk-radio>
      <ctk-radio name="size" value="large" label="Large"></ctk-radio>
    </div>
  `,
};
