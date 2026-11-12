import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/textarea.js';

const meta: Meta = {
  title: 'Components/Textarea',
  component: 'ctk-textarea',
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    rows: { control: { type: 'number', min: 2, max: 10 } },
    disabled: { control: 'boolean' },
  },
  args: { label: 'Order notes', placeholder: 'Anything we should know?', rows: 3, disabled: false },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <ctk-textarea label=${args.label} placeholder=${args.placeholder} rows=${args.rows} ?disabled=${args.disabled}></ctk-textarea>
  `,
};
