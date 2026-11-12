import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../components/text-input.js';

const meta: Meta = {
  title: 'Components/TextInput',
  component: 'ctk-text-input',
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    type: { control: 'select', options: ['text', 'email', 'password', 'number'] },
    disabled: { control: 'boolean' },
  },
  args: { label: 'Topping', placeholder: 'e.g. extra pickles', hint: '', error: '', type: 'text', disabled: false },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <ctk-text-input
      label=${args.label}
      placeholder=${args.placeholder}
      hint=${args.hint}
      error=${args.error}
      type=${args.type}
      ?disabled=${args.disabled}
    ></ctk-text-input>
  `,
};

export const WithError: Story = {
  args: { error: 'This field is required.' },
  render: Default.render,
};
