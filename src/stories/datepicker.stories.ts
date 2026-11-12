import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/datepicker.js';

const meta: Meta = {
  title: 'Components/DatePicker',
  component: 'ctk-datepicker',
  argTypes: { mode: { control: 'select', options: ['single', 'range'] } },
  args: { label: 'Due date', mode: 'single' },
};
export default meta;

type Story = StoryObj;

export const Single: Story = {
  args: { mode: 'single' },
  render: (args) => html`
    <div style="max-width:280px;">
      <ctk-datepicker label=${args.label} mode=${args.mode}></ctk-datepicker>
    </div>
  `,
};

export const Range: Story = {
  args: { label: 'Trip dates', mode: 'range' },
  render: Single.render,
};
